from langchain.text_splitter import RecursiveCharacterTextSplitter
import json

class Chunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def chunk_text(self, text: str, metadata: dict = None) -> list:
        chunks = self.text_splitter.split_text(text)
        chunked_docs = []
        for i, chunk in enumerate(chunks):
            chunked_docs.append({
                "content": chunk,
                "metadata": {**(metadata or {}), "chunk_id": i}
            })
        return chunked_docs