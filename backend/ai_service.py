# ai_service.py (updated version)
import os
import json
import base64
import requests
from PIL import Image
import io
import numpy as np
from transformers import pipeline
from transformers import AutoProcessor, AutoModelForVision2Seq
from transformers import AutoImageProcessor, AutoModelForImageClassification
import google.generativeai as genai
from rag_engine.rag_chain import generate_story_rag, setup_rag_chain
import joblib

# Set number of CPU cores for joblib
os.environ['LOKY_MAX_CPU_COUNT'] = '4'  # Adjust this number based on your system

# Hugging Face API settings
HF_API_TOKEN = os.getenv('HF_API_TOKEN')
IMAGE_CAPTIONING_MODEL = "Salesforce/blip-image-captioning-large"
IMAGE_CLASSIFICATION_MODEL = "microsoft/resnet-50"

# Initialize models
try:
    # Image captioning model
    processor = AutoProcessor.from_pretrained(IMAGE_CAPTIONING_MODEL)
    model = AutoModelForVision2Seq.from_pretrained(IMAGE_CAPTIONING_MODEL)
    
    # Image classification model
    image_processor = AutoImageProcessor.from_pretrained(IMAGE_CLASSIFICATION_MODEL)
    classification_model = AutoModelForImageClassification.from_pretrained(IMAGE_CLASSIFICATION_MODEL)
except Exception as e:
    print(f"Error loading models: {str(e)}")
    processor = None
    model = None
    image_processor = None
    classification_model = None

def analyze_character_image(image_base64):
    """
    Analyze a character drawing using Hugging Face's vision models
    """
    try:
        if not image_base64:
            raise ValueError("No image data provided")
            
        if not HF_API_TOKEN:
            raise ValueError("Hugging Face API token not found")
            
        # Decode the base64 image
        try:
            image_bytes = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise ValueError(f"Invalid image data: {str(e)}")
        
        # Get image caption
        try:
            inputs = processor(image, return_tensors="pt")
            outputs = model.generate(**inputs, max_length=50)
            caption = processor.decode(outputs[0], skip_special_tokens=True)
        except Exception as e:
            print(f"Error generating caption: {str(e)}")
            caption = "A hand-drawn character"
        
        # Get image classification
        try:
            inputs = image_processor(image, return_tensors="pt")
            outputs = classification_model(**inputs)
            probs = outputs.logits.softmax(dim=1)
            top_probs, top_indices = probs.topk(5)
            
            classifications = []
            for prob, idx in zip(top_probs[0], top_indices[0]):
                label = classification_model.config.id2label[idx.item()]
                classifications.append({
                    "label": label,
                    "score": prob.item(),
                    "explanation": get_classification_explanation(label)
                })
        except Exception as e:
            print(f"Error classifying image: {str(e)}")
            classifications = [{
                "label": "drawing",
                "score": 1.0,
                "explanation": "A hand-drawn image"
            }]
        
        # Extract colors
        try:
            colors = extract_dominant_colors(image)
        except Exception as e:
            print(f"Error extracting colors: {str(e)}")
            colors = ["black"]
        
        # Determine emotion
        emotion = determine_emotion(caption, classifications)
        
        # Extract features
        features = extract_features_from_caption(caption)
        
        # Generate detailed explanation
        explanation = generate_explanation({
            "caption": caption,
            "classifications": classifications,
            "colors": colors,
            "emotion": emotion,
            "features": features
        })
        
        return {
            "description": caption,
            "features": features,
            "colors": colors,
            "emotion": emotion,
            "explanation": explanation,
            "raw_analysis": {
                "caption": caption,
                "classifications": classifications,
                "confidence_scores": {c["label"]: c["score"] for c in classifications}
            }
        }
        
    except Exception as e:
        print(f"Error in character analysis: {str(e)}")
        # Return a basic analysis instead of raising an error
        return {
            "description": "A hand-drawn character",
            "features": ["simple", "hand-drawn"],
            "colors": ["black"],
            "emotion": "neutral",
            "explanation": [{
                "aspect": "Basic Analysis",
                "text": "I see a hand-drawn character",
                "confidence": "low"
            }],
            "raw_analysis": {
                "caption": "A hand-drawn character",
                "classifications": [{
                    "label": "drawing",
                    "score": 1.0,
                    "explanation": "A hand-drawn image"
                }],
                "confidence_scores": {"drawing": 1.0}
            }
        }

