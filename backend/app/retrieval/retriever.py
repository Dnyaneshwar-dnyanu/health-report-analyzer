from app.ingestion.embedder import Embedder
from app.models.search_result import SearchResult
from app.vector_store.chroma_store import ChromaStore


class Retriever:

    def __init__(self, embedder: Embedder, vector_store: ChromaStore):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 5, category: str | None = None, where: dict | None = None) -> list[SearchResult]:
        query_embedding = self.embedder.embed_query(query)
        return self.vector_store.search(query_embedding=query_embedding, top_k=top_k, category=category, where=where)

