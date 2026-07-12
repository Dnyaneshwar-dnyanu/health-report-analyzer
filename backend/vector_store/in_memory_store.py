from models.embedded_chunk import EmbeddedChunk
from models.search_result import SearchResult
from vector_store.similarity import cosine_similarity

class InMemoryVectorStore:

    def __init__(self):
        """
        Stores all embedded chunks in memory.
        """
        self.embedded_chunks: list[EmbeddedChunk] = []

    def add_documents(self, embedded_chunks: list[EmbeddedChunk]) -> None:
        """
        Add embedded chunks to the vector store.
        """

        self.embedded_chunks.extend(embedded_chunks)

        print(f"Stored {len(embedded_chunks)} chunks in memory.")

    def search(self, query_embedding, top_k: int = 5) -> list[SearchResult]:
        """
        Search for the most similar chunks.

        Returns:
            List of (EmbeddedChunk, similarity_score)
        """

        results = []

        for embedded_chunk in self.embedded_chunks:

            score = cosine_similarity(query_embedding, embedded_chunk.embedding)

            results.append(
                SearchResult(
                    chunk=embedded_chunk, 
                    similarity=score
                )
            )

        results.sort(key=lambda result: result.similarity, reverse=True)

        return results[:top_k]