def extract_dominant_colors(image, num_colors=3):
    """Extract dominant colors from image using k-means clustering"""
    # Resize image for faster processing
    img = image.copy()
    img.thumbnail((100, 100))
    
    # Convert to RGB if not already
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Get pixel data
    pixels = np.array(img)
    pixels = pixels.reshape(-1, 3)
    
    # Remove transparent/white pixels
    mask = ~np.all(pixels > 240, axis=1)
    pixels = pixels[mask]
    
    if len(pixels) == 0:
        return ["black"]
    
    # Use k-means to find dominant colors
    from sklearn.cluster import KMeans
    kmeans = KMeans(n_clusters=num_colors, random_state=42)
    kmeans.fit(pixels)
    
    # Get color names
    colors = []
    for center in kmeans.cluster_centers_:
        r, g, b = center.astype(int)
        color_name = get_color_name(r, g, b)
        if color_name not in colors:
            colors.append(color_name)
    
    return colors

def get_color_name(r, g, b):
    """Get color name from RGB values using a more sophisticated color naming system"""
    # Define color ranges with more precise thresholds
    color_ranges = {
        "red": (lambda r, g, b: r > 200 and g < 100 and b < 100),
        "green": (lambda r, g, b: r < 100 and g > 200 and b < 100),
        "blue": (lambda r, g, b: r < 100 and g < 100 and b > 200),
        "yellow": (lambda r, g, b: r > 200 and g > 200 and b < 100),
        "purple": (lambda r, g, b: r > 150 and g < 100 and b > 150),
        "orange": (lambda r, g, b: r > 200 and g > 100 and b < 100),
        "pink": (lambda r, g, b: r > 200 and g > 150 and b > 150),
        "brown": (lambda r, g, b: r > 150 and g > 75 and b < 80),
        "gray": (lambda r, g, b: abs(r - g) < 30 and abs(g - b) < 30 and r < 200),
        "black": (lambda r, g, b: r < 50 and g < 50 and b < 50),
        "white": (lambda r, g, b: r > 240 and g > 240 and b > 240)
    }
    
    # First check for black and white
    if r < 50 and g < 50 and b < 50:
        return "black"
    if r > 240 and g > 240 and b > 240:
        return "white"
    
    # Calculate color intensity
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    delta = max_val - min_val
    
    # If the color is very desaturated (grayish)
    if delta < 30:
        if max_val < 100:
            return "black"
        elif max_val > 200:
            return "white"
        else:
            return "gray"
    
    # Calculate hue
    if delta == 0:
        hue = 0
    elif max_val == r:
        hue = ((g - b) / delta) % 6
    elif max_val == g:
        hue = (b - r) / delta + 2
    else:
        hue = (r - g) / delta + 4
    
    hue = hue * 60
    
    # Determine color based on hue and saturation
    if delta < 50:  # Low saturation
        if max_val < 100:
            return "black"
        elif max_val > 200:
            return "white"
        else:
            return "gray"
    
    # Color determination based on hue
    if 0 <= hue < 30 or 330 <= hue <= 360:
        return "red"
    elif 30 <= hue < 90:
        return "orange"
    elif 90 <= hue < 150:
        return "yellow"
    elif 150 <= hue < 210:
        return "green"
    elif 210 <= hue < 270:
        return "blue"
    elif 270 <= hue < 330:
        return "purple"
    
    # Fallback to basic color detection if hue calculation fails
    for color_name, condition in color_ranges.items():
        if condition(r, g, b):
            return color_name
    
    return "mixed"

def determine_emotion(caption, classifications):
    """Determine emotion based on image analysis using a more sophisticated approach"""
    # Emotion keywords with weights
    emotion_keywords = {
        "happy": ["happy", "smile", "joy", "cheerful", "laugh", "bright", "sunny"],
        "sad": ["sad", "unhappy", "crying", "tear", "frown", "dark", "gloomy"],
        "angry": ["angry", "mad", "furious", "rage", "scowl", "fierce"],
        "surprised": ["surprised", "shock", "amazed", "wow", "astonished"],
        "scared": ["scared", "fear", "afraid", "terrified", "nervous"],
        "excited": ["excited", "enthusiastic", "eager", "thrilled", "energetic"]
    }
    
    # Calculate emotion scores
    emotion_scores = {emotion: 0 for emotion in emotion_keywords.keys()}
    
    # Check caption for emotion words
    caption_lower = caption.lower()
    for emotion, keywords in emotion_keywords.items():
        for keyword in keywords:
            if keyword in caption_lower:
                emotion_scores[emotion] += 1
    
    # Check classifications for emotion-related labels
    for classification in classifications:
        label = classification["label"].lower()
        for emotion, keywords in emotion_keywords.items():
            if any(keyword in label for keyword in keywords):
                emotion_scores[emotion] += classification["score"]
    
    # Get the emotion with highest score
    max_emotion = max(emotion_scores.items(), key=lambda x: x[1])
    return max_emotion[0] if max_emotion[1] > 0 else "neutral"

