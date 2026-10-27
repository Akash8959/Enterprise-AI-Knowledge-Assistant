from playwright.sync_api import Page, expect


def test_chat_sends_department_scoped_query_and_shows_source_citation(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: TC-040, TC-043, TC-044, and TC-047."""
    requests = []
    authorization_headers = []

    def answer_rag(route):
        requests.append(route.request.post_data_json)
        authorization_headers.append(route.request.headers.get("authorization"))
        route.fulfill(
            status=200,
            json={
                "answer": "The synthetic policy review is annual.",
                "retrieved_chunks": ["Synthetic policy text: review is annual."],
                "sources": [
                    {
                        "filename": "ui-rag-policy.txt",
                        "document_id": 701,
                        "department": "Engineering",
                        "snippet": "Synthetic policy text: review is annual.",
                    }
                ],
                "used_openai": False,
            },
        )

    page.route("**/api/v1/rag", answer_rag)
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/chat")
    chat_input = page.get_by_placeholder(
        "Ask a question about your documents..."
    )
    chat_input.fill("How often is the synthetic review?")
    page.get_by_role("button", name="Send").click()

    expect(page.get_by_text("The synthetic policy review is annual.")).to_be_visible()
    expect(page.get_by_text("Verified Enterprise Sources (1)")).to_be_visible()
    expect(page.get_by_text("ui-rag-policy.txt")).to_be_visible()
    expect(page.get_by_text("Synthetic policy text: review is annual.")).to_be_visible()
    assert requests == [
        {
            "query": "How often is the synthetic review?",
        }
    ]
    assert authorization_headers == ["Bearer synthetic-ui-token"]


def test_chat_api_failure_shows_connection_error(
    page: Page, ui_base_url: str, seed_authenticated_session
):
    """Phase 1: UI-06 error behavior; RAG failure is synthetic and intercepted."""
    page.route(
        "**/api/v1/rag",
        lambda route: route.fulfill(
            status=503,
            json={"detail": "Synthetic QA outage"},
        ),
    )
    seed_authenticated_session()
    page.goto(f"{ui_base_url}/chat")
    page.get_by_placeholder(
        "Ask a question about your documents..."
    ).fill("Synthetic QA question")
    page.get_by_role("button", name="Send").click()

    expect(page.get_by_text("Connection Error")).to_be_visible()
    expect(
        page.get_by_text("RAG Server responded with status 503")
    ).to_be_visible()
