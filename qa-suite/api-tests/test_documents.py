from pathlib import Path

import pytest

from app.api.routes import upload as upload_routes
from app.models.document import Document


@pytest.fixture
def isolated_upload_directory(tmp_path, monkeypatch):
    monkeypatch.setattr(upload_routes, "UPLOAD_DIR", tmp_path)
    return tmp_path


def test_upload_txt_uses_authenticated_department_and_ignores_client_scope(
    api_client,
    db_session,
    isolated_upload_directory,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-024."""
    _, headers = create_authenticated_user(
        "qa-upload-user@example.test",
        department="Engineering",
    )
    monkeypatch.setattr(
        upload_routes,
        "store_document_chunks",
        lambda **kwargs: None,
    )

    response = api_client(
        "POST",
        "/api/v1/upload/document",
        files={"file": ("qa-policy.txt", b"QA-only policy text.", "text/plain")},
        data={"department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["document"]["department"] == "Engineering"
    stored_document = db_session.query(Document).filter_by(
        id=response.json()["document"]["id"]
    ).one()
    assert Path(stored_document.file_path).is_file()


def test_upload_rejects_department_override_before_writing_file(
    api_client,
    isolated_upload_directory,
    create_authenticated_user,
):
    """Phase 1: TC-017 and TC-022."""
    _, headers = create_authenticated_user(
        "qa-upload-scope@example.test",
        department="General",
    )
    response = api_client(
        "POST",
        "/api/v1/upload/document",
        files={"file": ("forged-department.txt", b"QA data.", "text/plain")},
        data={"department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 403
    assert list(isolated_upload_directory.iterdir()) == []


def test_same_filename_uploads_do_not_overwrite_another_department(
    api_client,
    db_session,
    isolated_upload_directory,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-022 and TC-024."""
    _, engineering_headers = create_authenticated_user(
        "qa-engineering-same-name@example.test",
        department="Engineering",
    )
    _, general_headers = create_authenticated_user(
        "qa-general-same-name@example.test",
        department="General",
    )
    monkeypatch.setattr(
        upload_routes,
        "store_document_chunks",
        lambda **kwargs: None,
    )

    responses = [
        api_client(
            "POST",
            "/api/v1/upload/document",
            files={"file": ("shared-name.txt", b"Engineering fixture.", "text/plain")},
            headers=engineering_headers,
        ),
        api_client(
            "POST",
            "/api/v1/upload/document",
            files={"file": ("shared-name.txt", b"General fixture.", "text/plain")},
            headers=general_headers,
        ),
    ]

    assert [response.status_code for response in responses] == [200, 200]
    documents = [
        db_session.query(Document).filter_by(
            id=response.json()["document"]["id"]
        ).one()
        for response in responses
    ]
    paths = [Path(document.file_path) for document in documents]
    assert documents[0].department == "Engineering"
    assert documents[1].department == "General"
    assert paths[0] != paths[1]
    assert paths[0].read_bytes() == b"Engineering fixture."
    assert paths[1].read_bytes() == b"General fixture."


def test_upload_rejects_unsupported_extension(
    api_client, isolated_upload_directory, create_authenticated_user
):
    """Phase 1: TC-027."""
    _, headers = create_authenticated_user("qa-upload-format@example.test")
    response = api_client(
        "POST",
        "/api/v1/upload/document",
        files={"file": ("qa-data.csv", b"a,b\n1,2", "text/csv")},
        headers=headers,
    )

    assert response.status_code == 400
    assert list(isolated_upload_directory.iterdir()) == []


def test_upload_requires_file_field(api_client, create_authenticated_user):
    """Phase 1: TC-023."""
    _, headers = create_authenticated_user("qa-upload-missing@example.test")
    response = api_client(
        "POST",
        "/api/v1/upload/document",
        data={"department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 422


def test_upload_empty_txt_creates_empty_text_record(
    api_client,
    db_session,
    isolated_upload_directory,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-028."""
    _, headers = create_authenticated_user("qa-empty-upload@example.test")
    monkeypatch.setattr(
        upload_routes,
        "store_document_chunks",
        lambda **kwargs: None,
    )

    response = api_client(
        "POST",
        "/api/v1/upload/document",
        files={"file": ("empty.txt", b"", "text/plain")},
        headers=headers,
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["document"]["status"] == "Empty Text"
    assert payload["total_chunks"] == 0
    assert db_session.query(Document).filter_by(id=payload["document"]["id"]).one()


def test_document_delete_removes_qa_file_and_database_row(
    api_client,
    db_session,
    isolated_upload_directory,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-032 and TC-034."""
    _, headers = create_authenticated_user(
        "qa-delete-owner@example.test",
        department="Engineering",
    )
    deleted_ids = []
    monkeypatch.setattr(
        upload_routes,
        "store_document_chunks",
        lambda **kwargs: None,
    )
    monkeypatch.setattr(
        upload_routes,
        "delete_document_chunks",
        lambda document_id: deleted_ids.append(document_id),
    )
    uploaded = api_client(
        "POST",
        "/api/v1/upload/document",
        files={"file": ("to-delete.txt", b"Temporary QA file.", "text/plain")},
        headers=headers,
    )
    document_id = uploaded.json()["document"]["id"]
    stored_document = db_session.query(Document).filter_by(
        id=document_id
    ).one()
    upload_path = Path(stored_document.file_path)
    assert upload_path.is_file()

    response = api_client(
        "DELETE",
        f"/api/v1/upload/document/{document_id}",
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["document_id"] == document_id
    assert not upload_path.exists()
    assert db_session.query(Document).filter_by(id=document_id).first() is None
    assert deleted_ids == [document_id]


def test_cross_department_delete_has_no_side_effects(
    api_client,
    db_session,
    isolated_upload_directory,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-017 and TC-022."""
    _, headers = create_authenticated_user(
        "qa-delete-non-owner@example.test",
        department="General",
    )
    file_path = isolated_upload_directory / "engineering-private-qa.txt"
    file_path.write_text("Synthetic restricted test content.", encoding="utf-8")
    document = Document(
        filename=file_path.name,
        file_type="text/plain",
        file_path=str(file_path),
        department="Engineering",
        status="Processed",
    )
    db_session.add(document)
    db_session.commit()
    document_id = document.id
    deleted_ids = []
    monkeypatch.setattr(
        upload_routes,
        "delete_document_chunks",
        lambda value: deleted_ids.append(value),
    )

    response = api_client(
        "DELETE",
        f"/api/v1/upload/document/{document_id}",
        headers=headers,
    )

    assert response.status_code == 404
    assert file_path.is_file()
    assert db_session.query(Document).filter_by(id=document_id).first() is not None
    assert deleted_ids == []


def test_document_delete_returns_404_for_unknown_id(
    api_client, create_authenticated_user
):
    """Phase 1: TC-033."""
    _, headers = create_authenticated_user("qa-delete-missing@example.test")
    response = api_client(
        "DELETE",
        "/api/v1/upload/document/999999",
        headers=headers,
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Document not found"
