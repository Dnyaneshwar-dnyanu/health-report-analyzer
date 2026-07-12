from ingestion.embedder import Embedder
from models.search_result import SearchResult
from vector_store.in_memory_store import InMemoryVectorStore


class Retriever:

    def __init__(self, embedder: Embedder, vector_store: InMemoryVectorStore):
        self.embedder = embedder
        self.vector_store = vector_store

    def retrieve(self, query: str, top_k: int = 5) -> list[SearchResult]:
        query_embedding = self.embedder.embed_query(query)
        return self.vector_store.search(query_embedding=query_embedding, top_k=top_k)
