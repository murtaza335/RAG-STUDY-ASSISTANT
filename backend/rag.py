from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

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
from langchain_core.documents import Document
# import json


async def createAndStoreEmbeddings(filePath: str, embedding_model: str="models\\bge-small-en-v1.5"):

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

    embeddings = get_embeddings(embedding_model)

    persist_directory = f"./chroma_store/{filePath}"
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=persist_directory
    )

    vectorstore.persist()
    print(f"Saved {len(documents)} chunks into ChromaDB at '{persist_directory}'")

    return vectorstore


async def queryVectorStore(filePath: str, question: str, embedding_model: str="models\\bge-small-en-v1.5"):
    # --- Reload saved vectorstore ---
    persist_directory = f"./chroma_store/{filePath}"
    embeddings = get_embeddings(embedding_model)

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

    # --- Query your DB ---
    results = vectorstore.similarity_search(question, k=10)

    return results
