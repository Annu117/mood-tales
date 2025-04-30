# rag_engine/rag_chain.py
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from .rag_utils import fetch_stories, prepare_documents
import requests
import os
from dotenv import load_dotenv

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HF_API_TOKEN")

def generate_with_huggingface(prompt, character_details):
    """Fallback story generation using Hugging Face models."""
    if not HUGGINGFACE_API_KEY:
        return None
        
    try:
        model_id = "gpt2"  # Using GPT-2 as a reliable fallback
        
        # Format the prompt with character details
        full_prompt = f"""
        Create a children's story about {character_details['name']} who is {character_details['description']}.
        The character is feeling {character_details['emotion']} and has these features: {character_details['traits']}.
        Use these colors in the story: {character_details['colors']}.
        
        The story should be appropriate for children aged {character_details['age_range']}.
        Write the story in {character_details['language']} language.
        """
        
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 200,
                "temperature": 0.8,
                "top_p": 0.95,
                "repetition_penalty": 1.2,
                "do_sample": True
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) > 0:
                text = result[0].get("generated_text", "")
                # Remove the prompt from the response
                text = text.replace(full_prompt, "").strip()
                return text
        return None
        
    except Exception as e:
        print(f"Error in Hugging Face fallback: {str(e)}")
        return None

def generate_simple_story(character_details):
    """Ultimate fallback for story generation."""
    return f"""
    Once upon a time, there was a character named {character_details['name']}.
    {character_details['name']} was {character_details['description']} and felt {character_details['emotion']}.
    With {character_details['traits']} and colors like {character_details['colors']},
    {character_details['name']} went on a wonderful adventure.
    
    What kind of adventure would you like to hear about next?
    """

def setup_rag_chain():
    try:
        raw_text = fetch_stories()
        docs = prepare_documents(raw_text)
        
        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
            persist_directory="rag_db"
        )
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})
        
        prompt = ChatPromptTemplate.from_template("""
        You are a creative children's storyteller who creates engaging stories based on drawings.

        Use the following context to craft a story for kids aged {age_range}.
        
        Character Details:
        - Name: {name}
        - Description: {description}
        - Emotion: {emotion}
        - Visual Features: {traits}
        - Colors: {colors}
        
        Context from similar stories:
        {context}
        
        Create a story that:
        1. Incorporates the visual elements from the drawing
        2. Uses the colors and features to create vivid imagery
        3. Matches the emotional tone of the drawing
        4. Is engaging and appropriate for children
        5. Has a positive message
        
        Write the story in {language} language.
        """)

        llm = ChatGoogleGenerativeAI(
            model="gemini-1.0-pro",
            temperature=0.7,
            convert_system_message_to_human=True
        )
        
        return create_retrieval_chain(
            retriever=retriever,
            combine_docs_chain=create_stuff_documents_chain(llm=llm, prompt=prompt)
        )
    except Exception as e:
        print(f"Error setting up RAG chain: {str(e)}")
        return None

def generate_story_rag(character, rag_chain=None):
    """Generate story with multiple fallback mechanisms."""
    try:
        # Prepare character details for fallbacks
        character_details = {
            "name": character.get("name"),
            "description": character.get("description"),
            "emotion": character.get("emotion"),
            "traits": ", ".join(character.get("characteristics", [])),
            "colors": ", ".join(character.get("colors", [])),
            "age_range": character.get("ageRange", "5-12"),
            "language": character.get("language", "en")
        }
        
        # Try RAG-based generation first
        chain = rag_chain or setup_rag_chain()
        if chain:
            try:
                response = chain.invoke({
                    "input": f"Create a story about {character_details['name']} who is {character_details['description']} and feeling {character_details['emotion']}",
                    "name": character_details["name"],
                    "description": character_details["description"],
                    "emotion": character_details["emotion"],
                    "traits": character_details["traits"],
                    "colors": character_details["colors"],
                    "age_range": character_details["age_range"],
                    "language": character_details["language"]
                })
                
                if response and response.get("answer"):
                    return response["answer"]
            except Exception as e:
                print(f"Error in RAG generation: {str(e)}")
        
        # Fallback to Hugging Face
        huggingface_story = generate_with_huggingface(
            f"Create a story about {character_details['name']}", 
            character_details
        )
        if huggingface_story:
            return huggingface_story
            
        # Ultimate fallback to simple story
        return generate_simple_story(character_details)
        
    except Exception as e:
        print(f"Error in story generation: {str(e)}")
        # Return a basic story as last resort
        return f"Once upon a time, there was a character named {character.get('name', 'Buddy')} who was feeling {character.get('emotion', 'happy')}. What would you like to happen next?"
