from fastapi import APIRouter, Query
from typing import Optional
from app.services.vector_service import search_similar_chunks

router = APIRouter()


@router.get("/")
def semantic_search(
    query: str = Query(..., description="Search query"),
    department: Optional[str] = Query(None, description="Department filter")
):
    results = search_similar_chunks(query=query, department=department, top_k=5)
    return {
        "query": query,
        "department": department,
        "results": results
    }