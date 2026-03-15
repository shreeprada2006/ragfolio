import os
from typing import List

import chromadb
from fastembed import TextEmbedding


# Lightweight ONNX model (no PyTorch/transformers); 384 dims
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
COLLECTION_NAME = "resume_chunks"
# Process embeddings and DB writes in batches to handle large resumes
ENCODE_BATCH_SIZE = 32
DB_ADD_BATCH_SIZE = 100


def chunk_text(text: str, max_chars: int = 500) -> List[str]:
    """
    Split the input text into chunks of roughly max_chars characters.

    This implementation prefers to break on double newlines or single newlines
    where possible so that chunks stay semantically coherent.
    """
    text = text.strip()
    if not text:
        return []

    # First split into paragraphs by double newline
    paragraphs = text.split("\n\n")
    chunks: List[str] = []
    current = ""

    def flush_current():
        nonlocal current
        if current.strip():
            chunks.append(current.strip())
        current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        # If adding this paragraph would exceed max_chars, flush and start new
        if len(current) + len(para) + 2 > max_chars:
            if len(para) > max_chars:
                # Paragraph itself is too big: split by single newlines
                lines = para.split("\n")
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    if len(current) + len(line) + 1 > max_chars:
                        flush_current()
                    current = (current + " " + line).strip()
                flush_current()
            else:
                flush_current()
                current = para
        else:
            # Safe to append to current chunk
            if current:
                current = current + "\n\n" + para
            else:
                current = para

    flush_current()
    return chunks


def build_vector_store(resume_path: str = None) -> None:
    """Load resume.txt, create chunks, embed them, and store in ChromaDB."""
    if resume_path is None:
        resume_path = os.path.join(os.path.dirname(__file__), "resume.txt")

    if not os.path.exists(resume_path):
        raise FileNotFoundError(f"Could not find resume file at {resume_path}")

    with open(resume_path, "r", encoding="utf-8") as f:
        text = f.read()

    chunks = chunk_text(text, max_chars=500)
    if not chunks:
        raise ValueError("No text chunks were created from resume.txt")

    print(f"Loaded resume with {len(text)} characters.")
    print(f"Created {len(chunks)} chunks.")

    model = TextEmbedding(model_name=EMBEDDING_MODEL_NAME)

    print("Computing embeddings in batches...")
    all_embeddings: List[List[float]] = []
    for start in range(0, len(chunks), ENCODE_BATCH_SIZE):
        batch = chunks[start : start + ENCODE_BATCH_SIZE]
        for emb in model.embed(batch):
            all_embeddings.append(emb.tolist())
        print(f"  Encoded chunks {start + 1}-{min(start + ENCODE_BATCH_SIZE, len(chunks))} of {len(chunks)}")

    os.makedirs(CHROMA_DB_DIR, exist_ok=True)
    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)

    # Create or get collection
    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    # Clear any existing data so re-running ingestion replaces it
    if collection.count() > 0:
        collection.delete(where={})

    print("Storing embeddings in ChromaDB in batches...")
    for start in range(0, len(chunks), DB_ADD_BATCH_SIZE):
        end = min(start + DB_ADD_BATCH_SIZE, len(chunks))
        batch_ids = [f"chunk-{i}" for i in range(start, end)]
        batch_docs = chunks[start:end]
        batch_embeddings = all_embeddings[start:end]
        batch_metadatas = [{"index": i} for i in range(start, end)]
        collection.add(
            ids=batch_ids,
            documents=batch_docs,
            embeddings=batch_embeddings,
            metadatas=batch_metadatas,
        )
        print(f"  Stored chunks {start + 1}-{end} of {len(chunks)}")

    print(f"Stored {len(chunks)} chunks in ChromaDB at {CHROMA_DB_DIR}.")


def main() -> None:
    build_vector_store()


if __name__ == "__main__":
    main()