def extract_features_from_caption(caption):
    """Extract features from the image caption using a more comprehensive approach"""
    features = []
    
    # Common visual elements to look for
    visual_elements = {
        "shape": ["round", "square", "tall", "short", "big", "small", "curved", "straight"],
        "face": ["face", "eyes", "smile", "mouth", "nose", "ears", "hair"],
        "body": ["arms", "legs", "hands", "feet", "body", "head"],
        "style": ["colorful", "bright", "dark", "patterned", "simple", "complex"],
        "details": ["hat", "clothes", "accessories", "wings", "tail", "horns"]
    }
    
    caption_lower = caption.lower()
    for category, elements in visual_elements.items():
        for element in elements:
            if element in caption_lower:
            features.append(element)
    
    # Add at least two features if none were found
    if not features:
        features = ["simple", "hand-drawn"]
    
    return features

def generate_explanation(analysis):
    """Generate a detailed explanation of the drawing analysis"""
    explanation = []
    
    # Explain the main description
    if analysis["caption"]:
        explanation.append({
            "aspect": "Main Description",
            "text": f"I see {analysis['caption']}",
            "confidence": "high"
        })
    
    # Explain features
    if analysis["features"]:
        features_text = ", ".join(analysis["features"])
        explanation.append({
            "aspect": "Key Features",
            "text": f"The drawing has these notable features: {features_text}",
            "confidence": "medium"
        })
    
    # Explain colors
    if analysis["colors"]:
        colors_text = ", ".join(analysis["colors"])
        explanation.append({
            "aspect": "Colors",
            "text": f"The main colors I detected are: {colors_text}",
            "confidence": "high"
        })
    
    # Explain emotion
    if analysis["emotion"]:
        explanation.append({
            "aspect": "Emotion",
            "text": f"The drawing conveys a {analysis['emotion']} feeling",
            "confidence": "medium"
        })
    
    # Add AI model confidence information
    if analysis["classifications"]:
        top_classifications = analysis["classifications"][:3]
        explanation.append({
            "aspect": "AI Analysis",
            "text": "The AI model analyzed your drawing and identified these key elements:",
            "details": [
                {
                    "label": item["label"],
                    "score": f"{item['score']*100:.1f}%",
                    "explanation": item["explanation"]
                } for item in top_classifications
            ],
            "confidence": "high"
        })
    
    return explanation

def get_classification_explanation(label):
    """Provide detailed explanations for classification labels"""
    explanations = {
        "person": "The drawing appears to contain a person or human-like figure, with recognizable human features.",
        "animal": "I detected animal-like features in the drawing, such as fur, tails, or animal characteristics.",
        "object": "The drawing contains distinct objects or items that are clearly defined.",
        "nature": "Elements of nature like trees, flowers, or landscapes are present in the drawing.",
        "building": "The drawing includes structures or buildings with architectural features.",
        "vehicle": "I see vehicle-like elements in the drawing, such as wheels, windows, or vehicle shapes.",
        "food": "The drawing contains food-related items or elements that resemble food.",
        "plant": "Plant-like features are present in the drawing, such as leaves, stems, or flowers.",
        "furniture": "Furniture or household items are depicted in the drawing.",
        "clothing": "Clothing or wearable items are shown in the drawing.",
        "face": "The drawing contains facial features like eyes, nose, or mouth.",
        "body": "Human or animal body parts are visible in the drawing.",
        "abstract": "The drawing has abstract elements or patterns that don't clearly represent specific objects.",
        "landscape": "The drawing depicts a scene or environment with natural or man-made elements.",
        "fantasy": "The drawing contains elements that appear to be from fantasy or imagination."
    }
    return explanations.get(label.lower(), "This element contributes to the overall composition of the drawing.")

def generate_story_with_character(character_analysis):
    try:
        return generate_story_rag(character_analysis)
    except Exception as e:
        print(f"Error in RAG story generation: {str(e)}")
        return {
            "title": f"The Adventures of {character_analysis.get('name', 'Buddy')}",
            "content": f"{character_analysis.get('name', 'Buddy')} was very {character_analysis.get('emotion', 'happy')}..."
        }
