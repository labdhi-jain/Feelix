from deepface import DeepFace
import cv2
import base64
import numpy as np

def detect_emotion(image_data):
    img_bytes = base64.b64decode(image_data.split(',')[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
    return result[0]['dominant_emotion']