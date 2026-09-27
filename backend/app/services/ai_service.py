import os
from typing import Optional, List, Dict, Any
from app.services.vector_service import search_similar_chunks
from app.core.config import settings

# Initialize OpenAI client safely if key is available
client = None
if getattr(settings, "OPENAI_API_KEY", None):
    try:
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        print(f"Warning: Could not initialize OpenAI client: {e}")


def generate_rag_response(
    query: str,
    department: Optional[str] = None
) -> Dict[str, Any]:
    # 1. Retrieve Relevant Chunks from Vector DB
    results = search_similar_chunks(query, department=department, top_k=4)

    documents_list = results.get("documents", [[]])
    metadatas_list = results.get("metadatas", [[]])

    retrieved_chunks = documents_list[0] if documents_list and len(documents_list) > 0 else []
    metadatas = metadatas_list[0] if metadatas_list and len(metadatas_list) > 0 else []

    # 2. Build Sources / Citations list
    sources: List[Dict[str, Any]] = []
    seen_sources = set()

    for idx, chunk_text in enumerate(retrieved_chunks):
        meta = metadatas[idx] if idx < len(metadatas) else {}
        filename = meta.get("filename", "Enterprise Document")
        doc_id = meta.get("document_id", None)
        dept = meta.get("department", "General")
        
        source_key = f"{filename}_{doc_id}"
        if source_key not in seen_sources:
            seen_sources.add(source_key)
            sources.append({
                "filename": filename,
                "document_id": doc_id,
                "department": dept,
                "snippet": chunk_text[:200] + ("..." if len(chunk_text) > 200 else "")
            })

    # If no documents match
    if not retrieved_chunks:
        return {
            "answer": "No relevant enterprise knowledge found for your query. Please upload pertinent documents or adjust your query.",
            "retrieved_chunks": [],
            "sources": []
        }

    context = "\n\n---\n\n".join(retrieved_chunks)

    # 3. Attempt LLM Generation (OpenAI if configured, else Context Synthesizer)
    answer = ""
    used_openai = False

    if client and getattr(settings, "OPENAI_API_KEY", None):
        try:
            prompt = f"""You are an Enterprise AI Knowledge Assistant.
Answer the user question accurately and concisely using ONLY the enterprise context provided below.

Enterprise Context:
{context}

User Question:
{query}
"""
            response = client.chat.completions.create(
                model="gpt-4o-mini" if hasattr(client, "chat") else "gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional enterprise AI assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )
            answer = response.choices[0].message.content
            used_openai = True
        except Exception as err:
            print(f"OpenAI API call failed: {err}. Falling back to RAG context synthesis engine.")

    # Grounded RAG Context Synthesis Fallback (guarantees local offline demo working without API key)
    if not answer:
        top_snippet = retrieved_chunks[0].strip()
        filenames_str = ", ".join(list({s["filename"] for s in sources}))
        answer = (
            f"Based on your enterprise documents (**{filenames_str}**):\n\n"
            f"> \"{top_snippet}\"\n\n"
        )
        if len(retrieved_chunks) > 1:
            answer += f"**Additional Relevant Context:**\n- {retrieved_chunks[1].strip()[:300]}"

    return {
        "answer": answer,
        "retrieved_chunks": retrieved_chunks,
        "sources": sources,
        "used_openai": used_openai
    }