from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
import shutil
from pathlib import Path
import os
import datetime
from typing import Optional

from app.db.database import get_db
from app.models.document import Document
from app.services.pdf_service import (
    extract_text_from_file,
    chunk_text
)
from app.services.vector_service import (
    store_document_chunks,
    delete_document_chunks
)

router = APIRouter()

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx", ".doc"}


@router.post("/document")
async def upload_document(
    file: UploadFile = File(...),
    department: Optional[str] = Form("General"),
    db: Session = Depends(get_db)
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, TXT, DOCX"
        )

    file_path = UPLOAD_DIR / file.filename

    # Save Physical File safely
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # Extraction & Chunking Pipeline
    try:
        extracted_text = extract_text_from_file(
            str(file_path),
            file.filename,
            file.content_type or ""
        )
        text_chunks = chunk_text(extracted_text, chunk_size=500, overlap=50)
        status = "Processed" if extracted_text.strip() else "Empty Text"
    except Exception as e:
        status = "Processing Failed"
        extracted_text = ""
        text_chunks = []
        print(f"Error processing document {file.filename}: {e}")

    created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Create Database Record
    document = Document(
        filename=file.filename,
        file_type=file.content_type or f"application/{ext.replace('.', '')}",
        file_path=str(file_path),
        department=department or "General",
        status=status,
        created_at=created_at
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    # Store Chunks in ChromaDB Vector Database
    if text_chunks:
        store_document_chunks(
            document_id=document.id,
            chunks=text_chunks,
            filename=document.filename,
            department=document.department
        )

    return {
        "message": "File uploaded and processed successfully",
        "document": {
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "department": document.department,
            "status": document.status,
            "created_at": document.created_at
        },
        "extracted_text_preview": extracted_text[:300],
        "total_chunks": len(text_chunks)
    }


@router.get("/documents")
def get_documents(
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if department and department not in ["All", "Admin", "*"]:
        query = query.filter(Document.department == department)
    documents = query.order_by(Document.id.desc()).all()
    return documents


@router.delete("/document/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    document = db.query(Document).filter(
        Document.id == document_id
    ).first()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # 1. Delete Physical File
    if os.path.exists(document.file_path):
        try:
            os.remove(document.file_path)
        except Exception as e:
            print(f"Failed to remove file {document.file_path}: {e}")

    # 2. Delete ChromaDB Vector Chunks
    delete_document_chunks(document_id)

    # 3. Delete Database Record
    db.delete(document)
    db.commit()

    return {
        "message": "Document and associated vector index deleted successfully",
        "document_id": document_id
    }