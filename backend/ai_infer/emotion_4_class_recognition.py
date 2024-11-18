import cv2
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from collections import Counter
from matplotlib.patches import FancyBboxPatch
import os

def face_recognition(video):
    # 저장한 모델 로드
    model = tf.keras.models.load_model('C:/Users/USER/Desktop/pjt/API/backend/ai_infer/ai_models/best_model_custom_112_4.h5')

    # Haar Cascade 로드
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # 영상 파일 열기
    cap = cv2.VideoCapture(video)

    # 영상 저장 설정
    # output_file = 'emotion_detection_4_3.mp4'
    # fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    # frame_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
    # out = cv2.VideoWriter(output_file, fourcc, fps, frame_size)
    emo_label_list = []

    # 모델 입력 크기
    image_size = (112, 112)

    # 추출할 프레임 번호
    target_frames = [1, 2, 3, 14, 15, 16, 28, 29, 30]

    frame_number = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_number += 1

        # 특정 프레임 번호에 대해 예측 수행
        if frame_number % fps in target_frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # 얼굴 검출
            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            for (x, y, w, h) in faces:
                face = frame[y:y+h, x:x+w]
                face_resized = cv2.resize(face, image_size)
                face_normalized = face_resized.astype('float32') / 255.0
                face_expanded = np.expand_dims(face_normalized, axis=0)

                # 표정 예측
                prediction = model.predict(face_expanded)
                emotion_label = np.argmax(prediction)
                emo_label_list.append(emotion_label)

                if emotion_label == 0:
                    temp = 'neutral'
                elif emotion_label == 1:
                    temp = 'happy'
                elif emotion_label == 2:
                    temp = 'embarrased'
                elif emotion_label == 3:
                    temp = 'unrest'

                # 예측 결과 표시
                # cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                # cv2.putText(frame, f'Emotion: {temp}', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

        # 프레임 저장
        # out.write(frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    # out.release()
    cv2.destroyAllWindows()

    # Good과 Bad 분류 개수 및 비율 계산
    good_count = sum(1 for label in emo_label_list if label in [0, 1])
    bad_count = sum(1 for label in emo_label_list if label in [2, 3])

    total_count = good_count + bad_count

    if total_count == 0:
        good_ratio = 0
        bad_ratio = 0
    else:
        good_ratio = round(good_count / total_count * 100) / 100
        bad_ratio = round(bad_count / total_count * 100) / 100
    ## 여기서 zerodivision 에러가 나오는데 그러면 good bad를 못잡았단건데 ㅈ댄거 아닌가..?
    # good_ratio = round(good_count / total_count * 100) / 100
    # bad_ratio = round(bad_count / total_count * 100) / 100

    # # 데이터 및 범주 설정
    # categories = ['','Good', '', 'Bad', '']
    # values = [0.1, good_ratio, 0.1, bad_ratio, 0.1]  # Good과 Bad의 비율 (예: 각각의 비율 값)

    # # figure와 axes 객체 생성
    # fig, ax = plt.subplots()

    # # 막대를 둥근 모서리로 가로로 그리기
    # for i, (category, value) in enumerate(zip(categories, values)):
    #     y = i - 0.4  # 막대의 세로 위치 (중앙 정렬)
    #     height = 0.8  # 막대의 높이
    #     width = value  # 막대의 너비 (비율 값)

    #     # 둥근 모서리 설정
    #     rounding_size = width * 0.03  # rounding 크기 조절 (필요에 따라 값 조절 가능)

    #     # 막대 그리기
    #     color = '#9137fc' if category == 'Good' else '#9137fc'
    #     rect = FancyBboxPatch(
    #         (0, y), width, height,
    #         boxstyle=f"round,pad=0,rounding_size={rounding_size}",
    #         edgecolor="white", facecolor=color, zorder=3
    #     )
    #     ax.add_patch(rect)

    # # 레이블 및 제목 설정
    # ax.set_yticks(range(len(categories)))
    # ax.set_yticklabels(categories)
    # plt.xlabel('비율 (%)')
    # plt.title('Good vs Bad 감정 비율')

    # # 저장 경로 설정 및 저장
    # video_name = video.split('/')[-1].split('.')[0]
    # expression_path = 'C:/Users/USER/Desktop/API/API/backend/media/graph/expression'
    # expression_graph_path = f'{expression_path}/{video_name}'
    # plt.savefig(expression_graph_path, bbox_inches='tight')
    # plt.close()

    # 데이터 및 범주 설정
    categories = ['Good', 'Bad']
    values = [good_ratio, bad_ratio]  # Good과 Bad의 비율 (예: 각각의 비율 값)

    # figure와 axes 객체 생성
    fig, ax = plt.subplots()

    # 막대를 둥근 모서리로 가로로 그리기
    y_positions = []
    for i, (category, value) in enumerate(zip(categories, values)):
        y = i - 0.4  # 막대의 세로 위치 (중앙 정렬)
        y_positions.append(y + 0.25)  # y 위치에 막대 중심값 추가
        width = value  # 막대의 길이 (비율 값)

        # 둥근 모서리 설정
        rounding_size = width * 0.03  # rounding 크기 조절

        # 막대 그리기
        color = '#9137fc' if category == 'Good' else '#9137fc'
        rect = FancyBboxPatch(
            (0, y), width, 0.5,
            boxstyle=f"round,pad=0,rounding_size={rounding_size}",
            edgecolor="white", facecolor=color, zorder=3
        )
        ax.add_patch(rect)

    # y축 레이블을 막대 중앙에 설정
    ax.set_yticks(y_positions)
    ax.set_yticklabels(categories)
    # ax.set_yticklabels(categories, ha='center', va='center', fontsize=12, fontweight='bold', color='black')
    
    # 퍼센트 레이블을 각 막대 옆에 수동으로 추가
    for i, value in enumerate(values):
        y = y_positions[i]  # 각 막대의 중앙 y 위치
        ax.text(1.02, y, f'{int(value * 100)}%', ha='left', va='center', transform=ax.get_yaxis_transform())

        # 좌우 여백 추가
        ax.margins(y=0.1)  # y축에 여백 추가

    # 저장 경로 설정 및 저장
    video_name = video.split('/')[-1].split('.')[0]
    expression_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/expression'
    os.makedirs(expression_path, exist_ok=True)
    expression_graph_path = f'{expression_path}/{video_name}'
    expression_graph_image_path = f'graph/expression/{video_name}.png'
    plt.savefig(expression_graph_path, bbox_inches='tight')
    plt.close()

    return expression_graph_path + '.png', expression_graph_image_path, bad_count
