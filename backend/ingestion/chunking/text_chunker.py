import re

from models.chunk import Chunk
from models.document import Document

class TextChunker:
    """
    Splits markdown documents into semantic chunks.

    Strategy:
    1. Split using Markdown headings (##)
    2. If a section is too large, split using a sliding window
    """

    def __init__(self, chunk_size: int = 400, overlap: int = 50):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_documents(self, documents: list[Document]) -> list[Chunk]:
        """
        Chunk an entire collection of documents.
        """

        chunks = []

        for document in documents:

            chunks.extend(self.chunk_document(document))

        return chunks
    
    def chunk_document(self, document: Document) -> list[Chunk]:
        """
        Chunk a single markdown document.
        """

        chunks = []

        sections = re.split(
            r"(?=^##\s+)",
            document.text,
            flags=re.MULTILINE,
        )

        chunk_number = 0

        for section in sections:

            section = section.strip()

            if not section: 
                continue

            lines = section.splitlines()

            # Ignore content before the first ## heading
            if not lines[0].startswith("##"):
                continue

            heading = lines[0].replace("##", "").strip()

            content = "\n".join(lines[1:]).strip()

            if not content:
                continue

            words = content.split()

            # Small section → single chunk
            if len(words) <= self.chunk_size:

                chunks.append(
                    Chunk(
                        chunk_id=f"{document.file_name}_{chunk_number}",
                        text=f"## {heading}\n\n{content}",
                        source=document.source,
                        file_name=document.file_name,
                        category=document.category,
                        section=heading,
                    )
                )

                chunk_number += 1
                continue

            start = 0

            while start < len(words):

                end = min(start + self.chunk_size, len(words))

                chunk_text = " ".join(words[start:end])

                chunks.append(
                    Chunk(
                        chunk_id=f"{document.file_name}_{chunk_number}",
                        text=f"## {heading}\n\n{content}",
                        source=document.source,
                        file_name=document.file_name,
                        category=document.category,
                        section=heading,
                    )
                )

                chunk_number += 1

                if end == len(words):
                    break

                start += self.chunk_size - self.overlap

            
        return chunks

