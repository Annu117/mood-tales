import cv2
import requests
import os
import base64
from typing import Dict, Any, Generator
import tempfile
import time
import threading
from queue import Queue

class EmotionDetectionService:
    def __init__(self, api_url: str):
        self.api_url = api_url
        self.is_monitoring = False
        self.emotion_queue = Queue()
        self.camera = None
        self.monitor_thread = None

    def start_monitoring(self) -> None:
        """Start continuous emotion monitoring"""
        if self.is_monitoring:
            return

        self.is_monitoring = True
        self.camera = cv2.VideoCapture(0)
        if not self.camera.isOpened():
            raise Exception("Could not open webcam")

        # Set camera properties
        self.camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

        # Start monitoring thread
        self.monitor_thread = threading.Thread(target=self._monitor_emotions)
        self.monitor_thread.daemon = True
        self.monitor_thread.start()

    def stop_monitoring(self) -> None:
        """Stop continuous emotion monitoring"""
        self.is_monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join()
        if self.camera:
            self.camera.release()
        cv2.destroyAllWindows()

    def _monitor_emotions(self) -> None:
        """Background thread for continuous emotion monitoring"""
        while self.is_monitoring:
            try:
                ret, frame = self.camera.read()
                if not ret:
                    continue

                # Create temporary file
                with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                    temp_path = temp_file.name
                    cv2.imwrite(temp_path, frame)

                # Send to emotion detection API
                with open(temp_path, 'rb') as f:
                    files = {'file': (temp_path, f, 'image/jpeg')}
                    response = requests.post(self.api_url, files=files)

                # Clean up temporary file
                os.remove(temp_path)

                if response.status_code == 200:
                    data = response.json()
                    if 'error' not in data:
                        self.emotion_queue.put(data)

                # Add a small delay to prevent overwhelming the API
                time.sleep(1)

            except Exception as e:
                print(f"Error in emotion monitoring: {str(e)}")
                time.sleep(1)

    def get_latest_emotion(self) -> Dict[str, Any]:
        """Get the latest detected emotion"""
        try:
            return self.emotion_queue.get_nowait()
        except:
            return None

    def capture_emotion(self) -> Dict[str, Any]:
        """
        Captures a single image from webcam and sends it to the emotion detection API
        Returns a dictionary containing emotion data
        """
        try:
            # Initialize camera
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                raise Exception("Could not open webcam")

            # Set camera properties
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

            # Capture frame
            ret, frame = cap.read()
            if not ret:
                raise Exception("Failed to grab frame")

            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                temp_path = temp_file.name
                cv2.imwrite(temp_path, frame)

            # Clean up camera
            cap.release()
            cv2.destroyAllWindows()

            # Send to emotion detection API
            with open(temp_path, 'rb') as f:
                files = {'file': (temp_path, f, 'image/jpeg')}
                response = requests.post(self.api_url, files=files)

            # Clean up temporary file
            os.remove(temp_path)

            if response.status_code == 200:
                data = response.json()
                if 'error' in data:
                    raise Exception(f"Server error: {data['error']}")
                return data
            else:
                raise Exception(f"Request failed (HTTP {response.status_code}): {response.text}")

        except Exception as e:
            raise Exception(f"Emotion detection failed: {str(e)}") 