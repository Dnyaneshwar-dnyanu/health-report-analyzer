from pathlib import Path

from ingestion.chunking.text_chunker import TextChunker
from ingestion.document_loader import load_documents
from ingestion.embedder import Embedder
from models.chunk import Chunk
from models.document import Document
from models.embedded_chunk import EmbeddedChunk
from vector_store.in_memory_store import InMemoryVectorStore


class IngestService:

    def __init__(
        self,
        knowledge_base_path: str | Path,
        chunk_size: int = 400,
        overlap: int = 50,
        embedder: Embedder | None = None,
        vector_store: InMemoryVectorStore | None = None,
    ):
        self.knowledge_base_path = Path(knowledge_base_path)
        self.chunker = TextChunker(chunk_size=chunk_size, overlap=overlap)
        self.embedder = embedder or Embedder()
        self.vector_store = vector_store or InMemoryVectorStore()
        self.documents: list[Document] = []
        self.chunks: list[Chunk] = []
        self.embedded_chunks: list[EmbeddedChunk] = []

    def ingest(self) -> "IngestService":
        self.documents = load_documents(str(self.knowledge_base_path))
        self.chunks = self.chunker.chunk_documents(self.documents)
        self.embedded_chunks = self.embedder.embed_chunks(self.chunks)
        self.vector_store.add_documents(self.embedded_chunks)

        return self
