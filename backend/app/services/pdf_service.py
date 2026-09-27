import fitz
import docx


def extract_text_from_pdf(pdf_path: str) -> str:
    document = fitz.open(pdf_path)
    text = ""
    for page in document:
        text += page.get_text() + "\n"
    return text


def extract_text_from_txt(txt_path: str) -> str:
    with open(txt_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def extract_text_from_docx(docx_path: str) -> str:
    doc = docx.Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        if para.text.strip():
            full_text.append(para.text)
    return "\n".join(full_text)


def extract_text_from_file(file_path: str, filename: str, content_type: str) -> str:
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf") or content_type == "application/pdf":
        return extract_text_from_pdf(file_path)
    elif filename_lower.endswith(".docx") or "wordprocessingml" in content_type:
        return extract_text_from_docx(file_path)
    elif filename_lower.endswith(".txt") or content_type.startswith("text/"):
        return extract_text_from_txt(file_path)
    else:
        # Fallback to text reading
        try:
            return extract_text_from_txt(file_path)
        except Exception:
            return ""


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    if not text:
        return []
    chunks = []
    step = chunk_size - overlap if chunk_size > overlap else chunk_size
    for i in range(0, len(text), step):
        chunk = text[i:i + chunk_size].strip()
        if chunk:
            chunks.append(chunk)
    return chunks