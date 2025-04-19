# ai_service.py (updated version)
import os
import json
import base64
import requests
from PIL import Image
import io
import google.generativeai as genai
from rag_engine.rag_chain import generate_story_rag, setup_rag_chain

# Hugging Face API settings
HF_API_TOKEN = os.getenv('HF_API_TOKEN')  # Set this in your .env file
IMAGE_CAPTIONING_API = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
IMAGE_CLASSIFICATION_API = "https://api-inference.huggingface.co/models/microsoft/resnet-50"

def analyze_character_image(image_base64):
    """
    Analyze a character drawing using Hugging Face's vision models
    """
    try:
        if not image_base64:
            raise ValueError("No image data provided")
            
        if not HF_API_TOKEN:
            raise ValueError("Hugging Face API token not found. Please set HF_API_TOKEN in your .env file")
            
        # Decode the base64 image
        try:
            image_bytes = base64.b64decode(image_base64)
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")
        
        # Set up headers for Hugging Face API
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        
        # Get image caption from BLIP model
        try:
            caption_response = requests.post(
                IMAGE_CAPTIONING_API, 
                headers=headers, 
                data=image_bytes,
                timeout=10
            )
            caption_response.raise_for_status()
            caption_result = caption_response.json()
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Failed to get image caption: {str(e)}")
        
        # Get image classification from ResNet model
        try:
            classify_response = requests.post(
                IMAGE_CLASSIFICATION_API, 
                headers=headers, 
                data=image_bytes,
                timeout=10
            )
            classify_response.raise_for_status()
            classification_result = classify_response.json()
        except requests.exceptions.RequestException as e:
            raise ValueError(f"Failed to classify image: {str(e)}")
        
        # Extract colors from image
        try:
            image = Image.open(io.BytesIO(image_bytes))
            colors = extract_dominant_colors(image)
        except Exception as e:
            raise ValueError(f"Failed to process image: {str(e)}")
        
        # Determine emotion based on classification and caption
        emotion = determine_emotion(caption_result, classification_result)
        
        # Process caption to extract features
        features = extract_features_from_caption(caption_result[0]['generated_text'])
        
        # Construct character analysis
        analysis = {
            "colors": colors,
            "features": features,
            "emotion": emotion,
            "characteristics": derive_characteristics(features, emotion),
            "ageRange": "3-8",  # Default age range
            "description": caption_result[0]['generated_text'],
            "name": generate_character_name(features, emotion),
            "raw_caption": caption_result[0]['generated_text'],
            "raw_classification": classification_result[:3]  # Top 3 classifications
        }
        
        return analysis
        
    except Exception as e:
        print(f"Error in character analysis: {str(e)}")
        # Return fallback analysis if API fails
        return {
            "colors": ["blue", "red", "yellow"],
            "features": ["round shape", "simple lines"],
            "emotion": "happy",
            "characteristics": ["friendly", "simple"],
            "ageRange": "3-5",
            "description": "A simple, colorful character drawn by hand.",
            "name": "Doodle",
            "raw_caption": "Error analyzing image",
            "raw_classification": []
        }

