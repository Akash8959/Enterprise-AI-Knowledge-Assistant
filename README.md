# Enterprise AI Knowledge Assistant

A full-stack document search and question-answering application. Users can upload supported documents, index their text for semantic retrieval, and ask questions through a web interface that displays retrieved source information.

## Overview

The project combines a Next.js web client with a FastAPI backend. The backend extracts text from PDF, TXT, and DOCX files, divides extracted text into overlapping chunks, creates embeddings with Sentence Transformers, and stores/query those vectors with ChromaDB. Document metadata and user accounts are stored through SQLAlchemy, using SQLite by default.

The RAG endpoint retrieves relevant chunks and returns an answer with source metadata and text snippets. When an OpenAI SDK client and API key are available, the backend attempts a model completion; otherwise, it uses a local context-based fallback. The repository's backend requirements do not install the OpenAI SDK, so that integration is not enabled by the standard dependency installation alone.

This project is intended for local development and demonstration. Do not use it with sensitive documents or production data without a separate security, privacy, and deployment review.

## Key Features

- Signup and login endpoints that issue JWT access tokens.
- Upload and text extraction for PDF, TXT, and DOCX documents.
- Text chunking and semantic vector indexing with Sentence Transformers and ChromaDB.
- Semantic search and RAG question endpoints with retrieved source metadata and snippets.
- Document upload, listing, search, deletion, and RAG are scoped by the authenticated account's department. Public signup creates `user` accounts in the restricted `General` department; department changes require a trusted process that is not included in this repository.
- A Next.js interface with login/signup, dashboard, document management, analytics, and chat pages.
- Document deletion code that attempts to remove the document file, vector chunks, and database record.

## Technology Stack

- **Backend:** Python, FastAPI, Uvicorn, Pydantic, SQLAlchemy, SQLite, JWT, Passlib/bcrypt.
- **Document processing:** PyMuPDF, python-docx.
- **Retrieval:** Sentence Transformers (`all-MiniLM-L6-v2`) and ChromaDB.
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, Axios.
- **QA:** pytest, HTTPX, and Playwright with Chromium; GitHub Actions and a QA-only Docker test image are configured in the repository.

## Project Structure

```text
backend/
  app/
    api/routes/       FastAPI authentication, upload, search, RAG, and stats routes
    core/             Application configuration and JWT/password helpers
    db/               SQLAlchemy database setup
    models/            SQLAlchemy models
    services/          Document extraction, embeddings, vector search, and RAG response code
  requirements.txt     Backend runtime dependencies
frontend/
  app/                 Next.js routes and pages
  components/          Reusable UI components
  services/            Frontend API client
qa-suite/
  api-tests/           Isolated API tests and offline mocked RAG checks
  ui-tests/            Playwright browser tests using intercepted API responses
  genai-evaluation/    Synthetic evaluation examples
  test-cases/          Manual QA case inventory
  postman/             Postman collection and blank environment template
  performance/         JMeter plan and instructions
  review/              Read-only QA artifact checker
docs/                  QA plans and reports
.github/workflows/     GitHub Actions QA workflow
```

## Prerequisites

- Python 3.9 or a compatible newer version.
- Node.js compatible with Next.js 16 and npm (the workflow uses Node.js 22).
- Internet access on first backend startup if the Sentence Transformers model is not already cached.
- Windows PowerShell for the commands below; adapt virtual-environment activation and environment-variable syntax for other shells.

## Installation and Setup

### Backend

```powershell
Set-Location .\backend
python -m venv venv
.\venv\Scripts\Activate.ps1

python -m pip install -r .\requirements.txt
```

### Frontend

In a separate terminal from the repository root:

```powershell
Set-Location .\frontend
npm ci
```

## Configuration

The backend reads configuration from environment variables (and can load a local `.env` file). Keep real values out of source control. `SECRET_KEY` is required and must contain at least 32 bytes of random data. Generate a local development value in PowerShell with:

