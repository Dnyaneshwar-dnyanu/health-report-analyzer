from dataclasses import dataclass

from app.models.embedded_chunk import EmbeddedChunk

@dataclass
class SearchResult:
    similarity: float
    chunk: EmbeddedChunk
