# services/story_generation.py

import os
import requests
import random
from functools import lru_cache
import pickle

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
HUGGINGFACE_API_KEY = os.getenv("HF_API_TOKEN")

SYSTEM_PROMPT = """
You are a friendly, imaginative storyteller who creates engaging and age-appropriate stories for children. 
Keep the language simple and vivid. Avoid any violent, scary, or inappropriate content. 
Encourage curiosity, kindness, and creativity. 
Always ensure the story is suitable for children aged 5 to 12.

When continuing a story:
1. Consider the previous story context carefully
2. Incorporate the user's input naturally into the story
3. Maintain consistency with previous events and characters
4. End with an engaging question that invites the user to continue the story
"""

def format_story_history(history):
    """Format the story history into a coherent narrative."""
    if not history:
        return ""
    
    formatted_history = "Previous story context:\n"
    for message in history:
        if message.get('role') == 'assistant':
            formatted_history += f"Storyteller: {message.get('content', '')}\n"
        elif message.get('role') == 'user':
            formatted_history += f"Child: {message.get('content', '')}\n"
    return formatted_history

def get_age_range_from_length(story_length):
    """Map story length to appropriate age range."""
    if story_length == 1:  # Short
        return "4-6"
    elif story_length == 2:  # Medium
        return "7-9"
    else:  # Long
        return "10-12"

def generate_with_gemini(prompt, story_length, theme, history=None):
    """Generate story content using Google's Gemini API."""
    if not GEMINI_API_KEY:
        return None
        
    try:
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # Map story length to token count
        max_tokens = {1: 50, 2: 100, 3: 150}[story_length]
        
        # Prepare the full prompt with history and user input
        story_context = format_story_history(history) if history else ""
        full_prompt = f"""
        {story_context}
        
        Theme: {theme}
        Child's input: {prompt}
        
        Continue the story in a way that:
        1. Naturally incorporates the child's input
        2. Maintains consistency with previous events
        3. Keeps the story engaging and age-appropriate
        4. Ends with a question that invites the child to continue the story
        """
        
        messages = [
            {"role": "system", "parts": [{"text": SYSTEM_PROMPT}]},
            {"role": "user", "parts": [{"text": full_prompt}]}
        ]
        
        payload = {
            "contents": messages,
            "generationConfig": {
                "temperature": 0.8,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": max_tokens,
                "safetySettings": [
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_LOW_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
                ]
            }
        }
        
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            print(f"Gemini API error: {response.status_code}, {response.text}")
            return None
    
    except Exception as e:
        print(f"Error generating with Gemini: {e}")
        return None

def generate_with_huggingface(prompt, story_length, theme, history=None):
    """Generate story content using Hugging Face models as fallback."""
    if not HUGGINGFACE_API_KEY:
        return None
        
    try:
        model_id = "gpt2"  # Using GPT-2 as a reliable fallback
        
        # Map story length to token count
        max_tokens = {1: 50, 2: 100, 3: 150}[story_length]
        
        # Format the prompt with history and user input
        story_context = format_story_history(history) if history else ""
        safe_prompt = f"""
        {story_context}
        
        Theme: {theme}
        Child's input: {prompt}
        
        Continue the story in a way that:
        1. Naturally incorporates the child's input
        2. Maintains consistency with previous events
        3. Keeps the story engaging and age-appropriate
        4. Ends with a question that invites the child to continue the story
        """
        
        url = f"https://api-inference.huggingface.co/models/{model_id}"
        headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}
        
        payload = {
            "inputs": safe_prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
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
                text = text.replace(safe_prompt, "").strip()
                
                # Add a question at the end if it doesn't have one
                if not any(text.strip().endswith(q) for q in ["?", "!"]):
                    text += " What do you think happens next?"
                
                return text
            else:
                return None
        else:
            print(f"Hugging Face API error: {response.status_code}, {response.text}")
            return None
    
    except Exception as e:
        print(f"Error generating with Hugging Face: {e}")
        return None

def generate_story_segment(prompt, story_length, theme, history=None):
    """Main function to generate story content with fallbacks."""
    # Try Gemini first
    story = generate_with_gemini(prompt, story_length, theme, history)
    if story:
        return story
    
    # Try Hugging Face as fallback
    story = generate_with_huggingface(prompt, story_length, theme, history)
    if story:
        return story
    
    # If both APIs fail, return a friendly fallback message that incorporates user input
    if history:
        return f"Continuing our story... {prompt} What do you think happens next?"
    else:
        return f"Once upon a time, in a magical kingdom far, far away, there lived a friendly dragon who loved to tell stories. {prompt} What kind of adventure would you like to hear about?"

# def filter_content_for_kids(text):
#     """Simple filter to ensure content is appropriate for children."""
#     inappropriate_words = [
#         # List of inappropriate words to filter
#         # This would be a more comprehensive list in production
#     ]
# def filter_content_for_kids(text, bad_words):
#     words = text.lower().split()
#     flagged = [word.strip(".,!?") for word in words if word.strip(".,!?") in bad_words]
#     return len(flagged) == 0  # Returns True if clean


# Load the list
with open("data/ibw_bad_words.pkl", "rb") as f:
    inappropriate_words = set(pickle.load(f))

def filter_content_for_kids(text):
    """Filter to ensure content is appropriate for children."""
    text_lower = text.lower()
    
    for word in inappropriate_words:
        if word in text_lower:
            return False

    return True
