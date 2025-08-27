import os
import google.generativeai as genai
from fastapi import FastAPI, File, HTTPException, UploadFile
from rag import createAndStoreEmbeddings, queryVectorStore
from mytypes.queryFIle import QueryRequest
from mytypes.askLLM import askLLMRequest
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

load_dotenv()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# configuring genai
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel("gemini-2.0-flash")

UPLOAD_DIR = 'uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/uploadFile")
async def upload_file(file: UploadFile = File(...)):
    # checking the format and the size of the file
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    if file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB")
    


    # save the file in the uploads directory
    with open(f"{UPLOAD_DIR}/{file.filename}", "wb") as buffer:
        buffer.write(file.file.read())
    print(f"File {file.filename} saved successfully.")

    # call the embeddings function
    await createAndStoreEmbeddings(f"{UPLOAD_DIR}/{file.filename}")
    

    return {"success" : True, "message": f"File {file.filename} uploaded successfully."}



@app.post("/api/queryFile")
async def query_file(request: QueryRequest):
    filePath = os.path.join(UPLOAD_DIR, request.fileName)
    results = await queryVectorStore(filePath, request.question)
    return {
        "success": True,
        "message": "Query executed successfully",
        "data": results
    }

@app.post("/api/askLLM")
async def ask_llm(request: askLLMRequest):

    filePath = os.path.join(UPLOAD_DIR, request.fileName)
    messages = ""
    context = await queryVectorStore(filePath, request.question)
    for doc in context:
        messages += f"{doc.page_content}\n"

    print(f"messages: {messages}")


    response = model.generate_content([
    f"""Always consider both the provided context and the user’s question when generating an answer.

If the provided context is insufficient to fully answer the question:

Inform the user that the context is not enough.

Then attempt to provide a helpful answer, but clearly include a disclaimer that the explanation is AI-generated beyond the given context.

Do not invent facts or make unsupported claims.

If the answer is unknown or cannot be found in the context or reliable knowledge, respond with “I don’t know.”

Do not reference technical labels like “page 1” or “page 2” in answers.

Provide descriptive answers where the context is relevant and helpful."""
    f"Context: {messages}",
    f"Question: {request.question}"
])
    return {
        "success": True,
        "message": "LLM query executed successfully",
        "data": response.text
    }
