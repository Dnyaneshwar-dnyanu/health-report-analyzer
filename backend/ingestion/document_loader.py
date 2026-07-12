from pathlib import Path

from ingestion.loaders.markdown_loader import load_markdown
from ingestion.loaders.pdf_loader import load_pdf
from models.document import Document

SUPPORTED_FILES = {
    ".md": load_markdown,
    ".pdf": load_pdf
}

def load_documents(directory: str) -> list[Document]:
    """
    Loads all supported documents from a directory
    """

    directory = Path(directory)

    if not directory.exists():
        raise FileNotFoundError(f"{directory} does not exist.")
    
    documents = []

    for file in directory.rglob("*"):

        if not file.is_file():
            continue

        extension = file.suffix.lower()

        if extension not in SUPPORTED_FILES:
            print(f"Skipping {file.name}")
            continue

        print(f"Loading {file.name}")

        loader = SUPPORTED_FILES[extension]

        text = loader(str(file))

        document = Document(
            text=text,
            source=str(file),
            file_name=file.name,
            extension=extension,
            category=file.parent.name,
        )

        documents.append(document)

    return documents
