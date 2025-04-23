# services/image_generator.py

import requests
import base64
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("IMAGE_GENERATION_API_URL", "https://dd6b-34-87-82-123.ngrok-free.app/generate")

async def generate_story_image(story_content, scene_description=None):
    """Generate an image based on story content or scene description."""
    try:
        # Create a prompt from story content or scene description
        prompt = scene_description if scene_description else f"Children's story illustration: {story_content[:200]}"
        
        # Make the API request
        response = requests.post(
            API_URL,
            json={
                "prompt": prompt,
                "num_inference_steps": 30,
                "guidance_scale": 1.1
            },
            timeout=60
        )
        response.raise_for_status()
        
        # Convert the response to base64
        image_data = base64.b64encode(response.content).decode('utf-8')
        
        return {
            "success": True,
            "image": image_data,
            "prompt": prompt
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Image generation failed: {e}")
        return {
            "success": False,
            "error": str(e)
        }
    except Exception as e:
        print(f"Unexpected error in image generation: {e}")
        return {
            "success": False,
            "error": str(e)
        } 