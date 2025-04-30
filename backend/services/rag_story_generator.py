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
        self.current_theme = None
        self.setup_rag_chain()
    
    def update_theme(self, new_theme):
        """Update the RAG pipeline with a new theme."""
        self.setup_rag_chain(theme=new_theme)


    def fetch_stories_by_theme(self, theme):
        """Fetch themed stories based on user selection."""
        theme_sources = {
            "mythology": [
                "https://www.templepurohit.com/vedic-vaani/hindu-mythology-stories/",
                "https://www.kidsgen.com/fables_and_fairytales/indian_mythology_stories/",
                "https://mythopedia.com/",
                "https://www.ancient-origins.net/myths-legends"
            ],
            "animal": [
                "https://www.talesofpanchatantra.com/",
                "https://www.kidsgen.com/fables_and_fairytales/african_folk_tales/",
                "https://www.worldoftales.com/",
                "https://pantheon.org/",
                "https://www.worldhistory.org/mythology/",

            ],
            "bedtime": [
                "https://www.bedtimeshortstories.com/",
                "https://www.shortkidstories.com/",
                "https://www.storyberries.com/",
                "https://www.freechildrenstories.com/",
                "https://www.littlefox.com/",
            ],
            "general": [
                "https://www.pitara.com/fiction-for-kids/stories-for-kids/",
                "https://americanliterature.com/childrens-stories",
                "https://www.indiaparenting.com/stories/",
                "https://www.uniteforliteracy.com/",
                "https://www.globalstorybooks.net/"
            ]
        }

        urls = theme_sources.get(theme.lower(), theme_sources["general"])
        stories = []

        for url in urls:
            try:
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")
                    extracted = [p.text.strip() for p in soup.find_all("p")[:5]]
                    stories.extend(extracted)
            except Exception as e:
                print(f"Failed fetching {url}: {e}")
                continue

        return "\n".join(stories) if stories else "No themed stories found."

    def prepare_documents(self, raw_text, theme):
        """Prepare documents for vector store."""
        # splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        # return splitter.split_documents([Document(page_content=raw_text)])
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        docs = splitter.split_documents([Document(page_content=raw_text)])

        # Tag documents with theme metadata
        for doc in docs:
            doc.metadata["theme"] = theme

        return docs

    def setup_rag_chain(self,  theme="general"):
        """Set up RAG chain based on selected theme."""
        
        persist_dir = f"story_db_{theme}"
        if self.current_theme == theme:
            return  # Already set up
        self.current_theme = theme
        # Try loading an existing vector store
        if os.path.exists(persist_dir):
            # self.vectorstore = Chroma(persist_directory=persist_dir, embedding=self.embeddings)
            self.vectorstore = Chroma(
                embedding_function=self.embeddings,
                persist_directory=persist_dir
            )

            print(f"Loaded vectorstore for theme: {theme}")
        else:
            raw_text = self.fetch_stories_by_theme(theme)
            docs = self.prepare_documents(raw_text, theme)

            self.vectorstore = Chroma.from_documents(
                documents=docs,
                embedding=self.embeddings,
                persist_directory=persist_dir
            )
            print(f"Created new vectorstore for theme: {theme}")

        # raw_text = self.fetch_stories_by_theme(theme)
        # docs = self.prepare_documents(raw_text, theme)

        # self.vectorstore = Chroma.from_documents(
        #     documents=docs,
        #     embedding=self.embeddings,
        #     persist_directory=f"story_db_{theme}"
        # )

        self.retriever = self.vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5, "filter": {"theme": theme}}
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

        self.document_chain = create_stuff_documents_chain(llm=self.llm, prompt=self.prompt)
        self.chain = create_retrieval_chain(
            retriever=self.retriever,
            combine_docs_chain=self.document_chain
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