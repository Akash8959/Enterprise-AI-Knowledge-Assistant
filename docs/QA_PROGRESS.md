# QA Portfolio Progress

This checklist tracks the QA portfolio phases separately from the application implementation history in [PROJECT_PROGRESS.md](./PROJECT_PROGRESS.md).

## Phase 1 - Test Plan and Test Cases

- [x] Inspect the current implementation before defining test behavior.
- [x] Define the manual test scope, prerequisites, and test-data safety rules.
- [x] Write API and UI test cases tied to implemented routes and screens.
- [x] Create the required CSV test case inventory with at least 40 cases and exactly the specified columns/types.
- [x] Create a requirement traceability matrix and link every case reference to a CSV case ID.
- [x] Include explicit unverified coverage for authorization policy, SSE, NFR targets, and browser support.
- [x] Link all Phase 1 deliverables from the test plan.
- [x] Validate CSV columns/types and traceability references: 60 cases, 29 requirements, 64 mappings, no unknown or unmapped case IDs.
- [x] Keep QA documentation separate from application source code.
- [x] Mark test outcomes as unmeasured placeholders until a real run.
- [ ] Execute the plan in an isolated QA environment after approval to create and modify disposable test data.

**Phase status:** Phase 1 planning deliverables complete. Test execution has not started.

**Phase deliverables:**

- [QA_PHASE_1_TEST_PLAN.md](./QA_PHASE_1_TEST_PLAN.md) - scope, safety notes, setup commands, and execution record.
- [test-cases.csv](../qa-suite/test-cases/test-cases.csv) - canonical manual case inventory.
- [QA_TRACEABILITY_MATRIX.md](./QA_TRACEABILITY_MATRIX.md) - requirement-to-case mapping and verification status.

**Inventory totals:** 60 test cases; 29 requirement rows; 64 requirement-to-case mappings.

**Next action:** Wait for the user to type `next` before starting another phase.

## Phase 2 - API Automation

- [x] Review Phase 1 plan, case inventory, and traceability matrix.
- [x] Inspect actual FastAPI routes, JWT expiration handling, database configuration, and department filtering/authorization behavior.
- [x] Create QA-only pytest/HTTPX API automation files and Postman collection/environment template.
- [x] Map automated test functions to Phase 1 case IDs; static validation found no unknown references.
- [x] Keep credentials blank and isolate test database, upload files, embeddings, vector calls, and LLM calls in the test harness.
- [x] Inspect all created file contents and statically validate Python syntax, Postman JSON, and isolation/cleanup wiring without importing the app or executing tests.
- [x] Install API test dependencies into the backend virtual environment after approval.
- [x] Execute the isolated API pytest suite after approval and record genuine results.
- [x] Validate the original Postman collection and environment JSON plus method/path coverage against inspected routes.
- [ ] Revalidate the updated Postman artifacts after the approved authentication changes.
- [x] Generate the API automation report with actual counts, warnings, traceability IDs, and limitations.
- [x] Record the approved policy: public signup assigns `user`/`General`; protected document, search, and RAG endpoints require authentication and use the authenticated department; no admin privileges.
- [ ] Execute the updated authorization tests after approval; implementation changes in the current worktree remain unverified.
- [ ] Review existing account department assignments as a separate migration/security task; no database records were changed.
- [ ] Separately review unauthenticated `GET /api/v1/stats/summary`; it remains unchanged by the approved security fix.

**Phase status:** API automation executed in an isolated in-process test harness. No API server was started and no application source code was modified.

**Phase 2 files:**

- [requirements-api.txt](../qa-suite/requirements-api.txt) - pytest and HTTPX test dependencies.
- [pytest.ini](../qa-suite/pytest.ini) - pytest discovery settings for the QA suite.
- [conftest.py](../qa-suite/api-tests/conftest.py) - isolated app setup, in-memory database, HTTPX client, and disposable users.
- [test_auth_jwt.py](../qa-suite/api-tests/test_auth_jwt.py) - login, bearer-token, expiry, and invalid-token cases.
- [test_documents.py](../qa-suite/api-tests/test_documents.py) - upload validation, empty input, deletion, and cleanup cases.
- [test_search_rag.py](../qa-suite/api-tests/test_search_rag.py) - search, RAG, and citations using mocked retrieval.
- [test_department_access.py](../qa-suite/api-tests/test_department_access.py) - authentication and department-scope checks; current tests have not been executed.
- [collection.json](../qa-suite/postman/collection.json) - Postman requests for implemented API routes.
- [environment.template.json](../qa-suite/postman/environment.template.json) - local-only Postman variables with credential/token fields blank.
- [QA_API_TEST_REPORT.md](./QA_API_TEST_REPORT.md) - genuine pytest results, exact commands, Postman validation, security observations, and remaining limitations.

