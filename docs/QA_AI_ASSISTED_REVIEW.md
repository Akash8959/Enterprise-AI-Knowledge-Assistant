# Phase 5 - AI-Assisted QA Test Review

## Purpose and review mode

This phase establishes a repeatable review process for the existing test plan, CSV cases, API/UI tests, GenAI evaluation fixtures, reports, and documented limitations. The local checker is a deterministic Python script, **not a generative AI system**. No independent model/framework was available for offline review. The findings below are an evidence-based assistant review of the repository artifacts plus static checker output; they are not live-model recommendations or confirmed application defects.

No live AI call was made. Although an OpenAI key name is present in `backend/.env`, its value was not read. Gemini is not configured, and DeepEval is not installed. No credentials, private documents, uploaded files, production database, or application data are part of the review.

## Files and beginner-friendly explanations

| File | Explanation |
|---|---|
| [review_qa_artifacts.py](../qa-suite/review/review_qa_artifacts.py) | Reads only the Phase 1 CSV and an explicit list of QA API/UI test files. It checks CSV columns and duplicate IDs, counts test functions and referenced case IDs, and reports unmatched cases, repeated mappings, and plan labels. It prints JSON and does not write or change files. |
| [QA_AI_ASSISTED_REVIEW.md](./QA_AI_ASSISTED_REVIEW.md) | This report explains how to repeat the review and separates verified evidence, suggestions, and policy-dependent concerns for human triage. |
| [QA_PROGRESS.md](./QA_PROGRESS.md) | Tracks completion of the approved Phase 5 workflow and its human-review limitation. |

The checker intentionally does **not** read `.env`, application source, databases, uploaded documents, browser state, or general repository files. It does not evaluate assertion quality, infer defects, or call an AI provider.

## Repeatable human-in-the-loop workflow

1. Run the read-only checker with the repository's existing Python environment.
2. Review every reported count and candidate against the referenced test function and Phase 1 case.
3. Use an AI assistant only with the sanitized QA artifacts needed for the review. Do not provide credentials, `.env` files, uploaded documents, production data, or unapproved application source.
4. Require each recommendation to include a finding class, source file/function or report section, relevant `TC-*` ID if one exists, evidence, confidence, and a suggested verification step.
5. A human reviewer records `Accepted`, `Rejected`, or `Needs confirmation`, plus rationale. Until then, a recommendation is not a confirmed defect and must not be used to weaken or rewrite assertions.
6. Confirm requirements with product/security owners where policy is missing. Record actual execution evidence separately from code-inspection results.
7. Re-run the checker after approved QA-only changes and update this report/checklist with actual output.

Suggested prompt for a future approved local/sanitized assistant review:

> Review only the supplied QA test cases, QA test code, and QA reports. Do not assume an undocumented product requirement. For every finding, quote the exact file/function or case ID and classify it as verified evidence, candidate coverage/assertion/traceability suggestion, or unconfirmed risk. Separate layer overlap from redundant testing. Never infer a passed test, defect, hallucination, security policy, or metric. Include a human disposition field and a safe way to verify each suggestion. If evidence is insufficient, say so.

## Static checker result

Command:

```powershell
& .\backend\venv\Scripts\python.exe .\qa-suite\review\review_qa_artifacts.py
```

Actual result:

```text
CSV cases: 60
CSV columns match the required schema: true
Duplicate CSV case IDs: none
Automated test functions examined: 50
Distinct Phase 1 IDs referenced by automated tests: 38
Unknown Phase 1 IDs: none
CSV cases without automated-test references: 22
Test functions without a Phase 1 case tag: 1
Phase 1 IDs referenced by multiple test functions: 15
Non-CSV plan labels found in test docstrings: UI-06
```

The 22 cases without automated references are `TC-001`, `TC-002`, `TC-019`, `TC-025`, `TC-026`, `TC-029`, `TC-030`, `TC-031`, `TC-038`, `TC-045`, `TC-046`, `TC-049`, `TC-050`, and `TC-051` through `TC-060` except `TC-052`. The output is a deterministic inventory, not a test execution or AI quality score. The checker reads no secret-bearing configuration and does not contact external services. The exact output, including repeated-ID locations, is reproducible by running the command above.

## Review findings and human disposition

Status key:

- **Verified evidence** means the statement is directly supported by the reviewed QA artifact or prior recorded execution report; it is not an assertion that a product defect exists.
- **Suggestion** means a reviewer may consider additional coverage or a clearer assertion.
- **Unconfirmed risk** means the observed behavior could matter, but the intended requirement or policy is not established.