```powershell
$env:SECRET_KEY = (python -c "import secrets; print(secrets.token_urlsafe(32))").Trim()
```

The following configuration values are examples/placeholders only:

```powershell
$env:DATABASE_URL = 'sqlite:///./enterprise_ai.db'
$env:ACCESS_TOKEN_EXPIRE_MINUTES = '1440'
$env:ALLOWED_ORIGINS = 'http://127.0.0.1:3000,http://localhost:3000'
$env:OPENAI_API_KEY = '<optional-key-only-if-OpenAI-SDK-is-installed>'
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:8000'
```

`DATABASE_URL` defaults to a SQLite file relative to the backend working directory. Uploaded files are stored under the backend's `app/uploads` directory. The model is loaded at backend startup and may be downloaded on first use if it is not cached. Do not reuse the development key in another environment; configure a separate strong key through the deployment's secret-management mechanism. `ALLOWED_ORIGINS` is a comma-separated list of exact browser origins (scheme and host, with an optional port; no wildcard or path). Its local default permits the two localhost frontend origins shown above. Set the exact frontend origin or origins explicitly in production, for example `https://app.example.com`. The optional OpenAI setting is only used if the OpenAI SDK is installed separately; it is not included in `backend/requirements.txt`.

## Usage

Start the backend from the `backend` directory after configuring its environment:

```powershell
Set-Location .\backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The API is available at `http://127.0.0.1:8000`; FastAPI's interactive API documentation is at `http://127.0.0.1:8000/docs`.

In another terminal, start the frontend:

```powershell
Set-Location .\frontend
$env:NEXT_PUBLIC_API_URL = 'http://127.0.0.1:8000'
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000` in a browser. Use only disposable local documents and accounts while exploring the application.

## Testing

The API and offline RAG checks use pytest with in-memory SQLite, synthetic test data, and mocked vector/model boundaries. The browser tests use Playwright/Chromium and intercept API responses; they do not test a live frontend/backend integration.

Install QA requirements from the repository root:

```powershell
& .\backend\venv\Scripts\python.exe -m pip install -r .\qa-suite\requirements-api.txt
& .\backend\venv\Scripts\python.exe -m pip install -r .\qa-suite\requirements-ui.txt
& .\backend\venv\Scripts\python.exe -m playwright install chromium
```

Run the API and offline GenAI suite:

```powershell
$env:PYTHONPATH = (Resolve-Path .\backend).Path
& .\backend\venv\Scripts\python.exe -m pytest -c .\qa-suite\pytest.ini -p no:cacheprovider .\qa-suite\api-tests -q
```

Run the UI suite while the local frontend is running in another terminal:

```powershell
$env:QA_UI_BASE_URL = 'http://127.0.0.1:3000'
& .\backend\venv\Scripts\python.exe -m pytest -c .\qa-suite\pytest.ini -p no:cacheprovider .\qa-suite\ui-tests -q
```

**Historical local results (before the current authorization changes):** API plus offline mocked GenAI suite: 33 passed, 0 failed, 0 skipped, with 7 dependency deprecation warnings (3.93 seconds). Playwright Chromium UI suite: 17 passed, 0 failed, 0 skipped (48.69 seconds). These are local isolated test results, not a GitHub-hosted workflow run, and they do not verify the current security changes. The GenAI checks use mocked responses and do not measure real model quality. No JMeter performance run or performance result is available. A Docker image build was attempted and interrupted; its final outcome is unknown and unverified, and container testing has not been verified. GitHub Actions has not run in a hosted environment.

**Security status and limitations:** Authentication and department-scope changes have been made to the document, search, and RAG routes, but the historical QA results above predate those changes and do not verify them. Existing account department assignments have not been reviewed or migrated and must not be assumed trusted. `GET /api/v1/stats/summary` remains unchanged and unauthenticated; it returns aggregate counts and recent document metadata and requires a separate security review. Do not expose this application to untrusted networks or sensitive data without reviewing these limitations.
