# myapp/views.py

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.request import Request
from .face_analysis.analyze_face import AnalyzeFace
from .face_analysis.bg_remove import BgRemove

import io
import os
import base64
import shutil
from pathlib import Path
from PIL import Image

CACHE_PATH = Path(__file__).parent / "cache"

class SaveImage:
    def __init__(self, request_image_file):
        if not os.path.exists(CACHE_PATH):
            os.mkdir(CACHE_PATH)
        
        self.full_image_path = f"{CACHE_PATH}/{request_image_file.name}"
        def save_image():
            image = Image.open(request_image_file)
            image = image.convert("RGB")
            image.save(self.full_image_path)
        
        save_image()
    
    def clear_cache(self):
        if os.path.exists(CACHE_PATH):
            shutil.rmtree(CACHE_PATH)

class ProcessImageAPI(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request: Request, *args, **kwargs):
        file_obj = request.FILES['image']
        color = request.data.get('color')
        print(f"\033[1;31m{color.split(',')=}\033[0m")
        color = [int(c) for c in color.split(',')]
        color.append(255)  # for alpha channel 

        save_image = SaveImage(file_obj)
        analyze_face = AnalyzeFace(save_image.full_image_path, CACHE_PATH)
        try: 
            analyze_face.extract_faces()
        except:
        # if not analyze_face.face_exists():
            return JsonResponse({
                'gender': "none",
                'image': "none"
            })
        analyze_face.detect_gender()
        analyze_face.save_image()
        bg_remove = BgRemove(analyze_face.full_image_path, color, 'u2net_human_seg')
        bg_remove.remove_background()

        gender = analyze_face.gender  # Get the gender information

        image = Image.open(bg_remove.full_image_path)
        image = image.convert("RGB")

        image_io = io.BytesIO()
        image.save(image_io, format='JPEG')
        image_io.seek(0)
        
        # Encode image to base64
        image_base64 = base64.b64encode(image_io.getvalue()).decode('utf-8')

        # Create a JSON response with the gender and the base64 image
        response_data = {
            'gender': gender,
            'image': image_base64
        }

        save_image.clear_cache()

        return JsonResponse(response_data)