def extract_dominant_colors(image, num_colors=3):
    """Extract dominant colors from image"""
    # Resize image for faster processing
    img = image.copy()
    img.thumbnail((100, 100))
    
    # Convert to RGB if not already
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Get pixel data
    pixels = list(img.getdata())
    
    # Simple color clustering
    color_counts = {}
    for pixel in pixels:
        # Simplify the color (reduce precision)
        simple_color = (pixel[0]//25*25, pixel[1]//25*25, pixel[2]//25*25)
        if simple_color in color_counts:
            color_counts[simple_color] += 1
        else:
            color_counts[simple_color] = 1
    
    # Get top colors
    sorted_colors = sorted(color_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Convert RGB to color names (simplified)
    color_names = []
    for color, _ in sorted_colors[:num_colors]:
        r, g, b = color
        # Very simple color naming logic
        if r > 200 and g > 200 and b > 200:
            color_names.append("white")
        elif r < 50 and g < 50 and b < 50:
            color_names.append("black")
        elif r > 200 and g < 100 and b < 100:
            color_names.append("red")
        elif r < 100 and g > 200 and b < 100:
            color_names.append("green")
        elif r < 100 and g < 100 and b > 200:
            color_names.append("blue")
        elif r > 200 and g > 200 and b < 100:
            color_names.append("yellow")
        elif r > 200 and g < 100 and b > 200:
            color_names.append("pink")
        elif r < 100 and g > 200 and b > 200:
            color_names.append("cyan")
        elif r > 200 and g > 130 and b < 100:
            color_names.append("orange")
        elif r > 130 and g < 100 and b > 130:
            color_names.append("purple")
        else:
            color_names.append("mixed")
    
    return color_names

def determine_emotion(caption_result, classification_result):
    """Determine the emotion based on image analysis"""
    caption = caption_result[0]['generated_text'].lower()
    
    # Check for emotion words in caption
    emotion_keywords = {
        "happy": ["happy", "smile", "joy", "cheerful", "laugh"],
        "sad": ["sad", "unhappy", "crying", "tear", "frown"],
        "angry": ["angry", "mad", "furious", "rage"],
        "surprised": ["surprised", "shock", "amazed", "wow"],
        "scared": ["scared", "fear", "afraid", "terrified"],
        "excited": ["excited", "enthusiastic", "eager"]
    }
    
    for emotion, keywords in emotion_keywords.items():
        if any(keyword in caption for keyword in keywords):
            return emotion
    
    # If no emotion detected in caption, default to "happy"
    return "happy"

def extract_features_from_caption(caption):
    """Extract features from the image caption"""
    features = []
    
    # Common visual elements to look for
    visual_elements = [
        "round", "square", "tall", "short", "big", "small",
        "face", "eyes", "smile", "hat", "arms", "legs",
        "colorful", "bright", "dark", "patterned"
    ]
    
    for element in visual_elements:
        if element in caption.lower():
            features.append(element)
    
    # Add at least two features if none were found
    if not features:
        features = ["simple", "hand-drawn"]
    
    return features

def derive_characteristics(features, emotion):
    """Derive character traits from features and emotion"""
    trait_mapping = {
        "happy": ["friendly", "cheerful", "outgoing"],
        "sad": ["sensitive", "thoughtful", "quiet"],
        "angry": ["bold", "strong", "determined"],
        "surprised": ["curious", "adventurous", "observant"],
        "scared": ["cautious", "gentle", "caring"],
        "excited": ["energetic", "playful", "enthusiastic"]
    }
    
    # Get traits based on emotion
    traits = trait_mapping.get(emotion, ["friendly", "creative"])
    
    # Add traits based on features
    if "big" in features:
        traits.append("confident")
    if "small" in features:
        traits.append("clever")
    if "colorful" in features:
        traits.append("creative")
    if "bright" in features:
        traits.append("optimistic")
    
    return traits[:3]  # Return up to 3 traits

def generate_character_name(features, emotion):
    """Generate a fun name for the character"""
    first_names = [
        "Bubbles", "Sprinkles", "Doodle", "Squiggly", "Ziggy",
        "Sunny", "Cloudy", "Sparkle", "Twinkle", "Fluffy",
        "Blip", "Blob", "Scribble", "Swirly", "Dotty"
    ]
    
    last_names = [
        "Brush", "Pencil", "Crayon", "Marker", "Paint",
        "Rainbow", "Color", "McDraws", "Sketch", "Lines",
        "Doodle", "Art", "Picture", "Canvas", "Paper"
    ]
    
    import random
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    
    return f"{first_name} {last_name}"

# def generate_story_with_character(character_analysis):
#     """
#     Generate a story based on character analysis
#     """
#     try:
#         # Create a text model instance
#         model = genai.GenerativeModel('gemini-pro')
        
#         # Extract character details
#         name = character_analysis.get('name', 'Buddy')
#         emotion = character_analysis.get('emotion', 'happy')
#         description = character_analysis.get('description', 'A friendly character')
#         age_range = character_analysis.get('ageRange', '3-5')
#         characteristics = ", ".join(character_analysis.get('characteristics', ['friendly']))
        
#         # Determine story complexity based on age range
#         if age_range == "3-5":
#             complexity = "very simple language, short sentences, repetition, and a basic plot"
#         elif age_range == "6-8":
#             complexity = "simple language, medium-length sentences, and a clear plot with a problem and solution"
#         else:
#             complexity = "moderate vocabulary, longer sentences, and a more developed plot with some challenges"
        
#         # Prepare the prompt for story generation
#         prompt = f"""
#         Write a children's story featuring a character named {name}.
        
#         Character description: {description}
#         Character traits: {characteristics}
#         Primary emotion: {emotion}
        
#         Create a story with {complexity}. The story should:
#         1. Be appropriate for children in the {age_range} age range
#         2. Include an emotional journey related to the character's primary emotion
#         3. Have a positive message or lesson
#         4. Be engaging and creative
#         5. Be between 200-400 words
        
#         Format the response as JSON with these fields:
#         - title: a creative title for the story
#         - content: the full story text
#         """
        
#         # Generate response
#         response = model.generate_content(prompt)
        
#         # Extract JSON from response text
#         json_str = response.text
#         # Find JSON content between triple backticks if present
#         if "```json" in json_str and "```" in json_str.split("```json", 1)[1]:
#             json_content = json_str.split("```json", 1)[1].split("```", 1)[0].strip()
#         elif "```" in json_str and "```" in json_str.split("```", 1)[1]:
#             json_content = json_str.split("```", 1)[1].split("```", 1)[0].strip()
#         else:
#             json_content = json_str.strip()
        
#         # Parse JSON
#         story = json.loads(json_content)
#         return story
        
#     except Exception as e:
#         print(f"Error in story generation: {str(e)}")
#         # Return fallback story if AI fails
#         return {
#             "title": f"The Adventures of {character_analysis.get('name', 'Buddy')}",
#             "content": f"Once upon a time, there was a character named {character_analysis.get('name', 'Buddy')}. "
#                       f"They were very {character_analysis.get('emotion', 'happy')} and loved to play. "
#                       f"One day, they went on an adventure and made many friends. "
#                       f"Everyone loved {character_analysis.get('name', 'Buddy')} because they were so {character_analysis.get('characteristics', ['friendly'])[0]}. "
#                       f"The end."
#         }

def generate_story_with_character(character_analysis):
    try:
        return generate_story_rag(character_analysis)
    except Exception as e:
        print(f"Error in RAG story generation: {str(e)}")
        return {
            "title": f"The Adventures of {character_analysis.get('name', 'Buddy')}",
            "content": f"{character_analysis.get('name', 'Buddy')} was very {character_analysis.get('emotion', 'happy')}..."
        }

# def generate_story_with_character(character, rag_chain=None):
#     chain = rag_chain or setup_rag_chain()
#     result = chain.invoke({
#         "name": character.get("name") or "Buddy",
#         "description": character.get("description") or "a fun-loving character",
#         "emotion": character.get("emotion") or "happy",
#         "traits": ", ".join(character.get("characteristics", ["friendly"])),
#         "age_range": character.get("ageRange", "3-8")
#     })

#     # Log and validate
#     print("[DEBUG] RAG result:", result)

#     # Return consistent format expected by frontend
#     if isinstance(result, dict) and "answer" in result:
#         return {
#             "title": f"The Story of {character.get('name', 'Buddy')}",
#             "content": result["answer"]
#         }

#     # Fallback if no answer
#     return {
#         "title": "Oops! AI was sleepy...",
#         "content": "We couldn't craft a story this time. Try redrawing or changing the details!"
#     }
