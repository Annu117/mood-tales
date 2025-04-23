# app.py
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import base64
import os
import time
import json
import spacy
import requests
# import openai
from deep_translator import GoogleTranslator
from transformers import pipeline
from bs4 import BeautifulSoup
import random
from services.recognizer import recognize_speech
from gtts import gTTS
import tempfile
import uuid
from flask import send_file
from gtts.lang import tts_langs

from dotenv import load_dotenv
from ai_service import analyze_character_image, generate_story_with_character
from image_processor import preprocess_image
from routes.story_routes import story_bp
from services.image_generator import generate_story_image
from services.story_generation import generate_story_segment


load_dotenv()

app = Flask(__name__)
app.register_blueprint(story_bp, url_prefix='/api')
CORS(app)  # Enable CORS for all routes
# Load spaCy model for entity detection
nlp = spacy.load("en_core_web_sm")
emotion_detector = pipeline("text-classification", model="joeddav/distilbert-base-uncased-go-emotions-student")
# Language codes mapping
LANGUAGES = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "Hindi": "hi",
    "Chinese": "zh",
    "Arabic": "ar",
    "German": "de",
    "Japanese": "ja",
    "Russian": "ru",
    "Portuguese": "pt",
    "Bengali": "bn",
    "Urdu": "ur",
    "Telugu": "te",
    "Tamil": "ta",
    "Marathi": "mr",
    "Korean": "ko"
}

# Global mythology database
GLOBAL_MYTHOLOGY = {
    "sita": "Hindu Goddess, wife of Lord Rama",
    "ram": "Lord Rama, prince of Ayodhya from the Ramayana",
    "hanuman": "Mighty Vanara, devotee of Lord Rama",
    "krishna": "Hindu God, central figure of Mahabharata",
    "arjuna": "Great warrior, disciple of Krishna",
    "shiva": "Supreme God of destruction in Hinduism",
    "zeus": "Greek God of Thunder and King of Olympus",
    "odin": "Norse God of wisdom, war, and death",
    "isis": "Egyptian Goddess of motherhood and magic",
    "hansel": "German folklore character from 'Hansel and Gretel'",
    "coyote": "Trickster figure from Native American mythology",
    "sun wukong": "Chinese Monkey King, central figure in Journey to the West",
    "quetzalcoatl": "Aztec feathered serpent god of wisdom",
}
#openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/api/voice", methods=["GET"])
def voice_input():
    result = recognize_speech()
    return jsonify(result)

def detect_emotion(text):
    """Enhanced sentiment analysis using a deep learning model."""
    emotions = emotion_detector(text)
    top_emotion = max(emotions, key=lambda x: x['score'])['label']
    return top_emotion.lower()

def detect_entity(text):
    """Check if text contains known mythological/historical figures."""
    words = text.lower().split()
    entities = [GLOBAL_MYTHOLOGY[word] for word in words if word in GLOBAL_MYTHOLOGY]
    return ", ".join(entities) if entities else "No special figures detected."


def translate_text(text, dest_language='en'):
    """Translate text to the specified language."""
    translator = GoogleTranslator(source="auto", target=dest_language)
    return translator.translate(text)

