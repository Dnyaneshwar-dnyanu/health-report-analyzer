from dataclasses import dataclass


@dataclass
class Prompt:
    user: str
    system: str
