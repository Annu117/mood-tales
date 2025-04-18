# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
import json
from dotenv import load_dotenv
from ai_service import analyze_character_image, generate_story_with_character
from image_processor import preprocess_image

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/analyze-character', methods=['POST'])
def analyze_character():
    try:
        data = request.json
        image_data = data.get('image')
        
        # Extract image data from base64 string (remove data:image/png;base64, prefix)
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        # Preprocess the image
        processed_image = preprocess_image(image_data)
        
        # Analyze character using Hugging Face models
        character_analysis = analyze_character_image(processed_image)
        
        return jsonify(character_analysis)
    except Exception as e:
        print(f"Error analyzing character: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    try:
        data = request.json
        character_analysis = data.get('character')
        
        # Generate story based on character analysis
        story = generate_story_with_character(character_analysis)
        
        return jsonify(story)
    except Exception as e:
        print(f"Error generating story: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Server is running"})

if __name__ == '__main__':
    app.run(debug=True)