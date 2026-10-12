import json
import os
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_core.documents import Document
from uuid import uuid4
from langchain_community.document_loaders import JSONLoader
from pathlib import Path
import dotenv

# Load environment variables
dotenv.load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
pinecone_api_key = os.getenv("PINECONE_API_KEY")  # Add your Pinecone API key
index_name = os.getenv("PINECONE_INDEX_NAME")  # Add your Pinecone API key

# Initialize OpenAIEmbeddings and Pinecone client
embeddings = OpenAIEmbeddings(model="text-embedding-3-large", api_key=openai_api_key)
pinecone_client = Pinecone(api_key=pinecone_api_key)
index = pinecone_client.Index(index_name)

# Define file path
file_path = './cleaned_data.json'

# Load data from JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

def split_into_chunks(data, chunk_size=1):
    # Create a list of chunks
    chunks = [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]
    return chunks

# Convert each JSON object into a single string
def json_to_string(json_obj):
    return json.dumps(json_obj)  # Convert JSON object to string

# Convert data into chunks
chunks = split_into_chunks(data, chunk_size=1)

loader = JSONLoader(
    file_path='./cleaned_data.json',
    jq_schema='.[]',
    text_content=False)

data = loader.load()

vector_store = PineconeVectorStore(index=index, embedding=embeddings)

uuids = [str(uuid4()) for _ in range(len(data))]

vector_store.add_documents(documents=data, ids=uuids)