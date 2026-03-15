# Backend

FastAPI app for the Resume RAG API.

## Endpoints

- `GET /health` — health check (returns `{"status": "ok"}`).
- `POST /ask` — body `{ "question": "..." }`, returns `{ "answer": "..." }`. Uses `rag_query.answer_question`; wire real RAG here.

## Run

```bash
uv sync
uv run python main.py
```

Runs on http://localhost:8000.

## RAG

`rag_query.answer_question(question)` is implemented in `rag_query.py` (stub by default). Replace with your RAG logic (e.g. calling the `rag` package or ChromaDB).
