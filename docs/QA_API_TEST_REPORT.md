# Phase 2 - API Automation Test Report

## Summary

| Field | Result |
|---|---|
| Execution status | Completed |
| Test command | `.\backend\venv\Scripts\python.exe -m pytest -c .\qa-suite\pytest.ini .\qa-suite\api-tests -q` |
| Outcome | **28 passed, 0 failed, 0 errors, 0 skipped, 0 blocked** |
| Duration | 3.33 seconds (reported by pytest) |
| Warnings | 7 deprecation warnings from SQLAlchemy, Pydantic, and PyMuPDF/SWIG |
| API server | Not started; requests were dispatched in-process through HTTPX ASGI transport |
| Test database | In-memory SQLite, created and dropped per test |
| Application source changes | None |

These are results from the real pytest execution shown below. They apply only to this isolated automated suite; they do not mean every Phase 1 manual case has been run.

## Environment and safety controls

- Dependencies were installed into the existing backend virtual environment using the approved `qa-suite/requirements-api.txt`. Pytest resolved to version `8.4.2`; HTTPX `0.28.1` was already installed.
- The test harness forces `DATABASE_URL=sqlite://` before application import. Each test then creates a separate in-memory SQLite engine using `StaticPool`, overrides the app database dependency, drops its schema, and disposes the engine during fixture teardown.
- The app is imported while the process working directory is a unique temporary directory. This keeps the upload route's import-time `app/uploads` directory outside the repository. Upload tests replace the upload directory with pytest's `tmp_path`.
- ChromaDB and SentenceTransformer are stubbed before app import. Tests mock vector retrieval/storage/deletion and disable the optional LLM. No model download, external AI API call, or real user data is used.
- The suite uses synthetic QA identities and a process-local random JWT secret. No server was started, no production endpoint was targeted, and no destructive operation was performed outside pytest temporary paths or the in-memory database.
- The application module's own import-time `create_all` uses the forced in-memory SQLite URL, not the repository's persistent database file.

## Test results

These results are a **historical run from before the department-authorization changes in the current worktree**. They do not verify the current security behavior; no tests were run for this update.

| Area | Test functions | Result |
|---|---:|---|
| Signup, login, JWT validity/expiry, and token verification | 11 | Passed |
| Upload validation, empty text, document deletion and cleanup | 6 | Passed |
| Search, RAG requests, retrieval filters and citations | 7 | Passed |
| Department filtering and unauthenticated route observations | 4 | Passed |
| **Total** | **28** | **28 passed** |

The department/access observation tests passing means that the implementation at the time of that run behaved as asserted. In particular, an HR user's token did not prevent a request filtering for Engineering documents, and upload/search/RAG requests were accepted without a bearer token under isolated test conditions. The authorization policy has since been approved and the implementation/tests were updated in the current worktree, but those changes have **not** been executed or verified by tests. Existing accounts' department assignments remain unreviewed and unchanged.

### Pytest output

```text
............................                                             [100%]
============================== warnings summary ===============================
backend\app\db\database.py:21
  ... MovedIn20Warning: Deprecated API features detected! These features are not compatible with SQLAlchemy 2.0 ...
backend\app\schemas\user.py:15
  ... PydanticDeprecatedSince20: Support for class-based `config` is deprecated ...
<frozen importlib._bootstrap>:228
  ... DeprecationWarning: builtin type SwigPyPacked has no __module__ attribute
<frozen importlib._bootstrap>:228
  ... DeprecationWarning: builtin type SwigPyObject has no __module__ attribute
<frozen importlib._bootstrap>:228
  ... DeprecationWarning: builtin type swigvarlink has no __module__ attribute

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
28 passed, 7 warnings in 3.33s
sys:1: DeprecationWarning: builtin type swigvarlink has no __module__ attribute
```

Warnings are not test failures. They identify deprecated SQLAlchemy declarative-base usage, deprecated Pydantic model configuration, and PyMuPDF/SWIG deprecations. Application code was not changed to address them.

## Phase 1 traceability

The test functions reference these 31 distinct IDs from the Phase 1 CSV:

`TC-003`, `TC-004`, `TC-005`, `TC-006`, `TC-008`, `TC-009`, `TC-010`, `TC-011`, `TC-012`, `TC-013`, `TC-014`, `TC-015`, `TC-017`, `TC-018`, `TC-023`, `TC-024`, `TC-027`, `TC-028`, `TC-032`, `TC-033`, `TC-034`, `TC-035`, `TC-036`, `TC-037`, `TC-039`, `TC-041`, `TC-042`, `TC-043`, `TC-044`, `TC-047`.

Static validation confirmed that all referenced IDs exist in [the Phase 1 test inventory](../qa-suite/test-cases/test-cases.csv). Phase 1 cases not listed here were not exercised by this API suite.

## Postman collection and environment validation

- [The Postman collection](../qa-suite/postman/collection.json) parsed as JSON and declares the Postman Collection v2.1 schema.
- Its 13 requests cover 13 method/path pairs present in the inspected FastAPI implementation: root, health, signup, login, current user, token verification, upload, document listing, document deletion, semantic search, RAG GET/POST, and dashboard summary.
- [The environment template](../qa-suite/postman/environment.template.json) parsed as JSON and points to `http://127.0.0.1:8000`. Email, password, and token variables are blank.
- These were historical structural/static checks performed before the current authorization updates. The modified collection/environment have not been revalidated, imported into Postman, or used to send a request.
- The delete request is destructive to its selected document; only use it with a disposable document on an isolated QA backend.

## Exact commands used

Install only the QA requirements in the existing backend virtual environment:

```powershell
& .\backend\venv\Scripts\python.exe -m pip install -r .\qa-suite\requirements-api.txt
```

Observed dependency output: pytest `8.4.2` was installed; HTTPX `0.28.1` was already satisfied.

Run the suite with an in-memory SQLite URL and the backend import path:

```powershell
$env:DATABASE_URL = 'sqlite://'
$env:PYTHONPATH = (Resolve-Path .\backend).Path
& .\backend\venv\Scripts\python.exe -m pytest -c .\qa-suite\pytest.ini .\qa-suite\api-tests -q
```

The harness itself sets safe environment values before importing the application and does not rely on a running API server.

## Limitations and follow-up

- This report's measured results predate the current authorization changes. Do not treat them as verification that the current code enforces department scope.
- `GET /api/v1/stats/summary` remains unchanged and unauthenticated in this scope; it returns aggregate counts and recent document metadata and needs a separate security review.
- Existing account department assignments were not reviewed or migrated; stored department values are not thereby proven trusted.
- No SSE implementation was found in the inspected app code; no streaming test was run.
- Retrieval and citation tests use mocks. They validate API response construction, not real embedding quality, vector ranking, external LLM behavior, or factual grounding.
- No performance thresholds, browser matrix, or load tests were executed.
- The suite does not claim coverage of every Phase 1 manual case.
- Actual test results for unrun cases remain `<FILL FROM REAL RUN>`.
