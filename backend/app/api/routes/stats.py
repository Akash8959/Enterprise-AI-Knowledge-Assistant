from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.document import Document
from app.models.user import User

router = APIRouter()


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_docs = db.query(Document).count()
    processed_docs = db.query(Document).filter(Document.status == "Processed").count()
    failed_docs = db.query(Document).filter(Document.status != "Processed").count()
    total_users = db.query(User).count()

    recent_docs = db.query(Document).order_by(Document.id.desc()).limit(5).all()

    return {
        "total_documents": total_docs,
        "processed_documents": processed_docs,
        "failed_documents": failed_docs,
        "total_users": total_users,
        "recent_documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "file_type": doc.file_type,
                "department": getattr(doc, "department", "General") or "General",
                "status": getattr(doc, "status", "Processed") or "Processed",
                "created_at": getattr(doc, "created_at", "") or ""
            }
            for doc in recent_docs
        ]
    }