**Historical pytest result, before current authorization changes:** 28 passed, 0 failed, 0 errors, 0 skipped, 0 blocked; 7 deprecation warnings; 3.33 seconds. This does not verify the changed tests or implementation.

**Historical Postman validation:** 13 collection requests covered 13 verified method/path pairs before the current edits; environment email/password/token values are blank and base URL is local. The updated artifacts have not been revalidated or sent to a server.

**Department access note:** The historical Phase 2 tests observed unauthenticated document/search/RAG access and caller-selected department filtering. The access-control policy has since been approved and code/tests have been updated, but no tests were run for these changes. Existing account department assignments were not changed or verified. The unauthenticated stats-summary route remains a separate follow-up.

**Static QA-file validation:** Python syntax and test-ID references were checked before execution. These checks are separate from the pytest outcome.

**Next action:** Do not begin Phase 3 until the user types `next`.

## Phase 3 - UI Automation

- [x] Review Phase 1 and Phase 2 QA documents and inspect the actual frontend routes, auth flow, API wiring, and test configuration.
- [x] Confirm Selenium is not configured and use Python Playwright without duplicate browser tooling.
- [x] Create QA-only browser tests using observed selectors, synthetic browser state, and intercepted API responses.
- [x] Map browser tests to Phase 1 test-case IDs and separate UI coverage from API/integration/manual coverage.
- [x] Install Playwright and download Chromium after approval.
- [x] Run final browser suite after adding the malformed-email case; update the report with the final real count.
- [x] Validate report records actual run details and limitations.

**Phase status:** UI automation executed. Final Chromium run: 17 passed, 0 failed, 0 errors, 0 skipped, 0 blocked in 19.50 seconds. No application source code was modified.

**Phase 3 files:**

- [requirements-ui.txt](../qa-suite/requirements-ui.txt) - Python Playwright and compatible UI test dependency declarations.
- [conftest.py](../qa-suite/ui-tests/conftest.py) - local-only browser fixture, API request blocking, and synthetic session helper.
- [test_auth_ui.py](../qa-suite/ui-tests/test_auth_ui.py) - signup/login, validation, protected redirect, and logout UI cases.
- [test_dashboard_documents_ui.py](../qa-suite/ui-tests/test_dashboard_documents_ui.py) - dashboard, document filter/upload/delete, and UI error cases.
- [test_chat_ui.py](../qa-suite/ui-tests/test_chat_ui.py) - department-scoped chat, citations, and RAG error feedback.
- [QA_UI_TEST_REPORT.md](./QA_UI_TEST_REPORT.md) - actual results, exact commands, test-layer distinctions, and limitations.

**Initial attempt:** 13 passed and 3 failed due to test selector/file-picker assumptions; those test-code issues were corrected. The native browser email-validation case was included in the final run.

**Phase 3 results:** Browser/UI only. API calls were intercepted; no backend/integration or manual tests were executed. The recorded browser run predates the current frontend bearer-token changes and does not verify them.

**Next action:** Phase 3 completed; Phase 4 was started after the user's explicit instruction.

## Phase 4 - GenAI Evaluation

- [x] Inspect Phase 1-3 QA documents and verify the RAG, embedding, vector store, prompt, and citation implementation.
- [x] Check available GenAI configuration and evaluation tooling without exposing credentials or making a provider request.
- [x] Create a synthetic evaluation dataset with references, contexts, expected sources, and Phase 1 case mappings.
- [x] Create deterministic offline pytest checks using mocked retrieval and completion data; keep QA artifacts outside application source.
- [x] Run the approved isolated offline evaluation and record genuine results.
- [x] Document the distinction between mocked behavior checks and real model evaluation, including remaining unmeasured criteria.
- [ ] Separately approve and conduct human or live-provider evaluation before reporting real model quality scores.

**Phase status:** Offline mocked evaluation only. No Gemini/OpenAI API calls, package installations, model downloads, server startup, production data, or application source changes.

