from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from pathlib import Path


_EMBEDDINGS = None
_EMBEDDINGS_MODEL_NAME = None

def get_embeddings(model_name: str = "models\\bge-small-en-v1.5"):
    global _EMBEDDINGS, _EMBEDDINGS_MODEL_NAME
    if _EMBEDDINGS is None or _EMBEDDINGS_MODEL_NAME != model_name:
        _EMBEDDINGS = HuggingFaceEmbeddings(model_name=model_name)
        _EMBEDDINGS_MODEL_NAME = model_name
    return _EMBEDDINGS


from initial_cleaning import BookIngestor
from chunking import Chunker
from store_embeddings import EmbeddingStore
# import json


async def createAndStoreEmbeddings(filePath: str, embedding_model: str="models\\bge-small-en-v1.5", persist_directory: str = "./chroma_store"):

    # ============ Initial Document Cleaning ==========================
    ingestor = BookIngestor(filePath)
    book_text_cleaned = ingestor.process_book()

    # with open("data.txt", "w", encoding="utf-8") as f:
    #     f.write(book_text)

    # =================================================================

    # ============ Chunking the cleaned text ==========================
    chunker = Chunker(chunk_size=500, chunk_overlap=100)
    chunks = chunker.chunk_text(book_text_cleaned)

    # Convert chunks to Document objects
    documents = [Document(page_content=chunk["content"], metadata=chunk.get("metadata", {})) for chunk in chunks]

    # with open("chunks.json", "w", encoding="utf-8") as f:
    #     json.dump(docs, f, ensure_ascii=False, indent=2)

    # =================================================================

    # ============ Store in ChromaDB ==================================
    embeddings = get_embeddings(embedding_model)

    file_stem = Path(filePath).stem
    store = EmbeddingStore(persist_directory=persist_directory)
    persist_dir = store.store_documents(documents, embeddings, db_name=file_stem)

    return persist_dir
    # =================================================================



async def queryVectorStore(file_path: str, question: str, embedding_model: str = "models/bge-small-en-v1.5", persist_directory: str = "./chroma_store"):
    embeddings = get_embeddings(embedding_model)
    file_stem = Path(file_path).stem
    persist_dir = Path(persist_directory) / file_stem

    vectorstore = Chroma(
        persist_directory=str(persist_dir),
        embedding_function=embeddings
    )

    results = vectorstore.similarity_search(question, k=10)
    return results
