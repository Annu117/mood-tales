# backend/recognizer.py
import speech_recognition as sr
from deep_translator import GoogleTranslator

def recognize_speech(language='en'):
    recognizer = sr.Recognizer()
    
    # Map language codes to Google Speech Recognition language codes
    language_codes = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'hi': 'hi-IN',
        'zh': 'zh-CN',
        'ar': 'ar-SA',
        'de': 'de-DE',
        'ja': 'ja-JP',
        'ru': 'ru-RU',
        'pt': 'pt-BR',
        'bn': 'bn-BD',
        'ur': 'ur-PK',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'mr': 'mr-IN',
        'ko': 'ko-KR'
    }

    with sr.Microphone() as source:
        try:
            print(f"Listening in {language}...")
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            
            # Listen for audio
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            # Recognize speech using Google Speech Recognition
            text = recognizer.recognize_google(
                audio, 
                language=language_codes.get(language, 'en-US')
            )
            
            # If the language is not English, translate to English
            if language != 'en':
                try:
                    translated = GoogleTranslator(source=language, target='en').translate(text)
                    return {
                        "success": True, 
                        "transcript": text,
                        "translated": translated
                    }
                except Exception as e:
                    print(f"Translation error: {str(e)}")
                    return {
                        "success": True,
                        "transcript": text,
                        "translated": text
                    }
            
            return {"success": True, "transcript": text}
            
        except sr.WaitTimeoutError:
            return {"success": False, "error": "Listening timed out. Please try again."}
        except sr.UnknownValueError:
            return {"success": False, "error": "Could not understand audio. Please speak clearly."}
        except sr.RequestError as e:
            return {"success": False, "error": f"Speech recognition service error: {str(e)}"}
        except Exception as e:
            return {"success": False, "error": f"Unexpected error: {str(e)}"}
