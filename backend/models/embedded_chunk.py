from dataclasses import dataclass
import numpy as np

from models.chunk import Chunk


@dataclass
class EmbeddedChunk:
    chunk: Chunk
    embedding: np.ndarray