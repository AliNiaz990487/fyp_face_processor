import os
from PIL import Image
from rembg import remove, new_session
from pathlib import Path
import numpy as np
from typing import Union

models = [
    'u2net',              # 0
    'u2netp',             # 1
    'u2net_human_seg',    # 2
    'u2net_cloth_seg',    # 3
    'silueta',            # 4
    'isnet-general-use',  # 5
    'isnet-anime',        # 6
]

class BgRemove:
    def __init__(self, img_path: Union[str, Path], bg_color, model):
        self.model = model
        self.session = new_session(model_name=model)
        self.img_path = img_path
        self.bg_color = bg_color

    def remove_background(self):
        img_name = os.path.basename(self.img_path)
        output_path = f"{os.path.dirname(self.img_path)}/{self.model}-rbg-{img_name}"
        self.full_image_path = output_path
        
        with open(self.img_path, 'rb') as i:
            with open(f"{output_path}", 'wb') as o:
                input_data = i.read()
                output_data = remove(input_data, session=self.session, bgcolor=self.bg_color)
                o.write(output_data)
                print(f"Background removed image saved to {output_path}")

