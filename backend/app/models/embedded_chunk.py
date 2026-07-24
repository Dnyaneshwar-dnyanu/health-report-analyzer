from dataclasses import dataclass
import numpy as np

from app.models.chunk import Chunk


@dataclass
class EmbeddedChunk:
    chunk: Chunk
    embedding: np.ndarray