def fetch_stories():
    """Fetch stories from various story websites."""
    urls = [
        "https://www.talesofpanchatantra.com/",
        "https://www.indiaparenting.com/stories/",
        "https://www.templepurohit.com/vedic-vaani/hindu-mythology-stories/",
        "https://www.kidsgen.com/fables_and_fairytales/indian_mythology_stories/",
        "https://www.ancient-origins.net/myths-legends",  
        "https://www.worldoftales.com/", 
        "https://mythopedia.com/",  
        "https://www.kidsgen.com/fables_and_fairytales/african_folk_tales/",  
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

# def get_retrieved_story(query, emotion, entity_info, cultural_context, online_stories, story_context, user_preferences):
#     """Generate a story based on user input and context."""
    
#     # Extract user preferences
#     age = user_preferences.get("age", "young")
#     genre = user_preferences.get("genre", "Adventure")
#     character_name = user_preferences.get("character_name", "")
#     use_mythology = user_preferences.get("use_mythology", False)
#     use_cultural_context = user_preferences.get("use_cultural_context", False)
    
#     # System prompt
#     system_prompt = (
#         f"You are an interactive storytelling AI for children. "
#         f"Your goal is to create deeply engaging and personalized stories or continue an ongoing story, ensuring coherence, personalization and adaptation to the child's detected emotion ({emotion}). The child is {age} years old and enjoys {genre} stories. "
#         f"Maintain narrative flow, incorporating past user inputs from the story context. "
#         f"If mythology or historical characters are detected ({entity_info}), use them accurately while keeping the story engaging. "
#         f"Allow the child to guide the story, adapting to follow-up questions or modifications based on their previous inputs. "
#         f"Ensure emotional depth and consistency throughout the story experience. "
#         f"Use mythology: {'Yes' if use_mythology else 'No'}. "
#         f"If a character is provided ({character_name}), integrate them as a main figure. "
#         f"Include cultural context: {'Yes' if use_cultural_context else 'No'}. "
#         f"\n\nCurrent story context:\n{story_context}\n\n"
#         f"User input:\n{query}\n\n"
#         f"Additional relevant story elements:\n{online_stories}"
#     )

#     # Call OpenAI API for story generation
#     response = openai.ChatCompletion.create(
#         model="gpt-4",  # Use appropriate model based on your requirements
#         messages=[
#             {"role": "system", "content": system_prompt},
#             {"role": "user", "content": query}
#         ],
#         max_tokens=250,
#         temperature=0.7
#     )
    
#     return response.choices[0].message['content']

@app.route('/api/story', methods=['POST'])
async def generate_story():
    data = request.json
    
    # Extract data from request
    query = data.get('query', '')
    story_context = data.get('story_context', '')
    cultural_context = data.get('cultural_context', False)
    language = data.get('language', 'English')
    user_preferences = data.get('user_preferences', {})
    
    try:
        # Generate story using the existing story generation function
        story = generate_story_segment(
            prompt=query,
            story_length=2,  # Default to medium length
            theme=user_preferences.get('genre', 'general'),
            history=story_context,
            language=language
        )
        
        # Split the story into beginning, middle, and end
        story_parts = split_story_into_parts(story)
        
        # Generate images for each part
        images = {}
        for part, content in story_parts.items():
            image_result = await generate_story_image(
                story_content=content,
                scene_description=f"Children's story illustration for the {part} of the story: {content[:100]}"
            )
            if image_result.get('success'):
                images[part] = image_result.get('image')
        
        # Return the response
        return jsonify({
            'story': story,
            'language': language,
            'images': images
        })
        
    except Exception as e:
        print(f"Error generating story: {e}")
        return jsonify({
            'error': 'Failed to generate story. Please try again.',
            'details': str(e)
        }), 500

def split_story_into_parts(story):
    """Split the story into beginning, middle, and end parts."""
    # Simple splitting by paragraphs
    paragraphs = story.split('\n\n')
    
    # Ensure we have at least 3 paragraphs
    if len(paragraphs) < 3:
        # If not enough paragraphs, duplicate the content
        while len(paragraphs) < 3:
            paragraphs.append(paragraphs[-1])
    
    # Take the first, middle, and last paragraphs
    beginning = paragraphs[0]
    middle = paragraphs[len(paragraphs) // 2]
    end = paragraphs[-1]
    
    return {
        'beginning': beginning,
        'middle': middle,
        'end': end
    }

@app.route('/api/analyze-character', methods=['POST'])
def analyze_character():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.json
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
            
        image_data = data.get('image')
        
        # Extract image data from base64 string (remove data:image/png;base64, prefix)
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Preprocess the image
        processed_image = preprocess_image(image_data)
        
        # Analyze character using Hugging Face models
        character_analysis = analyze_character_image(processed_image)
        
        if not character_analysis:
            return jsonify({"error": "Failed to analyze character"}), 500
            
        return jsonify(character_analysis)
    except Exception as e:
        print(f"Error analyzing character: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-story', methods=['POST'])
def generate_story_rag():
    data = request.json
    character_analysis = data.get('character_analysis', {})
    
    try:
        story = generate_story_with_character(character_analysis)
        return jsonify(story)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"})

@app.route('/api/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text')
        language = data.get('language', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # Create a temporary file
        temp_dir = tempfile.gettempdir()
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(temp_dir, filename)
        
        try:
            # Generate speech with error handling for unsupported languages
            tts = gTTS(text=text, lang=language)
            tts.save(filepath)
        except Exception as e:
            # If language is not supported, fall back to English
            if "language not supported" in str(e).lower():
                print(f"Language {language} not supported, falling back to English")
                tts = gTTS(text=text, lang='en')
                tts.save(filepath)
            else:
                raise e
        
        # Send the file
        return send_file(
            filepath,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        print(f"Error in text-to-speech: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        if 'filepath' in locals():
            try:
                os.remove(filepath)
            except:
                pass

if __name__ == '__main__':
    app.run(debug=True)