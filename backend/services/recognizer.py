# backend/recognizer.py
import speech_recognition as sr

def recognize_speech():
    recognizer = sr.Recognizer()

    with sr.Microphone() as source:
        try:
            print("Listening...")
            audio = recognizer.listen(source, timeout=5)
            text = recognizer.recognize_google(audio)
            return {"success": True, "transcript": text}
        except sr.WaitTimeoutError:
            return {"success": False, "error": "Listening timed out."}
        except sr.UnknownValueError:
            return {"success": False, "error": "Could not understand audio."}
        except sr.RequestError as e:
            return {"success": False, "error": f"API error: {str(e)}"}
