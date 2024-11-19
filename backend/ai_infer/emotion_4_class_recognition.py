import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from collections import Counter
from matplotlib.patches import FancyBboxPatch
import os

def face_recognition(video, question_id, standard_emotion):
    # 저장한 모델 로드
    model = tf.keras.models.load_model('C:/Users/USER/Desktop/pjt/API/backend/ai_infer/ai_models/best_model_custom_112_4.h5')

    # Haar Cascade 로드
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # 영상 파일 열기
    cap = cv2.VideoCapture(video)

    # 영상 저장 설정
    # output_file = 'emotion_detection_4_3.mp4'
    # fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    # fps = int(cap.get(cv2.CAP_PROP_FPS))
    # frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    # out = cv2.VideoWriter(output_file, fourcc, fps, frame_size)
    emo_label_list = []
    emo_first_list = []
    emo_voice_list = []
    # 모델 입력 크기
    image_size = (112, 112)

    # 추출할 프레임 번호
    # target_frames = [1, 2, 3, 14, 15, 16, 28, 29, 30]

    frame_number = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            emo_label_list.append(np.average(temp_emo_list))
            break

        frame_number += 1
        temp_emo_list = []
        # 특정 프레임 번호에 대해 예측 수행
        # if frame_number % fps in target_frames:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # 얼굴 검출
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        for (x, y, w, h) in faces:
            face = frame[y:y+h, x:x+w]
            face_resized = cv2.resize(face, image_size)
            face_normalized = face_resized.astype('float32') / 255.0
            face_expanded = np.expand_dims(face_normalized, axis=0)
            
            prediction = model.predict(face_expanded)
            
            if question_id % 8 == 0:
                emo_first_list.append((prediction[0][2] + prediction[0][3]) / 2)
            else:
                temp_emo_list.append((prediction[0][2] + prediction[0][3]) / 2)

        if frame_number % 30 == 0:
            emo_label_list.append(np.average(temp_emo_list))
            temp = np.argmax(prediction)
            if temp == 0 or temp == 1:
                emo_voice_list.append('good')
            elif temp == 2 or temp == 3:
                emo_voice_list.append('bad')
            temp_emo_list = []

        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    cap.release()
    # out.release()
    cv2.destroyAllWindows()
    
    if question_id % 8 == 0:
        return np.average(emo_first_list)
    else:
        # 그래프 그리기
        video_name = video.split('/')[-1].split('.')[0]
        expression_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/expression'
        os.makedirs(expression_path, exist_ok=True)
        expression_graph_path = f'{expression_path}/{video_name}'
        expression_graph_image_path = f'graph/expression/{video_name}.png'

        # 그래프 생성
        plt.figure(figsize=(10, 6))
        plt.plot(emo_label_list, label='Emotion Scores', color="#9137fc", marker='o')  # 감정 점수 선 그래프
        plt.axhline(y=standard_emotion, color='red', linestyle='--')  # 기준선

        # plt.title('Emotion Recognition Analysis')
        # plt.xlabel('Frame Index')
        # plt.ylabel('Emotion Score')
        # plt.legend()
        plt.grid(True, linestyle='--', alpha=0.6)
        plt.tight_layout()

        plt.savefig(expression_graph_path, bbox_inches='tight')
        plt.close()

        return expression_graph_path + '.png', expression_graph_image_path, max(emo_label_list), emo_voice_list

# a, b, c = face_recognition('C:/Users/USER/Desktop/pjt/API/backend/media/interview_videos/1/recorded_video_2024-11-18T050031.047Z_1.mp4', 1, 0.11576608939178507)
# a = face_recognition('C:/Users/USER/Desktop/pjt/API/backend/media/interview_videos/1/recorded_video_2024-11-18T050023.600Z_8.mp4', 8, 0)
# print(a)
# print(b)
# print(c)