# image_processor.py
import base64
from PIL import Image, ImageOps, ImageEnhance
import io

def preprocess_image(image_base64):
    """
    Process the image to enhance feature detection
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_base64)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize if too large
        max_size = (800, 800)
        if image.width > max_size[0] or image.height > max_size[1]:
            image.thumbnail(max_size, Image.LANCZOS)
        
        # Convert to RGB if not already
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Enhance contrast slightly to make features more prominent
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)
        
        # Convert back to base64
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG", quality=85)
        processed_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return processed_base64
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        # Return original image if processing fails
        return image_base64