import numpy as np


def cosine_similarity(vector1: np.ndarray, vector2: np.ndarray) -> float:
    """
    Compute cosine similarity between two vectors.

    Returns:
        Similarity score between -1 and 1.
    """

    dot_products = np.dot(vector1, vector2)

    norm_vector1 = np.linalg.norm(vector1)
    norm_vector2 = np.linalg.norm(vector2)

    if norm_vector1 == 0 or norm_vector2 == 0:
        return 0.0

    return float(dot_products / (norm_vector1 * norm_vector2))
