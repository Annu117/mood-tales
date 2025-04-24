# routes/story_routes.py

from flask import Blueprint, request, jsonify
from services.story_generation import generate_story_segment, generate_emotion_aware_story
from dotenv import load_dotenv
import os
from ai_service import analyze_character_image
from image_processor import preprocess_image
import logging
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

story_bp = Blueprint("story", __name__)

@story_bp.route('/start-story', methods=['POST'])
def start_story():
    data = request.json
    theme = data.get('theme', 'adventure')
    story_length = data.get('storyLength', 2)
    initial_prompt = data.get('initialPrompt', 'Tell me a story')
    language = data.get('language', 'en')
    
    # Create initial story history
    story_history = [
        {"role": "user", "content": initial_prompt}
    ]
    
    # Generate story segment
    story_segment = generate_story_segment(
        prompt=initial_prompt,
        story_length=story_length,
        theme=theme,
        language=language
    )

    # Add the generated story to history
    story_history.append({"role": "assistant", "content": story_segment})
    
    return jsonify({
        "storySegment": story_segment,
        "storyHistory": story_history
    })


@story_bp.route('/continue-story', methods=['POST'])
def continue_story():
    data = request.json
    story_history = data.get('storyHistory', [])
    user_input = data.get('userInput', '')
    story_length = data.get('storyLength', 2)
    theme = data.get('theme', 'adventure')
    language = data.get('language', 'en')
    
    # Add user input to history
    story_history.append({"role": "user", "content": user_input})
    
    # Generate story segment with history
    story_segment = generate_story_segment(
        prompt=user_input,
        story_length=story_length,
        theme=theme,
        history=story_history,
        language=language
    )
    
    # Add the generated story to history
    story_history.append({"role": "assistant", "content": story_segment})
    
    return jsonify({
        "storySegment": story_segment,
        "storyHistory": story_history
    })

@story_bp.route('/analyze-drawing', methods=['POST', 'OPTIONS'])
def analyze_drawing():
    if request.method == 'OPTIONS':
        return '', 200
        
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
        
        # Analyze drawing using Hugging Face models
        analysis = analyze_character_image(processed_image)
        
        if not analysis:
            return jsonify({"error": "Failed to analyze drawing"}), 500
            
        # Generate detailed explanation
        explanation = generate_explanation(analysis)
            
        return jsonify({
            "description": analysis.get("description", "A drawing"),
            "features": analysis.get("features", []),
            "colors": analysis.get("colors", []),
            "emotion": analysis.get("emotion", "neutral"),
            "explanation": explanation,
            "raw_analysis": {
                "caption": analysis.get("raw_caption", ""),
                "classification": analysis.get("raw_classification", []),
                "confidence_scores": analysis.get("confidence_scores", {})
            }
        })
    except Exception as e:
        print(f"Error analyzing drawing: {str(e)}")
        return jsonify({"error": str(e)}), 500

def generate_explanation(analysis):
    """Generate a detailed explanation of the drawing analysis."""
    explanation = []
    
    # Explain the main description
    if analysis.get("description"):
        explanation.append({
            "aspect": "Main Description",
            "text": f"I see {analysis['description']}",
            "confidence": "high"
        })
    
    # Explain features
    if analysis.get("features"):
        features_text = ", ".join(analysis["features"])
        explanation.append({
            "aspect": "Key Features",
            "text": f"The drawing has these notable features: {features_text}",
            "confidence": "medium"
        })
    
    # Explain colors
    if analysis.get("colors"):
        colors_text = ", ".join(analysis["colors"])
        explanation.append({
            "aspect": "Colors",
            "text": f"The main colors I detected are: {colors_text}",
            "confidence": "high"
        })
    
    # Explain emotion
    if analysis.get("emotion"):
        explanation.append({
            "aspect": "Emotion",
            "text": f"The drawing conveys a {analysis['emotion']} feeling",
            "confidence": "medium"
        })
    
    # Add AI model confidence information
    if analysis.get("raw_classification"):
        top_classifications = analysis["raw_classification"][:3]
        explanation.append({
            "aspect": "AI Analysis",
            "text": "The AI model analyzed your drawing and identified these key elements:",
            "details": [
                {
                    "label": item.get("label", "Unknown"),
                    "score": f"{item.get('score', 0)*100:.1f}%",
                    "explanation": get_classification_explanation(item.get("label", ""))
                } for item in top_classifications
            ],
            "confidence": "high"
        })
    
    return explanation

def get_classification_explanation(label):
    """Provide human-readable explanations for classification labels."""
    explanations = {
        "person": "The drawing appears to contain a person or human-like figure",
        "animal": "I detected animal-like features in the drawing",
        "object": "The drawing contains distinct objects or items",
        "nature": "Elements of nature like trees, flowers, or landscapes are present",
        "building": "The drawing includes structures or buildings",
        "vehicle": "I see vehicle-like elements in the drawing",
        "food": "The drawing contains food-related items",
        "plant": "Plant-like features are present in the drawing",
        "furniture": "Furniture or household items are depicted",
        "clothing": "Clothing or wearable items are shown"
    }
    return explanations.get(label.lower(), "This element contributes to the overall composition of the drawing")

@story_bp.route('/generate-emotion-aware-story', methods=['POST'])
async def generate_emotion_aware_story_route():
    try:
        data = request.json
        
        # Extract data from request
        prompt = data.get('prompt', '')
        story_length = data.get('story_length', 2)
        theme = data.get('theme', 'general')
        history = data.get('history', [])
        language = data.get('language', 'English')
        emotion = data.get('emotion', 'neutral')
        user_preferences = data.get('user_preferences', {})
        
        # Generate emotion-aware story
        story_data = await generate_emotion_aware_story(
            prompt=prompt,
            story_length=story_length,
            theme=theme,
            history=history,
            language=language,
            emotion=emotion,
            user_preferences=user_preferences
        )
        
        # Add emotion context to the response
        response_data = {
            'story': story_data['story'],
            'language': language,
            'images': story_data['images'],
            'emotion': story_data['emotion'],
            'emotion_context': story_data['emotion_context'],
            'parts': story_data['parts'],
            'user_preferences': story_data['user_preferences']
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error generating emotion-aware story: {str(e)}")
        return jsonify({'error': str(e)}), 500

