from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from app.services.ai_service import generate_rag_response

router = APIRouter()


class RAGQueryRequest(BaseModel):
    query: str
    department: Optional[str] = None


@router.get("/")
def ask_ai_get(
    query: str = Query(..., description="User query for RAG AI"),
    department: Optional[str] = Query(None, description="Filter documents by department")
):
    return generate_rag_response(query=query, department=department)


@router.post("/")
def ask_ai_post(payload: RAGQueryRequest):
    return generate_rag_response(query=payload.query, department=payload.department)