**Phase 4 files:**

- [evaluation_dataset.json](../qa-suite/genai-evaluation/evaluation_dataset.json) - five synthetic RAG cases, references, contexts, citations, human-review rubric, and an injected unsupported-answer control.
- [test_genai_evaluation.py](../qa-suite/api-tests/test_genai_evaluation.py) - deterministic tests of response wiring, no-context fallback, citation construction, department-filter forwarding, and the fake unsupported-answer path.
- [QA_GENAI_EVALUATION_REPORT.md](./QA_GENAI_EVALUATION_REPORT.md) - measured offline results, exact run command, test-layer explanation, and limitations.

**Actual offline pytest result:** 5 passed, 0 failed, 0 errors, 0 skipped; 7 dependency deprecation warnings; 0.02 seconds. Two initial attempts exposed test-fixture expectation/setup issues, which were corrected without modifying application code; the final run passed.

**Provider status:** No Gemini integration or key configuration was found. An OpenAI key entry exists in `backend/.env`, but its value was not inspected or disclosed. OpenAI/Gemini network and account availability were not tested; no provider request was made. DeepEval is not installed and was not added.

**Quality limitation:** The offline suite uses synthetic contexts, mocked retrieval, and fake completions. It does not measure actual answer relevance, faithfulness, correctness, hallucination rate, semantic retrieval relevance, or citation correctness. These remain unmeasured pending separate human or live-provider evaluation approval.

**Next action:** Phase 4 completed; Phase 5 was started after the user's explicit instruction.

## Phase 5 - AI-Assisted Test Review

- [x] Inspect Phase 1-4 plans, reports, cases, automation tests, GenAI dataset, documented observations, and progress checklist.
- [x] Check available provider and review tooling without disclosing credentials or making network calls.
- [x] Create a standard-library, read-only checker restricted to allowlisted QA artifacts.
- [x] Create a human-in-the-loop review workflow that separates verified evidence, suggestions, and unconfirmed risks.
- [x] Run the approved static checker and verify its output against the CSV/test inventory.
- [x] Record actual checker results and limitations; preserve application and unrelated worktree changes.
- [ ] Human-review each recommendation and confirm product/security policy before classifying a potential risk as a defect.

**Phase status:** Offline artifact review complete; no independent generative AI service/framework was used. No application source code, database, production data, secrets, or uploaded documents were read or changed.

**Phase 5 files:**

- [review_qa_artifacts.py](../qa-suite/review/review_qa_artifacts.py) - deterministic, read-only inventory and traceability checker for the CSV and explicit test-file allowlist.
- [QA_AI_ASSISTED_REVIEW.md](./QA_AI_ASSISTED_REVIEW.md) - evidence-graded review notes, human disposition workflow, checker output, and limitations.

**Actual checker result:** 60 CSV cases; required columns valid; 0 duplicate CSV IDs; 50 automated test functions; 38 distinct Phase 1 IDs referenced; 0 unknown IDs; 22 CSV IDs without automated test references; 1 test function with no CSV case tag; 15 Phase 1 IDs repeated across functions. These are review signals, not confirmed defects.

**Human review required:** Confirm recommendations, automation scope, and department authorization policy with the relevant QA/product/security owners. No claim of actual model-generated review, live AI use, or confirmed application defect is made.

**Next action:** Phase 5 completed; Phase 6 planning artifacts were created after the user's explicit instruction.

## Phase 6 - Performance Testing Using Apache JMeter

- [x] Inspect Phase 1-5 QA artifacts, actual API routes, database configuration, and QA isolation setup.
- [x] Select only verified, anonymous, read-only local endpoints for the initial performance plan.
- [x] Create a configurable JMeter plan with low bounded profiles, endpoint assertions, and pacing.
- [x] Document isolation prerequisites, proposed unapproved thresholds, exact future run commands, and stop conditions.
- [x] Validate the JMeter XML structure and verify endpoint/Phase 1 traceability without starting services or generating traffic.
- [ ] Obtain separate approval to download JMeter and create the temporary isolated backend copy.
- [ ] Start the offline isolated backend and verify loopback binding, model cache use, temporary DB/uploads, and health response.
- [ ] Obtain approval and run baseline, normal-load, then limited-stress scenarios; record actual JMeter and resource metrics.
- [ ] Complete the performance report with genuine measurements and limitations.

