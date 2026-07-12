from sentence_transformers import SentenceTransformer

from core.config import settings

class EmbeddingModel:

    def __init__(self, model_name: str = settings.embedding_model_name):
        print(f"Loading embedding model: {model_name}")

        self.model = SentenceTransformer(
            model_name,
            trust_remote_code=True
        )

        print("Embedding model loaded.")

    def encode(self, text: str):

        return self.model.encode(text, normalize_embeddings=True)
