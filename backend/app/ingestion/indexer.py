import json
import datetime
from pathlib import Path
import hashlib
from app.core.config import settings
from app.core.logger import logger
from app.ingestion.document_loader import load_documents
from app.ingestion.chunking.text_chunker import TextChunker
from app.ingestion.embedder import Embedder
from app.vector_store.chroma_store import ChromaStore


class Indexer:

    def __init__(self, chroma_store: ChromaStore | None = None, embedder: Embedder | None = None):
        self.chroma_store = chroma_store or ChromaStore()
        self.embedder = embedder or Embedder()
        self.chunker = TextChunker(chunk_size=settings.chunk_size, overlap=settings.chunk_overlap)

    def is_indexed(self) -> bool:
        """
        Check if the Chroma database collection has documents.
        """
        count = self.chroma_store.get_document_count()
        logger.info(f"ChromaDB collection currently has {count} documents.")
        return count > 0

    def run_indexing(self) -> None:
        """
        Execute the initial full loading, chunking, embedding, and storing flow.
        """
        kb_path = Path(settings.knowledge_base_directory)
        logger.info(f"Starting full indexing from knowledge base directory: {kb_path.resolve()}")

        if not kb_path.exists():
            logger.error(f"Knowledge base directory does not exist: {kb_path}")
            raise FileNotFoundError(f"Knowledge base directory {kb_path} not found.")

        # Load documents
        logger.info("Loading documents...")
        documents = load_documents(str(kb_path))
        logger.info(f"Loaded {len(documents)} documents.")

        if not documents:
            logger.warning("No documents found in knowledge base. Indexing aborted.")
            return

        # Chunk documents
        logger.info("Chunking documents...")
        chunks = self.chunker.chunk_documents(documents)
        logger.info(f"Generated {len(chunks)} chunks.")

        # Embed chunks
        logger.info("Generating embeddings...")
        embedded_chunks = self.embedder.embed_chunks(chunks)
        logger.info(f"Generated embeddings for {len(embedded_chunks)} chunks.")

        # Add to store
        logger.info("Storing embedded chunks in persistent ChromaDB...")
        self.chroma_store.add_documents(embedded_chunks)
        logger.info("Storing completed. Indexing successful!")

        # Initialize the manifest since we just did a full index
        self._initialize_manifest_after_full_index(kb_path)

    def run_incremental_indexing(self) -> None:
        """
        Runs incremental indexing, checking file hashes to only update changed files.
        """
        kb_path = Path(settings.knowledge_base_directory)
        logger.info(f"Starting incremental indexing check from: {kb_path.resolve()}")

        if not kb_path.exists():
            logger.error(f"Knowledge base directory does not exist: {kb_path}")
            raise FileNotFoundError(f"Knowledge base directory {kb_path} not found.")

        # Ensure vector DB path parent directory exists
        manifest_dir = Path(settings.vector_db_path).parent
        manifest_dir.mkdir(parents=True, exist_ok=True)
        manifest_path = manifest_dir / "indexing_manifest.json"

        # Load existing manifest
        manifest = {}
        if manifest_path.exists():
            try:
                with open(manifest_path, "r", encoding="utf-8") as f:
                    manifest = json.load(f)
            except Exception as e:
                logger.warning(f"Failed to load indexing manifest. Re-indexing everything. Error: {e}")

        # Scan all markdown files on disk
        current_files = {}
        for file in kb_path.rglob("*.md"):
            if file.is_file():
                rel_path = str(file.relative_to(kb_path)).replace("\\", "/")
                current_files[rel_path] = {
                    "abs_path": file,
                    "hash": self._compute_file_hash(file)
                }

        updated_count = 0
        deleted_count = 0

        # 1. Handle updates and new files
        for rel_path, info in current_files.items():
            abs_path = info["abs_path"]
            file_hash = info["hash"]

            existing_entry = manifest.get(rel_path)

            if existing_entry is None or existing_entry.get("hash") != file_hash:
                if existing_entry is not None:
                    # File was modified! Delete old chunks first
                    logger.info(f"File modified: {rel_path}. Deleting old chunks from ChromaDB...")
                    self.chroma_store.delete_by_source(str(abs_path))
                else:
                    logger.info(f"New file detected: {rel_path}")

                # Load, chunk, embed, and store
                logger.info(f"Indexing file: {rel_path}")
                try:
                    from app.ingestion.loaders.markdown_loader import load_markdown
                    from app.models.document import Document

                    text = load_markdown(str(abs_path))
                    document = Document(
                        text=text,
                        source=str(abs_path),
                        file_name=abs_path.name,
                        extension=".md",
                        category=abs_path.parent.name
                    )

                    chunks = self.chunker.chunk_document(document)
                    if chunks:
                        embedded_chunks = self.embedder.embed_chunks(chunks)
                        self.chroma_store.add_documents(embedded_chunks)
                        logger.info(f"Successfully added {len(embedded_chunks)} chunks for {rel_path}")

                    # Update manifest
                    manifest[rel_path] = {
                        "hash": file_hash,
                        "indexed_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
                    }
                    updated_count += 1
                except Exception as e:
                    logger.error(f"Failed to index file {rel_path}: {e}")

        # 2. Handle deleted files
        deleted_files = [rel_path for rel_path in manifest.keys() if rel_path not in current_files]
        for rel_path in deleted_files:
            logger.info(f"File deleted from disk: {rel_path}. Deleting chunks from ChromaDB...")
            # Reconstruct the absolute path that was stored in source
            abs_path_str = str(kb_path / rel_path)
            try:
                self.chroma_store.delete_by_source(abs_path_str)
                del manifest[rel_path]
                deleted_count += 1
                logger.info(f"Successfully deleted chunks for {rel_path}")
            except Exception as e:
                logger.error(f"Failed to delete chunks for {rel_path}: {e}")

        # 3. Save manifest if any updates or deletions happened
        if updated_count > 0 or deleted_count > 0 or not manifest_path.exists():
            logger.info(f"Saving updated indexing manifest. Updated: {updated_count}, Deleted: {deleted_count}")
            try:
                with open(manifest_path, "w", encoding="utf-8") as f:
                    json.dump(manifest, f, indent=2)
            except Exception as e:
                logger.error(f"Failed to save indexing manifest: {e}")
        else:
            logger.info("No changes detected in knowledge base. Database is up to date.")

    def _compute_file_hash(self, file_path: Path) -> str:
        import hashlib
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def _initialize_manifest_after_full_index(self, kb_path: Path) -> None:
        """
        Creates/saves the indexing manifest JSON after a full indexing cycle completes.
        """
        manifest_path = Path(settings.vector_db_path).parent / "indexing_manifest.json"
        manifest = {}
        for file in kb_path.rglob("*.md"):
            if file.is_file():
                rel_path = str(file.relative_to(kb_path)).replace("\\", "/")
                manifest[rel_path] = {
                    "hash": self._compute_file_hash(file),
                    "indexed_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
                }
        try:
            with open(manifest_path, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2)
            logger.info("Saved initial indexing manifest after full index.")
        except Exception as e:
            logger.error(f"Failed to save indexing manifest: {e}")
