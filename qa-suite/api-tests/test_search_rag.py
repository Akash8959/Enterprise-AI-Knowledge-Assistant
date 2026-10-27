from app.api.routes import search as search_routes
from app.services import ai_service


def test_search_requires_query(api_client, create_authenticated_user):
    """Phase 1: TC-035."""
    _, headers = create_authenticated_user("qa-search-required@example.test")
    response = api_client("GET", "/api/v1/search/", headers=headers)

    assert response.status_code == 422


def test_search_passes_query_and_department_filter(
    api_client, create_authenticated_user, monkeypatch
):
    """Phase 1: TC-036 and TC-037."""
    _, headers = create_authenticated_user(
        "qa-search-engineering@example.test",
        department="Engineering",
    )
    calls = []

    def fake_search(query, department=None, top_k=4):
        calls.append((query, department, top_k))
        return {"documents": [["engineering-only QA text"]]}

    monkeypatch.setattr(search_routes, "search_similar_chunks", fake_search)
    response = api_client(
        "GET",
        "/api/v1/search/",
        params={"query": "engineering QA", "department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["query"] == "engineering QA"
    assert response.json()["department"] == "Engineering"
    assert calls == [("engineering QA", "Engineering", 5)]


def test_rag_post_returns_context_and_source_citation(
    api_client, create_authenticated_user, monkeypatch
):
    """Phase 1: TC-043 and TC-044."""
    _, headers = create_authenticated_user(
        "qa-rag-citation@example.test",
        department="Engineering",
    )
    chunk = "A synthetic QA policy states that review occurs every 12 months."
    monkeypatch.setattr(
        ai_service,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: {
            "documents": [[chunk]],
            "metadatas": [[
                {
                    "filename": "qa-policy.txt",
                    "document_id": 41,
                    "department": "Engineering",
                }
            ]],
        },
    )
    monkeypatch.setattr(ai_service, "client", None)

    response = api_client(
        "POST",
        "/api/v1/rag/",
        json={"query": "How often is review?", "department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 200
    payload = response.json()
    assert chunk in payload["retrieved_chunks"]
    assert "qa-policy.txt" in payload["answer"]
    assert payload["sources"] == [
        {
            "filename": "qa-policy.txt",
            "document_id": 41,
            "department": "Engineering",
            "snippet": chunk,
        }
    ]
    assert payload["used_openai"] is False


def test_rag_post_returns_empty_sources_when_no_chunks(
    api_client, create_authenticated_user, monkeypatch
):
    """Phase 1: TC-042."""
    _, headers = create_authenticated_user("qa-rag-empty@example.test")
    monkeypatch.setattr(
        ai_service,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: {
            "documents": [[]],
            "metadatas": [[]],
        },
    )

    response = api_client(
        "POST",
        "/api/v1/rag/",
        json={"query": "Question with no matching QA content"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["retrieved_chunks"] == []
    assert response.json()["sources"] == []
    assert "No relevant enterprise knowledge found" in response.json()["answer"]


def test_rag_post_requires_query(api_client, create_authenticated_user):
    """Phase 1: TC-041."""
    _, headers = create_authenticated_user("qa-rag-required@example.test")
    response = api_client(
        "POST",
        "/api/v1/rag/",
        json={"department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 422


def test_rag_get_returns_answer_and_sources(
    api_client, create_authenticated_user, monkeypatch
):
    """Phase 1: TC-039 and TC-044."""
    _, headers = create_authenticated_user("qa-rag-get@example.test")
    chunk = "Synthetic citation text for a GET query."
    monkeypatch.setattr(
        ai_service,
        "search_similar_chunks",
        lambda query, department=None, top_k=4: {
            "documents": [[chunk]],
            "metadatas": [[
                {
                    "filename": "get-source.txt",
                    "document_id": 72,
                    "department": "General",
                }
            ]],
        },
    )
    monkeypatch.setattr(ai_service, "client", None)

    response = api_client(
        "GET",
        "/api/v1/rag/",
        params={"query": "Find the synthetic citation"},
        headers=headers,
    )

    assert response.status_code == 200
    assert response.json()["sources"][0]["filename"] == "get-source.txt"


def test_rag_department_is_passed_as_retrieval_filter(
    api_client, create_authenticated_user, monkeypatch
):
    """Phase 1: TC-040; the supplied department matches the user's scope."""
    _, headers = create_authenticated_user(
        "qa-rag-filter@example.test",
        department="Engineering",
    )
    calls = []

    def fake_search(query, department=None, top_k=4):
        calls.append((query, department, top_k))
        return {"documents": [[]], "metadatas": [[]]}

    monkeypatch.setattr(ai_service, "search_similar_chunks", fake_search)
    response = api_client(
        "POST",
        "/api/v1/rag/",
        json={"query": "Engineering question", "department": "Engineering"},
        headers=headers,
    )

    assert response.status_code == 200
    assert calls == [("Engineering question", "Engineering", 4)]
