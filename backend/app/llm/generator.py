from app.llm.llm import LLM
from app.prompts.prompt import Prompt


class AnswerGenerator:

    def __init__(self, llm: LLM):
        self.llm = llm

    def generate(self, prompt: Prompt) -> str:

        return self.llm.generate(prompt)
