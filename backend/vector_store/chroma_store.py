from models.embedded_chunk import EmbeddedChunk
from models.search_result import SearchResult


class ChromaStore:

    def __init__(self, *args, **kwargs):
        self._args = args
        self._kwargs = kwargs

    def add_documents(self, embedded_chunks: list[EmbeddedChunk]) -> None:
        raise NotImplementedError("ChromaStore is not implemented yet.")

    def search(self, query_embedding, top_k: int = 5) -> list[SearchResult]:
        raise NotImplementedError("ChromaStore is not implemented yet.")
