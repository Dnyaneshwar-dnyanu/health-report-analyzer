from llm.llm import LLM
from prompts.prompt import Prompt

class AnswerGenerator:

    def __init__(self, llm: LLM):
        self.llm = llm

    def generate(self, prompt: Prompt) -> str:

        return self.llm.generate(prompt)