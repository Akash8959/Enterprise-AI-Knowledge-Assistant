from app.api.routes import search as search_routes
from app.models.document import Document
from app.services import ai_service


def test_document_search_and_rag_routes_require_authentication(
    api_client, monkeypatch, tmp_path
):
    """Phase 1: TC-017 and TC-018."""
    from app.api.routes import upload as upload_routes

    monkeypatch.setattr(upload_routes, "UPLOAD_DIR", tmp_path)
    monkeypatch.setattr(
        upload_routes,
        "store_document_chunks",
        lambda **kwargs: None,
    )
    monkeypatch.setattr(
        search_routes,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: {"documents": [[]]},
    )
    monkeypatch.setattr(
        ai_service,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: {
            "documents": [[]],
            "metadatas": [[]],
        },
    )

    responses = [
        api_client(
            "POST",
            "/api/v1/upload/document",
            files={"file": ("anonymous.txt", b"QA data.", "text/plain")},
        ),
        api_client("GET", "/api/v1/upload/documents"),
        api_client("DELETE", "/api/v1/upload/document/999999"),
        api_client(
            "GET",
            "/api/v1/search/",
            params={"query": "synthetic QA query"},
        ),
        api_client(
            "GET",
            "/api/v1/rag/",
            params={"query": "synthetic QA query"},
        ),
        api_client(
            "POST",
            "/api/v1/rag/",
            json={"query": "synthetic QA query"},
        ),
    ]

    assert [response.status_code for response in responses] == [401] * 6
    assert list(tmp_path.iterdir()) == []


def test_department_filters_cannot_widen_authenticated_scope(
    api_client,
    db_session,
    create_authenticated_user,
    monkeypatch,
):
    """Phase 1: TC-017, TC-019, TC-020, TC-021, TC-022, and TC-047."""
    _, headers = create_authenticated_user(
        "qa-hr-user@example.test",
        department="HR",
    )
    db_session.add(
        Document(
            filename="engineering-qa-only.txt",
            file_type="text/plain",
            file_path="not-created-by-this-test",
            department="Engineering",
            status="Processed",
        )
    )
    db_session.add(
        Document(
            filename="hr-qa-only.txt",
            file_type="text/plain",
            file_path="not-created-by-this-test",
            department="HR",
            status="Processed",
        )
    )
    db_session.commit()

    documents = api_client(
        "GET",
        "/api/v1/upload/documents",
        headers=headers,
    )
    assert documents.status_code == 200
    assert [item["department"] for item in documents.json()] == ["HR"]

    same_department = api_client(
        "GET",
        "/api/v1/upload/documents",
        params={"department": "HR"},
        headers=headers,
    )
    assert same_department.status_code == 200
    assert [item["department"] for item in same_department.json()] == ["HR"]

    assert api_client(
        "GET",
        "/api/v1/upload/documents",
        params={"department": "Engineering"},
        headers=headers,
    ).status_code == 403
    assert api_client(
        "GET",
        "/api/v1/upload/documents",
        params={"department": "All"},
        headers=headers,
    ).status_code == 403

    search_calls = []
    monkeypatch.setattr(
        search_routes,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: (
            search_calls.append((query, department, top_k))
            or {"documents": [[]]}
        ),
    )
    search_response = api_client(
        "GET",
        "/api/v1/search/",
        params={"query": "HR QA"},
        headers=headers,
    )
    assert search_response.status_code == 200
    assert search_response.json()["department"] == "HR"
    assert search_calls == [("HR QA", "HR", 5)]
    assert api_client(
        "GET",
        "/api/v1/search/",
        params={"query": "Engineering QA", "department": "Engineering"},
        headers=headers,
    ).status_code == 403

    rag_calls = []
    monkeypatch.setattr(
        ai_service,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: (
            rag_calls.append((query, department, top_k))
            or {"documents": [[]], "metadatas": [[]]}
        ),
    )
    get_rag = api_client(
        "GET",
        "/api/v1/rag/",
        params={"query": "HR RAG question"},
        headers=headers,
    )
    post_rag = api_client(
        "POST",
        "/api/v1/rag/",
        json={"query": "HR RAG question"},
        headers=headers,
    )
    assert get_rag.status_code == post_rag.status_code == 200
    assert rag_calls == [
        ("HR RAG question", "HR", 4),
        ("HR RAG question", "HR", 4),
    ]
    assert api_client(
        "GET",
        "/api/v1/rag/",
        params={
            "query": "Engineering question",
            "department": "Engineering",
        },
        headers=headers,
    ).status_code == 403
    assert api_client(
        "POST",
        "/api/v1/rag/",
        json={"query": "Engineering question", "department": "Engineering"},
        headers=headers,
    ).status_code == 403