| ID | Class | Evidence and affected test/case | Recommendation | Human disposition |
|---|---|---|---|---|
| REV-01 | Verified evidence | The checker found 60 CSV cases, 38 distinct IDs referenced by 50 automated test functions, no unknown IDs, and 22 cases without automated-test references. Those include basic endpoints, upload formats, performance/browser planning, and other behaviors. | Treat unreferenced IDs as coverage-review prompts, not failures. Decide which require API/UI automation and which are intentionally manual, planning-only, or blocked pending acceptance criteria. | Pending human review |
| REV-02 | Suggestion | [test_rag_get_returns_answer_and_sources](../qa-suite/api-tests/test_search_rag.py) (`TC-039`, `TC-044`) asserts HTTP 200 and only the first citation filename. The POST-path test in the same file checks more response fields. | Consider asserting GET's answer/retrieved-chunk shape and complete citation fields if GET/POST response parity is part of the API contract. Existing shared response logic and the more detailed POST check may make this nonessential. | Pending API owner review |
| REV-03 | Suggestion | [test_dashboard_summary_failure_shows_existing_fallback_state](../qa-suite/ui-tests/test_dashboard_documents_ui.py) (`TC-052`) asserts the empty-state text and the static “Backend RAG Service” label when the summary request is stubbed as 503. The test/report explicitly say the label is not an error notification. | Consider whether the static label assertion adds value; retain it only if presence of that label is itself a requirement. Do not interpret it as evidence of backend health. | Pending UI reviewer |
| REV-04 | Suggestion | The checker found one test function without a Phase 1 CSV tag: [test_chat_api_failure_shows_connection_error](../qa-suite/ui-tests/test_chat_ui.py). Its docstring uses plan label `UI-06`; the Phase 1 CSV uses `TC-*` identifiers. The UI report already describes it as supplementary error coverage without a dedicated CSV ID. | Preserve the distinction in comments/report or add a CSV case only if the owner wants this scenario in the canonical inventory. Do not treat the plan label as a missing/invalid `TC-*` ID. | Pending test-plan owner |
| REV-05 | Suggestion | [test_rag_post_returns_context_and_source_citation](../qa-suite/api-tests/test_search_rag.py) (`TC-043`, `TC-044`) and the Phase 4 tests validate source metadata using complete synthetic metadata. The implementation has fallbacks for missing filename/department metadata, but the current evaluation dataset does not exercise partial metadata. | Consider a deterministic missing/partial-metadata case if fallback citation behavior is an acceptance requirement. | Pending API reviewer |
| REV-06 | Historical security observation; policy now approved | Earlier tests recorded that cross-department filters and unauthenticated upload/search/RAG requests were accepted. The owner has since approved requiring authentication and binding regular users to their account department; current code and tests were updated, but this revision has not been tested. Relevant IDs: `TC-017`, `TC-018`, `TC-022`. | Run the updated isolated API tests only after separate approval. Review existing account department assignments as a separate migration/security task; do not infer that stored values are trusted. `GET /api/v1/stats/summary` remains a separate unauthenticated security follow-up. | Policy approved; implementation verification pending |
| REV-07 | Verified limitation | Phase 2 retrieval/citation tests use mocks; Phase 3 intercepts API calls; Phase 4 injects synthetic retrieval and fake completions. Reports record no real retrieval or provider evaluation. Relevant IDs include `TC-042`-`TC-048`. | Keep these results categorized by test layer. A separately approved isolated corpus and human/live-model protocol is needed for actual retrieval relevance, citation correctness, grounding, or answer-quality claims. | Acknowledged; live evaluation not approved |
| REV-08 | Suggestion | [RAGQueryRequest](../backend/app/api/routes/rag.py) declares `query: str`; [test_rag_post_requires_query](../qa-suite/api-tests/test_search_rag.py) (`TC-041`) covers an omitted field, not an empty or whitespace-only value. | Consider deciding and documenting empty-query behavior, then add a case if required. This is a gap candidate, not a confirmed defect; the current test suite does not establish the intended behavior. | Pending API/product review |

The entries above distinguish historical observations from current implementation status. The checker counts and artifact review predate the current authorization changes and have not been rerun. The department-access policy is now approved, but the code changes in the current worktree have not been test-verified. This review is not a security clearance; existing department assignments and the unauthenticated stats-summary endpoint remain follow-up concerns.

## Repeated mappings and negative-test review

- The checker found 15 IDs attached to multiple test functions. Examples include signup/login behavior across API and UI, and RAG/citation behavior across API, UI, and GenAI service tests. Repeated IDs are not automatically duplicate scenarios: API response construction, UI rendering against intercepted responses, and service behavior with fake completions cover different layers. No duplicated scenario is classified as a defect by this check.
- Existing negative tests cover invalid signup/login inputs, absent/invalid/expired JWTs, unsupported upload extensions, missing upload/query fields, empty documents, missing delete IDs, no RAG context, API error feedback, and an injected unsupported fake completion. This is not evidence that all negative requirements are covered.
- The Phase 4 unsupported answer is deliberately supplied by the test double. It is not an observed model response or measured hallucination.
- The static checker does not score assertion strength or deduce semantic duplication. The evidence-based candidate review and human disposition are required for those judgments.

## Safety and execution limits

- No dependencies were installed and no provider calls, server starts, model downloads, database access, or destructive operations were used.
- The checker only reads the allowlisted CSV and QA test code. It prints counts and test-function references to stdout; it does not create a report file or modify repository files.
- Findings describe only reviewed QA artifacts and already documented observations. They do not establish an undocumented acceptance policy.
- No independent AI review framework or local generative model was used. The review workflow is reproducible and human-gated; the local checker is deterministic.
