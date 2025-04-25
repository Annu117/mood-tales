from flask import Blueprint, jsonify, request
from services.emotion_detection import EmotionDetectionService
import os
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

emotion_bp = Blueprint('emotion', __name__)
emotion_service = EmotionDetectionService(os.getenv('EMOTION_API_URL', 'https://f551-34-16-204-165.ngrok-free.app/detect_emotion'))

@emotion_bp.route('/start-monitoring', methods=['POST'])
def start_monitoring():
    try:
        logger.info("Starting continuous emotion monitoring")
        emotion_service.start_monitoring()
        return jsonify({'status': 'monitoring_started'})
    except Exception as e:
        logger.error(f"Error starting emotion monitoring: {str(e)}")
        return jsonify({'error': str(e)}), 500

@emotion_bp.route('/stop-monitoring', methods=['POST'])
def stop_monitoring():
    try:
        logger.info("Stopping continuous emotion monitoring")
        emotion_service.stop_monitoring()
        return jsonify({'status': 'monitoring_stopped'})
    except Exception as e:
        logger.error(f"Error stopping emotion monitoring: {str(e)}")
        return jsonify({'error': str(e)}), 500

@emotion_bp.route('/get-latest-emotion', methods=['GET'])
def get_latest_emotion():
    try:
        emotion_data = emotion_service.get_latest_emotion()
        if emotion_data:
            return jsonify(emotion_data)
        return jsonify({'status': 'no_emotion_data'})
    except Exception as e:
        logger.error(f"Error getting latest emotion: {str(e)}")
        return jsonify({'error': str(e)}), 500

@emotion_bp.route('/capture-emotion', methods=['POST'])
def capture_emotion():
    try:
        logger.info("Starting single emotion capture")
        emotion_data = emotion_service.capture_emotion()
        logger.info(f"Emotion detection successful: {emotion_data}")
        return jsonify(emotion_data)
    except Exception as e:
        logger.error(f"Error in emotion capture: {str(e)}")
        return jsonify({'error': str(e)}), 500

@emotion_bp.route('/test-emotion-api', methods=['GET'])
def test_emotion_api():
    try:
        # Test the emotion detection API connection
        response = requests.get(os.getenv('EMOTION_API_URL', 'https://f551-34-16-204-165.ngrok-free.app/detect_emotion'))
        return jsonify({'status': 'connected', 'response': response.status_code})
    except Exception as e:
        return jsonify({'error': str(e)}), 500 