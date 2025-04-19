# routes/story_routes.py

from flask import Blueprint, request, jsonify
from services.story_generation import generate_story_segment
from dotenv import load_dotenv
import os

load_dotenv()

story_bp = Blueprint("story", __name__)

@story_bp.route('/api/start-story', methods=['POST'])
def start_story():
    data = request.json
    theme = data.get('theme', 'adventure')
    story_length = data.get('storyLength', 2)
    initial_prompt = data.get('initialPrompt', 'Tell me a story')
    
    # Create initial story history
    story_history = [
        {"role": "user", "content": initial_prompt}
    ]
    
    # Generate story segment
    story_segment = generate_story_segment(initial_prompt, story_length, theme, history=story_history)
    
    # Add the generated story to history
    story_history.append({"role": "assistant", "content": story_segment})
    
    return jsonify({
        "storySegment": story_segment,
        "storyHistory": story_history
    })


@story_bp.route('/api/continue-story', methods=['POST'])
def continue_story():
    data = request.json
    story_history = data.get('storyHistory', [])
    user_input = data.get('userInput', '')
    theme = data.get('theme', 'adventure')
    story_length = data.get('storyLength', 2)
    
    # Add user input to history
    story_history.append({"role": "user", "content": user_input})
    
    # Generate story segment with history
    story_segment = generate_story_segment(user_input, story_length, theme, history=story_history)
    
    # Add the generated story to history
    story_history.append({"role": "assistant", "content": story_segment})
    
    return jsonify({
        "storySegment": story_segment,
        "storyHistory": story_history
    })

