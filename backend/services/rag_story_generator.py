# services/rag_story_generator.py

import os
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

import requests
from bs4 import BeautifulSoup
import json
from dotenv import load_dotenv
import os

load_dotenv() 
google_api_key = os.getenv("GOOGLE_API_KEY")

if google_api_key is None:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please check your .env file.")

os.environ["GOOGLE_API_KEY"] = google_api_key

# os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

class RAGStoryGenerator:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.7)

        self.vectorstore = None
        self.retriever = None
        self.setup_rag_chain()

    def fetch_stories(self):
        """Fetch stories from various story websites."""
        urls = [
            "https://www.talesofpanchatantra.com/",
            "https://www.indiaparenting.com/stories/",
            "https://www.templepurohit.com/vedic-vaani/hindu-mythology-stories/",
            "https://www.kidsgen.com/fables_and_fairytales/indian_mythology_stories/",
            "https://www.ancient-origins.net/myths-legends",  
            "https://www.worldoftales.com/", 
            "https://mythopedia.com/",  
            "https://www.kidsgen.com/fables_and_fairytales/african_folk_tales/"
        ]
        
        stories = []
        for url in urls:
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    extracted_stories = [story.text for story in soup.find_all("p")[:5]]
                    stories.extend(extracted_stories)
            except requests.exceptions.RequestException:
                continue

        return "\n".join(stories) if stories else "No online stories found."

    def prepare_documents(self, raw_text):
        """Prepare documents for vector store."""
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        return splitter.split_documents([Document(page_content=raw_text)])

    def setup_rag_chain(self):
        """Set up the RAG chain with story content."""
        # Fetch and prepare stories
        raw_text = self.fetch_stories()
        docs = self.prepare_documents(raw_text)
        
        # Create vector store
        self.vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=self.embeddings,
            persist_directory="story_db"
        )
        
        # Create retriever
        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 6}
        )
        self.prompt = ChatPromptTemplate.from_template("""
            You are a creative children's storyteller who creates personalized stories based on the child's input and relevant story content.

            Use the following context from various stories to craft a unique and engaging story:
            {context}

            Child's input: {input}
            Story history: {story_history}
            Word count limit: {word_count}

            Create a story segment that:
            1. Incorporates the child's input naturally
            2. Uses elements from the provided story context
            3. Maintains consistency with previous story events
            4. Is appropriate for children
            5. Ends with an engaging question
            6. Is approximately {word_count} words long

            Story segment:
            """)

        # Create document chain
        self.document_chain = create_stuff_documents_chain(
            llm=self.llm,
            prompt=self.prompt
        )
        
        # Create retrieval chain
        self.chain = create_retrieval_chain(
            self.retriever,
            self.document_chain
        )

    def generate_story(self, user_input, story_history=None, word_count=50):
        """Generate a story segment using RAG.
        
        Args:
            user_input (str): The user's input for the story
            story_history (list, optional): Previous story messages
            word_count (int, optional): Desired word count for the story. Defaults to 50.
        """
        try:
            # Format story history
            formatted_history = ""
            if story_history:
                for message in story_history:
                    if message.get('role') == 'assistant':
                        formatted_history += f"Storyteller: {message.get('content', '')}\n"
                    elif message.get('role') == 'user':
                        formatted_history += f"Child: {message.get('content', '')}\n"

            # Generate story
            response = self.chain.invoke({
                "input": user_input,
                "story_history": formatted_history,
                "word_count": word_count
            })
            
            return response.get("answer", "Once upon a time... What would you like to happen next?")
            
        except Exception as e:
            print(f"Error generating story with RAG: {e}")
            return "Once upon a time... What would you like to happen next?" 