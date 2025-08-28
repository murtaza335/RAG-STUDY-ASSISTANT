# ------------------------
# Install if missing:
# pip install langchain langchain-community pymupdf chromadb sentence-transformers
# ------------------------

from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings


async def createAndStoreEmbeddings(filePath: str, embedding_model: str="BAAI/bge-small-en-v1.5"):
    # --- 1. Load PDF into LangChain Documents ---
    loader = PyMuPDFLoader(filePath)
    documents = loader.load()

    # --- 2. Split into smaller overlapping chunks ---
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True,
    )

    chunks = text_splitter.split_documents(documents)

    # --- 3. Choose an embedding model ---
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model)

    # --- 4. Store chunks in ChromaDB ---
    persist_directory = f"./chroma_store/{filePath}"   # folder on disk
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )

    vectorstore.persist()
    print(f"Saved {len(chunks)} chunks into ChromaDB at '{persist_directory}'")

    return vectorstore


async def queryVectorStore(filePath: str, question: str, embedding_model: str="BAAI/bge-small-en-v1.5"):
    # --- Reload saved vectorstore ---
    persist_directory = f"./chroma_store/{filePath}"
    embeddings = HuggingFaceEmbeddings(model_name=embedding_model)

    vectorstore = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

    # --- Query your DB ---
    results = vectorstore.similarity_search(question, k=10)

    return results
