import chromadb
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional

# Initialize Embedding Model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Initialize ChromaDB in Persistent or In-Memory Client mode
client = chromadb.Client()
collection = client.get_or_create_collection(
    name="enterprise_documents"
)


def create_embedding(text: str) -> List[float]:
    embedding = embedding_model.encode(text)
    return embedding.tolist()


def store_document_chunks(
    document_id: int,
    chunks: List[str],
    filename: str = "",
    department: str = "General"
):
    if not chunks:
        return

    documents = []
    embeddings = []
    metadatas = []
    ids = []

    for index, chunk in enumerate(chunks):
        embedding = create_embedding(chunk)
        chunk_id = f"{document_id}_{index}"
        
        documents.append(chunk)
        embeddings.append(embedding)
        ids.append(chunk_id)
        metadatas.append({
            "document_id": document_id,
            "filename": filename,
            "department": department or "General",
            "chunk_index": index
        })

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )


def delete_document_chunks(document_id: int):
    try:
        # Get all chunk IDs matching document_id prefix or metadata
        existing_data = collection.get(
            where={"document_id": document_id}
        )
        if existing_data and existing_data.get("ids"):
            collection.delete(ids=existing_data["ids"])
    except Exception as e:
        print(f"Error deleting chunks for document {document_id}: {e}")


def search_similar_chunks(
    query: str,
    department: Optional[str] = None,
    top_k: int = 4
) -> Dict[str, Any]:
    query_embedding = create_embedding(query)
    
    where_filter = None
    if department and department not in ["All", "Admin", "*"]:
        where_filter = {"department": department}

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter if where_filter else None
    )

    return results