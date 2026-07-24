import numpy as np

from app.ingestion.embedding_model import EmbeddingModel
from app.models.chunk import Chunk
from app.models.embedded_chunk import EmbeddedChunk


class Embedder:

    def __init__(self, model: EmbeddingModel | None = None):
        self.model = model or EmbeddingModel()

    def embed_query(self, query: str):
        """
        Generate embedding for a user query.
        """

        return self.model.encode(query)

    def embed_chunk(self, chunk: Chunk) -> np.ndarray:
        """
        Generate embedding for a single chunk.
        """
        return self.model.encode(chunk.text)

    def embed_chunks(self, chunks: list[Chunk]) -> list[EmbeddedChunk]:
        """
        Generate embeddings for all chunks.
        """
        embedded_chunks = []

        total = len(chunks)

        for index, chunk in enumerate(chunks):

            print(f"Embedding {index+1}/{total}")

            embedding = self.embed_chunk(chunk)

            embedded_chunk = EmbeddedChunk(
                chunk=chunk,
                embedding=embedding
            )

            embedded_chunks.append(embedded_chunk)

        return embedded_chunks
