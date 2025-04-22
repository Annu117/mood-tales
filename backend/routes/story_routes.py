# routes/story_routes.py

from flask import Blueprint, request, jsonify
from services.story_generation import generate_story_segment
from dotenv import load_dotenv
import os

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

