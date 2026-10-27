import atexit
import asyncio
import os
import secrets
import sys
import tempfile
from pathlib import Path
from types import ModuleType

import httpx
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPOSITORY_ROOT / "backend"
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# Force safe settings before importing the application. This prevents a
# developer's DATABASE_URL or OPENAI_API_KEY from reaching the test app.
os.environ["DATABASE_URL"] = "sqlite://"
os.environ["SECRET_KEY"] = secrets.token_urlsafe(32)
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "1440"
os.environ["OPENAI_API_KEY"] = ""

# The upload module creates its relative upload folder at import time.
# Import the application from a disposable working directory, not the repo.
ORIGINAL_WORKING_DIRECTORY = Path.cwd()
_IMPORT_WORK_DIRECTORY = tempfile.TemporaryDirectory(
    prefix="enterprise-ai-ka-api-tests-"
)
os.chdir(_IMPORT_WORK_DIRECTORY.name)


def _restore_working_directory_and_cleanup():
    os.chdir(ORIGINAL_WORKING_DIRECTORY)
    _IMPORT_WORK_DIRECTORY.cleanup()


atexit.register(_restore_working_directory_and_cleanup)


class _ExternalCollection:
    def get_or_create_collection(self, name):
        return self


class _ExternalVectorClient:
    def get_or_create_collection(self, name):
        return _ExternalCollection()


class _NoDownloadEmbeddingModel:
    def __init__(self, model_name):
        self.model_name = model_name

    def encode(self, text):
        raise RuntimeError(
            "The isolated API suite must mock embedding-dependent calls."
        )


# Import stubs stop application import from initializing ChromaDB or
# downloading/loading a transformer model. Individual route tests replace
# vector/LLM boundaries with deterministic test doubles.
chromadb_stub = ModuleType("chromadb")
chromadb_stub.Client = _ExternalVectorClient
sys.modules["chromadb"] = chromadb_stub

sentence_transformers_stub = ModuleType("sentence_transformers")
sentence_transformers_stub.SentenceTransformer = _NoDownloadEmbeddingModel
sys.modules["sentence_transformers"] = sentence_transformers_stub

from app.api.deps import get_db  # noqa: E402
from app.core.security import create_access_token, hash_password  # noqa: E402
from app.db.database import Base  # noqa: E402
from app.main import app  # noqa: E402
from app.models.user import User  # noqa: E402


@pytest.fixture
def test_database():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        database = TestingSessionLocal()
        try:
            yield database
        finally:
            database.close()

    app.dependency_overrides[get_db] = override_get_db
    try:
        yield TestingSessionLocal
    finally:
        app.dependency_overrides.pop(get_db, None)
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture
def db_session(test_database):
    session = test_database()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def user_factory(db_session):
    def create_user(email, department="General", password="QaOnly-Password-42!"):
        user = User(
            email=email,
            full_name="QA Test User",
            hashed_password=hash_password(password),
            department=department,
            role="user",
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user

    return create_user


@pytest.fixture
def create_authenticated_user(user_factory):
    def create(email, department="General"):
        user = user_factory(email, department=department)
        token = create_access_token({"sub": user.email})
        return user, {"Authorization": f"Bearer {token}"}

    return create


@pytest.fixture
def api_client(test_database):
    transport = httpx.ASGITransport(app=app)

    def request(method, path, **kwargs):
        async def send_request():
            async with httpx.AsyncClient(
                transport=transport,
                base_url="http://qa.test",
            ) as client:
                return await client.request(method, path, **kwargs)

        return asyncio.run(send_request())

    return request
