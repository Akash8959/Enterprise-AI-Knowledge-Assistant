from playwright.sync_api import Page, expect


def test_dashboard_renders_api_summary_values(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-052. Summary response is synthetic and intercepted."""
    page.route(
        "**/api/v1/stats/summary",
        lambda route: route.fulfill(
            status=200,
            json={
                "total_documents": 3,
                "processed_documents": 2,
                "failed_documents": 1,
                "total_users": 1,
                "recent_documents": [
                    {
                        "id": 601,
                        "filename": "qa-dashboard-policy.txt",
                        "file_type": "text/plain",
                        "department": "Engineering",
                        "status": "Processed",
                        "created_at": "2026-10-26 12:00:00",
                    }
                ],
            },
        ),
    )
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/dashboard")

    expect(page.get_by_text("3", exact=True)).to_be_visible()
    expect(page.get_by_text("2", exact=True)).to_be_visible()
    expect(page.get_by_text("qa-dashboard-policy.txt")).to_be_visible()


def test_dashboard_summary_failure_shows_existing_fallback_state(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-052. Verifies current fallback UI, not an error notification."""
    page.route(
        "**/api/v1/stats/summary",
        lambda route: route.fulfill(status=503, json={"detail": "QA unavailable"}),
    )
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/dashboard")

    expect(page.get_by_text("No documents uploaded yet.")).to_be_visible()
    expect(page.get_by_text("Backend RAG Service")).to_be_visible()


def test_documents_list_uses_authenticated_scope_without_client_filter(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-019. The API response is synthetic."""
    requests = []

    def respond_with_documents(route):
        requests.append(route.request)
        route.fulfill(
            status=200,
            json=[
                {
                    "id": 611,
                    "filename": "engineering-ui-qa.txt",
                    "file_type": "text/plain",
                    "department": "Engineering",
                    "status": "Processed",
                    "created_at": "2026-10-26 12:00:00",
                }
            ],
        )

    page.route("**/api/v1/upload/documents**", respond_with_documents)
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/documents")
    expect(page.get_by_text("engineering-ui-qa.txt")).to_be_visible()
    assert len(requests) == 1
    assert "department=" not in requests[0].url
    assert requests[0].headers["authorization"] == "Bearer synthetic-ui-token"


def test_upload_supported_txt_shows_success_and_document(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-024. Backend upload/list responses are synthetic."""
    uploaded = []
    upload_requests = []

    def list_documents(route):
        route.fulfill(
            status=200,
            json=list(uploaded),
        )

    def upload_document(route):
        upload_requests.append(route.request)
        uploaded.append(
            {
                "id": 621,
                "filename": "ui-upload-qa.txt",
                "file_type": "text/plain",
                "department": "Engineering",
                "status": "Processed",
                "created_at": "2026-10-26 12:00:00",
            }
        )
        route.fulfill(
            status=200,
            json={
                "message": "File uploaded and processed successfully",
                "document": uploaded[0],
                "extracted_text_preview": "Synthetic QA text.",
                "total_chunks": 1,
            },
        )

    page.route("**/api/v1/upload/documents**", list_documents)
    page.route("**/api/v1/upload/document", upload_document)
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/documents")
    page.locator('input[type="file"]').set_input_files(
        {
            "name": "ui-upload-qa.txt",
            "mimeType": "text/plain",
            "buffer": b"Synthetic QA text.",
        }
    )
    expect(page.get_by_text("ui-upload-qa.txt")).to_be_visible()
    page.get_by_role("button", name="Upload & Vectorize Document").click()

    expect(
        page.get_by_text("File uploaded and processed successfully")
    ).to_be_visible()
    expect(page.get_by_role("heading", name="ui-upload-qa.txt")).to_be_visible()
    assert upload_requests[0].headers["authorization"] == "Bearer synthetic-ui-token"


def test_upload_server_error_is_visible(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-024. The failure response is synthetic and intercepted."""
    page.route(
        "**/api/v1/upload/documents**",
        lambda route: route.fulfill(status=200, json=[]),
    )
    page.route(
        "**/api/v1/upload/document",
        lambda route: route.fulfill(
            status=500,
            json={"detail": "Synthetic QA upload failure"},
        ),
    )
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/documents")
    page.locator('input[type="file"]').set_input_files(
        {
            "name": "ui-upload-failure-qa.txt",
            "mimeType": "text/plain",
            "buffer": b"Synthetic QA upload request.",
        }
    )
    page.get_by_role("button", name="Upload & Vectorize Document").click()

    expect(page.get_by_text("Synthetic QA upload failure")).to_be_visible()


def test_document_delete_cancel_keeps_document_visible(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-032. The browser confirmation is dismissed."""
    page.route(
        "**/api/v1/upload/documents**",
        lambda route: route.fulfill(
            status=200,
            json=[
                {
                    "id": 631,
                    "filename": "delete-cancel-qa.txt",
                    "file_type": "text/plain",
                    "department": "General",
                    "status": "Processed",
                    "created_at": "2026-10-26 12:00:00",
                }
            ],
        ),
    )
    page.route(
        "**/api/v1/upload/document/631",
        lambda route: route.fulfill(status=200, json={"document_id": 631}),
    )
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/documents")
    expect(page.get_by_role("heading", name="delete-cancel-qa.txt")).to_be_visible()
    page.once("dialog", lambda dialog: dialog.dismiss())

    page.get_by_role("button", name="Delete").click()

    expect(page.get_by_role("heading", name="delete-cancel-qa.txt")).to_be_visible()


def test_document_delete_confirmation_removes_card(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-032. Delete response is synthetic; no backend file is removed."""
    delete_requests = []
    page.route(
        "**/api/v1/upload/documents**",
        lambda route: route.fulfill(
            status=200,
            json=[
                {
                    "id": 632,
                    "filename": "delete-confirm-qa.txt",
                    "file_type": "text/plain",
                    "department": "General",
                    "status": "Processed",
                    "created_at": "2026-10-26 12:00:00",
                }
            ],
        ),
    )
    def delete_document(route):
        delete_requests.append(route.request)
        route.fulfill(status=200, json={"document_id": 632})

    page.route("**/api/v1/upload/document/632", delete_document)
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/documents")
    expect(page.get_by_role("heading", name="delete-confirm-qa.txt")).to_be_visible()
    page.once("dialog", lambda dialog: dialog.accept())

    page.get_by_role("button", name="Delete").click()

    expect(page.get_by_role("heading", name="delete-confirm-qa.txt")).to_have_count(0)
    assert delete_requests[0].headers["authorization"] == "Bearer synthetic-ui-token"
