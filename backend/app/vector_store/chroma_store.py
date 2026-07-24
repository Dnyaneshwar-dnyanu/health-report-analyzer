import numpy as np
import chromadb
from app.models.chunk import Chunk
from app.models.embedded_chunk import EmbeddedChunk
from app.models.search_result import SearchResult
from app.core.config import settings


class ChromaStore:

    def __init__(self, persist_directory: str = settings.vector_db_path, collection_name: str = "medical_kb"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_documents(self, embedded_chunks: list[EmbeddedChunk]) -> None:
        """
        Add embedded chunks to ChromaDB.
        """
        if not embedded_chunks:
            return

        ids = []
        embeddings = []
        documents = []
        metadatas = []

        for embedded_chunk in embedded_chunks:
            chunk = embedded_chunk.chunk
            ids.append(chunk.chunk_id)
            # Convert embedding to list of floats if it's a numpy array
            embeddings.append(embedded_chunk.embedding.tolist())
            documents.append(chunk.text)
            metadatas.append({
                "source": chunk.source,
                "file_name": chunk.file_name,
                "category": chunk.category,
                "section": chunk.section
            })

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def search(self, query_embedding, top_k: int = 5, category: str | None = None, where: dict | None = None) -> list[SearchResult]:
        """
        Search for query embedding in ChromaDB with optional metadata filtering.
        """
        # Convert embedding to list if it's a numpy array
        if hasattr(query_embedding, "tolist"):
            query_embedding = query_embedding.tolist()

        filter_dict = where or {}
        if category and "category" not in filter_dict:
            filter_dict["category"] = category

        query_kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": top_k
        }
        if filter_dict:
            query_kwargs["where"] = filter_dict

        results = self.collection.query(**query_kwargs)


        search_results = []
        if results and results["ids"] and len(results["ids"][0]) > 0:
            ids = results["ids"][0]
            documents = results["documents"][0]
            metadatas = results["metadatas"][0]
            distances = results["distances"][0] if "distances" in results and results["distances"] else [0.0] * len(ids)

            for i in range(len(ids)):
                metadata = metadatas[i]
                chunk = Chunk(
                    chunk_id=ids[i],
                    text=documents[i],
                    source=metadata.get("source", ""),
                    file_name=metadata.get("file_name", ""),
                    category=metadata.get("category", ""),
                    section=metadata.get("section", "")
                )

                # Since we don't need to load the embedding from chroma during query, 
                # we can populate with dummy embedding or empty numpy array to save bandwidth.
                embedded_chunk = EmbeddedChunk(
                    chunk=chunk,
                    embedding=np.zeros((1,))
                )

                # For cosine distance, similarity = 1 - distance
                similarity = 1.0 - distances[i]
                search_results.append(
                    SearchResult(
                        chunk=embedded_chunk,
                        similarity=similarity
                    )
                )

        # Sort results by similarity descending
        search_results.sort(key=lambda x: x.similarity, reverse=True)
        return search_results

    def get_document_count(self) -> int:
        return self.collection.count()

    def delete_by_source(self, source_path: str) -> None:
        """
        Delete all documents associated with a source path.
        """
        self.collection.delete(where={"source": source_path})

