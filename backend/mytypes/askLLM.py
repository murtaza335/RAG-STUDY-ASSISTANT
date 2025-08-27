from pydantic import BaseModel


class askLLMRequest(BaseModel):
    question: str
    fileName: str