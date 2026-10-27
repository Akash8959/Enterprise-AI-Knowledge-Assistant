from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.api.deps import get_authorized_department, get_current_user
from app.models.user import User
from app.services.vector_service import search_similar_chunks

router = APIRouter()


@router.get("/")
def semantic_search(
    query: str = Query(..., description="Search query"),
    department: Optional[str] = Query(None, description="Department filter"),
    current_user: User = Depends(get_current_user),
):
    authorized_department = get_authorized_department(
        current_user,
        department,
    )
    results = search_similar_chunks(
        query=query,
        department=authorized_department,
        top_k=5,
    )
    return {
        "query": query,
        "department": authorized_department,
        "results": results
    }