from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

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