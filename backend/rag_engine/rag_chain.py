# rag_engine/rag_chain.py
# from langchain.chroma import Chroma
from langchain.vectorstores import Chroma

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from .rag_utils import fetch_stories, prepare_documents

def setup_rag_chain():
    raw_text = fetch_stories()
    docs = prepare_documents(raw_text)
    
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        persist_directory="rag_db"
    )
    retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})
    
    prompt = ChatPromptTemplate.from_template("""
    You are a children's storyteller.

    Use the following context to craft a culturally rich story for kids aged {age_range}.
    The character is {name}, who is {description}. They are feeling {emotion}.
    Traits: {traits}

    Context:
    {context}

    Write a 100 word story with a positive message.
    """)
# 250–400
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)
    return create_retrieval_chain(
        retriever=retriever,
        combine_documents_chain=create_stuff_documents_chain(llm=llm, prompt=prompt)
    )

# Reusable story generator
def generate_story_rag(character, rag_chain=None):
    chain = rag_chain or setup_rag_chain()
    return chain.invoke({
        "name": character.get("name"),
        "description": character.get("description"),
        "emotion": character.get("emotion"),
        "traits": ", ".join(character.get("characteristics", [])),
        "age_range": character.get("ageRange", "3-8")
    })
