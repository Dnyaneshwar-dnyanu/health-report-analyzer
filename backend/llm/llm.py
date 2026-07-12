from abc import ABC, abstractmethod

from prompts.prompt import Prompt

class LLM(ABC):

    @abstractmethod
    def generate(self, prompt: Prompt) -> str:
        pass