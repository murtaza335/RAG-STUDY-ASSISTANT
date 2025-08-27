# request body of this api
from pydantic import BaseModel


class QueryRequest(BaseModel):
    fileName: str
    question: str