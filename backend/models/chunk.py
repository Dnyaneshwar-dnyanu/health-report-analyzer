from dataclasses import dataclass

@dataclass
class Chunk:
    text: str
    source: str
    file_name: str
    category: str
    section: str
    chunk_id: int