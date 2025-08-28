# store_embeddings.py
from pathlib import Path
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document


class EmbeddingStore:
    def __init__(self, persist_directory: str = "./chroma_store"):
        self.persist_directory = Path(persist_directory)

    def store_documents(self, documents: list[Document], embedding_model, db_name: str):
        """
        Store given documents into ChromaDB using the provided embedding model.
        
        Args:
            documents (list[Document]): List of LangChain Document objects.
            embedding_model: HuggingFaceEmbeddings (or other) object.
            db_name (str): Unique name for this book/vectorstore.
        """
        persist_dir = self.persist_directory / db_name
        persist_dir.mkdir(parents=True, exist_ok=True)

        vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=embedding_model,
            persist_directory=str(persist_dir)
        )

        vectorstore.persist()
        print(f"Stored {len(documents)} chunks into ChromaDB at '{persist_dir}'")

        return str(persist_dir)