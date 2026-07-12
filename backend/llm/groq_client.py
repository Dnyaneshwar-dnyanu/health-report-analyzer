import os

from dotenv import load_dotenv
from groq import Groq
from core.config import settings
from prompts.prompt import Prompt

from llm.llm import LLM

load_dotenv()

class GroqClient(LLM):

    def __init__(self, model_name: str = settings.groq_model_name):

        api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY")

        if api_key is None:
            raise ValueError("GROQ_API_KEY not found.")
        
        self.client = Groq(api_key=api_key)
        self.model_name = model_name

    def generate(self, prompt: Prompt) -> str:

        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {
                    "role": "system",
                    "content": prompt.system
                },
                {
                    "role": "user",
                    "content": prompt.user
                },
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content