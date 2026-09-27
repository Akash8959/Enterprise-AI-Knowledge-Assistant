from fastapi import FastAPI

from app.models.document import Document

from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.db.database import Base, engine

from app.models.user import User

from app.core.security import hash_password

from app.core.security import create_access_token

from app.api.routes.auth import router as auth_router

from app.api.routes.upload import router as upload_router

from app.api.routes.search import router as search_router

from app.api.routes.rag import router as rag_router


from app.api.routes.stats import router as stats_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

# CORS Middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Routes

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

# Upload Routes

app.include_router(
    upload_router,
    prefix="/api/v1/upload",
    tags=["Upload"]
)

# Semantic Search Routes

app.include_router(
    search_router,
    prefix="/api/v1/search",
    tags=["Semantic Search"]
)

# RAG AI Routes

app.include_router(
    rag_router,
    prefix="/api/v1/rag",
    tags=["RAG AI"]
)

# Stats Summary Routes

app.include_router(
    stats_router,
    prefix="/api/v1/stats",
    tags=["Dashboard Stats"]
)

# Database Tables

Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {
        "status": "success",
        "message": f"{settings.APP_NAME} API Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/test-hash")
def test_hash():
    sample_password = "akash123"

    hashed = hash_password(sample_password)

    return {
        "original_password": sample_password,
        "hashed_password": hashed
    }


@app.get("/test-token")
def test_token():
    token = create_access_token(
        data={"sub": "akash@gmail.com"}
    )

    return {
        "access_token": token
    }