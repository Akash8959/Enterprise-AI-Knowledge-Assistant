from fastapi import FastAPI

from app.core.config import settings
from app.db.database import Base, engine
from app.models.user import User
from app.core.security import hash_password
from app.core.security import create_access_token
from app.api.routes.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)
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