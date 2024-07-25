# built-in dependencies
import os
from typing import Any, Dict, List, Union

# 3rd party dependencies
import numpy as np

# project dependencies
from deepface.modules import modeling, detection, preprocessing
from deepface.extendedmodels import Gender
from pathlib import Path
from PIL import Image

DEFAULT_SAVING_PATH = Path(__file__).parent.parent/"cache"


class AnalyzeFace:
    def __init__(self, img_path: Union[str, np.ndarray], saving_path = DEFAULT_SAVING_PATH):
        self.img_objs = []
        self.gender = None
        self.img_path = img_path
        self.saving_path = saving_path
        self.create_cache()

    def extract_faces(
        self,
        detector_backend: str = "yolov8",
        enforce_detection: bool = True,
        align: bool = True,
        expand_percentage: int = 100,
        anti_spoofing: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Extract faces from the provided image using the specified detector backend.

        Args:
            img_path (str or np.ndarray): Path to the image or a numpy array in BGR format.
            detector_backend (str): The backend to use for face detection.
            enforce_detection (bool): If True, raise an exception if no face is detected.
            align (bool): If True, align the detected faces based on eye positions.
            expand_percentage (int): Expand the detected facial area by a percentage.
            anti_spoofing (bool): If True, enable anti-spoofing measures.

        Returns:
            List[Dict[str, Any]]: A list of dictionaries representing the extracted faces.
        """
        self.img_objs = detection.extract_faces(
            img_path=self.img_path,
            detector_backend=detector_backend,
            grayscale=False,
            enforce_detection=enforce_detection,
            align=align,
            expand_percentage=expand_percentage,
            anti_spoofing=anti_spoofing,
        )
        return self.img_objs

    def _preprocess_image(self, img_content: np.ndarray) -> np.ndarray:
        """
        Preprocess the image by converting it to RGB and resizing it to 224x224.

        Args:
            img_content (np.ndarray): The image content to preprocess.

        Returns:
            np.ndarray: The preprocessed image content.
        """
        # Convert BGR to RGB
        img_content = img_content[:, :, ::-1]
        # Resize the image to the target size
        return preprocessing.resize_image(img=img_content, target_size=(224, 224))

    def detect_gender(self) -> List[Dict[str, Any]]:
        """
        Detect the gender of the faces extracted from the image.

        Returns:
            List[Dict[str, Any]]: A list of dictionaries representing the gender analysis results for each detected face.
        """
        resp_objects = []

        for img_obj in self.img_objs:
            img_content = img_obj["face"]
            img_region = img_obj["facial_area"]
            img_confidence = img_obj["confidence"]

            if img_content.shape[0] == 0 or img_content.shape[1] == 0:
                continue

            img_content = self._preprocess_image(img_content)

            gender_predictions = modeling.build_model("Gender").predict(img_content)
            gender_result = {
                "region": img_region,
                "face_confidence": img_confidence,
                "gender": {label: 100 * prediction for label, prediction in zip(Gender.labels, gender_predictions)},
                "dominant_gender": Gender.labels[np.argmax(gender_predictions)],
            }

            resp_objects.append(gender_result)
        self.resp_objects = resp_objects
        self.gender = self.resp_objects[0]['dominant_gender']
        return resp_objects

    def face_exists(self) -> bool:
        if not self.img_objs: 
            return False
        return True
    
    def save_image(self):
        if not self.face_exists():
            return 
        
        face = self.img_objs[0]['face']
        face = np.array(face)
        face = face*255
        face = face.astype('uint8')
        face_img = Image.fromarray(face)
        self._image_save_at_path(face_img)
        return face.shape
    
    def _get_img_name_and_extension(self):
        file_name = os.path.basename(self.img_path)

        name, extension = os.path.splitext(file_name)
        return name, extension
    
    def _image_save_at_path(self, image: Image.Image):
        name, extension = self._get_img_name_and_extension()
        self.full_image_path = self.saving_path/f"face-{name}{extension}"
        image.save(self.full_image_path)
        
    def create_cache(self):
        if not os.path.exists(self.saving_path):
            os.mkdir(self.saving_path)
        
    def clear_cache(self):
        if not os.path.exists(self.saving_path):
            return 
        os.removedirs(self.saving_path)