import numpy as np
import pandas as pd
import cv2
import matplotlib.pyplot as plt
import sys
import tensorflow as tf
from glob import glob
import json
import os

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from keras.models import load_model
from keras.layers import Activation, Convolution2D, Dropout, Conv2D
from keras.layers import AveragePooling2D, BatchNormalization
from keras.layers import GlobalAveragePooling2D
from keras.models import Sequential

import warnings
warnings.filterwarnings('ignore')

# 저장할 디렉터리 설정
save_image_dir = './cropped_images_112_4_class/'
save_label_file = './labels_112_4_class.json'

# 이미지 저장 디렉토리 생성
if not os.path.exists(save_image_dir):
    os.makedirs(save_image_dir)

# 라벨 리스트
labels = []

# 이미지 경로 리스트
image_data = glob('/kaggle/input/*/*/*.jpg')
print(len(image_data))

neu_json_file_path = '/kaggle/input/emotion-label-4/img_emotion_validation_data(중립).json'
hap_json_file_path = '/kaggle/input/emotion-label-4/img_emotion_validation_data(기쁨).json'
emb_json_file_path = '/kaggle/input/emotion-label-4/img_emotion_validation_data(당황).json'
unr_json_file_path = '/kaggle/input/emotion-label-4/img_emotion_validation_data(불안).json'

with open(neu_json_file_path, 'r', encoding='utf-8') as f:
    neu_data = json.load(f)
with open(hap_json_file_path, 'r', encoding='utf-8') as f:
    hap_data = json.load(f)
with open(emb_json_file_path, 'r', encoding='utf-8') as f:
    emb_data = json.load(f)
with open(unr_json_file_path, 'r', encoding='utf-8') as f:
    unr_data = json.load(f)


data_label = emb_data + neu_data + hap_data + unr_data

# 이미지 처리 및 저장
for idx, image_path in enumerate(image_data):
    image = cv2.imread(image_path)
    if image is None:
        print(f"이미지 로드 실패: {image_path}")
        continue  # 이미지 로드 실패 시 건너뜀

    image_height, image_width, _ = image.shape

    x, y, width, height = 0, 0, 0, 0
    emotion_label = ''

    # 바운딩 박스 및 라벨 추출
    for item in data_label:
        if item['filename'] == image_path.split('/')[-1]:
            x = int(item['annot_A']['boxes']['minX'])
            y = int(item['annot_A']['boxes']['minY'])
            width = int(item['annot_A']['boxes']['maxX'] - item['annot_A']['boxes']['minX'])
            height = int(item['annot_A']['boxes']['maxY'] - item['annot_A']['boxes']['minY'])
            emotion_label = item['faceExp_uploader']
            break

    if width > 0 and height > 0:
        # 이미지 크롭
        cropped_image = image[y:y+height, x:x+width]

        # 크롭된 이미지가 유효한지 확인 (높이나 너비가 0이 아닌지 확인)
        if cropped_image.size == 0 or cropped_image.shape[0] == 0 or cropped_image.shape[1] == 0:
            print(f"잘못된 크롭된 이미지: {image_path}")
            continue  # 크롭된 이미지가 비어 있거나 잘못된 경우 건너뜀

        # 이미지 리사이즈
        resized_image = cv2.resize(cropped_image, (112, 112))  # 크기 조정
        resized_image_rgb = cv2.cvtColor(resized_image, cv2.COLOR_BGR2RGB)

        # 이미지 저장 (파일 이름을 인덱스로 설정)
        image_save_path = os.path.join(save_image_dir, f'cropped_{idx}.npy')
        np.save(image_save_path, resized_image_rgb)

        # 라벨 저장 (원-핫 인코딩)
        if emotion_label == '중립':
            label = [1, 0, 0, 0]
        elif emotion_label == '기쁨':
            label = [0, 1, 0, 0]
        elif emotion_label == '당황':
            label = [0, 0, 1, 0]
        elif emotion_label == '불안':
            label = [0, 0, 0, 1]
#         elif emotion_label == '분노':
#             label = [0, 0, 0, 1, 0]
#         elif emotion_label == '상처':
#             label = [0, 0, 0, 0, 1]
#         elif emotion_label == '불안':
#             label = [0, 0, 0, 0, 0, 1]
#         elif emotion_label == '슬픔':
#             label = [0, 0, 0, 0, 0, 0, 1]
        else:
            continue  # 라벨이 없으면 건너뜀

        # 라벨을 리스트에 추가
        labels.append({'image': image_save_path, 'label': label})

# 라벨을 JSON 파일로 저장
with open(save_label_file, 'w') as f:
    json.dump(labels, f)

print("이미지 및 라벨 저장 완료.")