**Phase status:** Planning artifacts are created and statically validated. No JMeter installation/download, service startup, performance run, or traffic generation has occurred. Performance results remain `<FILL FROM REAL RUN>`.

**Phase 6 files:**

- [enterprise_ai_performance.jmx](../qa-suite/performance/enterprise_ai_performance.jmx) - configurable, anonymous GET requests to `/health` and `/`.
- [README.md](../qa-suite/performance/README.md) - beginner-friendly scope, safe isolation, proposed profiles, commands, and stop/cleanup guidance.
- [QA_PERFORMANCE_TEST_REPORT.md](./QA_PERFORMANCE_TEST_REPORT.md) - design, proposed thresholds, result placeholders, traceability, and current execution status.

**Selected endpoints:** `GET /health` maps to `TC-053`; `GET /` is supplementary and has no invented Phase 1 ID. Upload, deletion, search, RAG, stats, auth, and LLM-backed routes are excluded.

**Approval boundary:** JMeter download, isolated backend-copy creation/startup, resource monitoring, and test traffic each require separate explicit approval after review of the artifacts.

**Next action:** Phase 6 planning artifacts were created; no JMeter installation or performance traffic was approved or performed. Phase 7 was started after the user's explicit instruction.

## Phase 7 - Docker and GitHub Actions CI/CD

- [x] Inspect the current Git branch/status, existing Docker configuration, dependency files, QA tests, and Phase 1-6 reports.
- [x] Design a QA-only workflow for isolated API/offline GenAI tests and browser tests with synthetic API responses.
- [x] Create a non-root, network-disabled API/GenAI QA Docker runner and an explicit safe build-context allowlist.
- [x] Create a least-privilege GitHub Actions workflow targeting `main`, with JUnit artifacts and failure summaries.
- [x] Document test scope, exclusions, cost/resource considerations, and exact unexecuted reproduction commands.
- [x] Inspect and statically validate all Phase 7 file contents and configuration.
- [x] Install UI QA/browser dependencies only in a temporary copy/environment after approval.
- [x] Run API and offline GenAI pytest suite with the safe existing host fixture after approval; record it as host, not container, execution.
- [x] Run Chromium UI suite against a temporary frontend copy and loopback-only server after approval.
- [ ] Verify the final outcome of the interrupted Docker image build; no completion status was captured.
- [ ] Run the containerized API/offline GenAI suite with no network.
- [ ] Observe an actual GitHub-hosted Actions run after an authorized push or pull request; no push/PR is authorized by this phase.

**Phase status:** Static validation passed. Local API/offline GenAI tests: 33 passed, 0 failed, 0 errors, 0 skipped (host execution, 7 dependency warnings, 3.93s). Local Playwright UI tests: 17 passed, 0 failed, 0 errors, 0 skipped (48.69s). A Docker image build was attempted and interrupted; its final outcome is unknown and unverified. Container testing and hosted GitHub Actions execution have not been verified. Phase 6 remains planning only; no performance execution is claimed.

**Phase 7 files:**

- [qa-ci.yml](../.github/workflows/qa-ci.yml) - GitHub Actions jobs for containerized API/offline GenAI and Playwright Chromium UI tests.
- [Dockerfile](../qa-suite/ci/Dockerfile) - non-root Python test image for the isolated API/GenAI suite.
- [Dockerfile.dockerignore](../qa-suite/ci/Dockerfile.dockerignore) - limits image context and excludes private uploads, local environment files, databases, and caches.
- [summarize_junit.py](../qa-suite/ci/summarize_junit.py) - creates concise test-count and failure summaries from machine-readable pytest reports.
- [QA_CI_CD_REPORT.md](./QA_CI_CD_REPORT.md) - beginner-friendly architecture, safety rules, exclusions, and proposed reproduction commands.

**Approval boundary/results:** File creation and local dependency/browser downloads plus local suite execution were approved. A Docker build was started after the Engine became responsive, but the attempt was interrupted before its final outcome was captured. No container test or hosted workflow run is verified. The UI server ran only from an isolated temp copy on loopback and was stopped; API tests used in-memory SQLite and mocks. No GitHub push, pull request, or repository-setting change was performed. No credentials or GitHub secrets were used.

**Next action:** Stop after Phase 7; do not begin Phase 8 until the user explicitly types `next`.
