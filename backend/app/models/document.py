from dataclasses import dataclass

@dataclass
class Document:
    text: str
    source: str
    file_name: str
    extension: str
    category: str
