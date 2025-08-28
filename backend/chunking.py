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


if __name__ == "__main__":
    with open("data_cleaned.txt", "r", encoding="utf-8") as f:
        text = f.read()

    chunker = Chunker(chunk_size=500, chunk_overlap=100)
    docs = chunker.chunk_text(text)

    with open("chunks.json", "w", encoding="utf-8") as f:
        json.dump(docs, f, ensure_ascii=False, indent=2)

    print(f"Data split into {len(docs)} chunks, saved to chunks.json")
