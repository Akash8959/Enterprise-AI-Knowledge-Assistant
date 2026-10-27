from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from typing import Optional
from app.api.deps import get_authorized_department, get_current_user
from app.models.user import User
from app.services.ai_service import generate_rag_response

router = APIRouter()


class RAGQueryRequest(BaseModel):
    query: str
    department: Optional[str] = None


@router.get("/")
def ask_ai_get(
    query: str = Query(..., description="User query for RAG AI"),
    department: Optional[str] = Query(None, description="Filter documents by department"),
    current_user: User = Depends(get_current_user),
):
    authorized_department = get_authorized_department(
        current_user,
        department,
    )
    return generate_rag_response(
        query=query,
        department=authorized_department,
    )


@router.post("/")
def ask_ai_post(
    payload: RAGQueryRequest,
    current_user: User = Depends(get_current_user),
):
    authorized_department = get_authorized_department(
        current_user,
        payload.department,
    )
    return generate_rag_response(
        query=payload.query,
        department=authorized_department,
    )