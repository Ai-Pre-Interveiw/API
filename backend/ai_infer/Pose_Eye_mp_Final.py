import mediapipe as mp # Import mediapipe
import cv2 # Import opencv
import csv
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline 
from sklearn.preprocessing import StandardScaler 
import sklearn
from sklearn.linear_model import LogisticRegression, RidgeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score # Accuracy metrics 
import pickle 
import time
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from scipy.stats import norm
import math
import time
import datetime


def mp_pose_eye_infer(video):
    global np  # np 모듈을 이 함수에서도 전역으로 선언
    video_name = video.split('/')[-1].split('.')[0]
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose
    mp_holistic = mp.solutions.holistic
    mp_drawing_styles = mp.solutions.drawing_styles
    mp_face_mesh = mp.solutions.face_mesh

    with open("C:/Users/USER/Desktop/pjt/API/backend/ai_infer/ai_models/body_language.pkl", 'rb') as f:
        model = pickle.load(f)

    # 선택한 이미지를 불러옵니다
    # overlay_image = cv2.imread('C:/Users/USER/Desktop/API/API/ai/eye_pose_detection/background.png', cv2.IMREAD_UNCHANGED)  # 이미지 파일 경로 지정

    # 눈 좌표 범위
    LEFT_EYE_INDEXES = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]
    RIGHT_EYE_INDEXES = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382]

    LEFT_IRIS_INDEXES = [469, 470, 471, 472]
    RIGHT_IRIS_INDEXES = [474, 475, 476, 477]

    cap = cv2.VideoCapture(video)

    def get_eye_region(landmarks, indexes, scale_x, scale_y):
        global np  # np 모듈을 이 함수에서도 전역으로 선언
        # 랜드마크 좌표를 사용하여 눈 영역 추출
        points = []
        for idx in indexes:
            x = int(landmarks[idx].x * frame.shape[1] * scale_x)
            y = int(landmarks[idx].y * frame.shape[0] * scale_y)
            points.append([x, y])
        return np.array(points, dtype=np.int32)

    def get_iris_center(landmarks, iris_indexes, scale_x, scale_y):
        global np  # np 모듈을 이 함수에서도 전역으로 선언
        # 홍채 중심 좌표 계산
        iris_points = np.array([[landmarks[idx].x * frame.shape[1] * scale_x, landmarks[idx].y * frame.shape[0] * scale_y] for idx in iris_indexes])
        iris_center = np.mean(iris_points, axis=0).astype(int)
        val_iris_center = np.mean(iris_points, axis=0)
        return iris_center, val_iris_center
    
    def calculate_angle(a,b):
        global np  # np 모듈을 이 함수에서도 전역으로 선언
        a = np.array(a)
        b = np.array(b)

        radians = np.arctan2(b[1]-a[1], b[0]-a[0])
        angle = np.abs(radians*180.0/np.pi)
        return angle 

    # Curl counter variables
    warning = False
    pose_bad_count = 0
    pose_good_count = 0
    eye_bad_count = 0
    eye_good_count = 0

    # stretch_count = 0
    # stand_count = 0
    start = time.gmtime(time.time())  # 시작 시간 저장

    pose_frame_counter = 0
    eye_frame_counter = 0
    total_pose_bad_count = 0
    total_pose_good_count = 0
    avg_pose_bad_count_per_second = 0
    avg_pose_good_count_per_second = 0
    total_eye_bad_count = 0
    total_eye_good_count = 0
    avg_eye_bad_count_per_second = 0
    avg_eye_good_count_per_second = 0

    face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5)
    holistic = mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    # # Initiate holistic model
    # with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:

    left_iris_list = []
    right_iris_list = []
    # left_uclid_distance = []
    # right_uclid_distance = []
    uclid_distance = []
    angles = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # 거울모드
        frame = cv2.flip(frame, 1)

        # 원본 크기 저장
        original_height, original_width = frame.shape[:2]

        # 프레임 리사이즈
        resize_frame = cv2.resize(frame, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_LINEAR)

        # 리사이즈된 이미지의 크기
        resized_height, resized_width = resize_frame.shape[:2]

        # 리사이즈 비율 계산
        scale_x = resized_width / original_width
        scale_y = resized_height / original_height

        # Recolor Feed
        image = cv2.cvtColor(resize_frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False        
        
        # Make Detections
        results = holistic.process(image)
        
        # Recolor image back to BGR for rendering
        image.flags.writeable = True   
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        # 1. Draw face landmarks
        # mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_CONTOURS, 
        #                          mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1),
        #                          mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
        #                          )
        
        # 2. Right hand
        # mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
        #                          mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4),
        #                          mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
        #                          )

        # 3. Left Hand
        # mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
        #                          mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4),
        #                          mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
        #                          )

        # 4. Pose Detections
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS, 
                                mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4),
                                mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                )
        
        # 얼굴 랜드마크 그리기 및 눈동자 추출
        face_result = face_mesh.process(image)
        
        try:
            landmarks = results.pose_landmarks.landmark
            # Get coordinates
            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            
            # # Calculate angle
            angle = calculate_angle(left_shoulder, right_shoulder)
            angles.append(angle)
            first_angle = angles[0]
            # print(first_angle)
            # Curl counter logic
            temp_pose = ''
            if not first_angle-2 < angle and angle < first_angle+2:
                pose_bad_count += 1
                total_pose_bad_count += 1
                temp_pose = 'BAD' 
            else:
                pose_good_count += 1
                total_pose_good_count += 1
                temp_pose = 'GOOD'
            pose_frame_counter += 1

            if pose_frame_counter >= 30:
                avg_pose_bad_count_per_second = round(total_pose_bad_count / 30, 8)
                avg_pose_good_count_per_second = round(total_pose_good_count / 30, 8)

                # 변수 리셋
                pose_frame_counter = 0
                total_pose_bad_count = 0
                total_pose_good_count = 0
                


            # Extract Pose landmarks
            pose = results.pose_landmarks.landmark
            pose_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in pose]).flatten())
            
            # Extract Face landmarks
            face = results.face_landmarks.landmark
            face_row = list(np.array([[landmark.x, landmark.y, landmark.z, landmark.visibility] for landmark in face]).flatten())
            
            # Concate rows
            row = pose_row+face_row
            
            # Make Detections
            X = np.array([row])

            body_language_class = model.predict(X)[0]
            body_language_prob = model.predict_proba(X)[0]
            # Get status box
            cv2.putText(image, f'angle : {angle}', (10,25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,0), 1, cv2.LINE_AA)
            cv2.putText(image, f'good_pose_count : {avg_pose_good_count_per_second}', (10,65), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,0), 1, cv2.LINE_AA)
            cv2.putText(image, f'bad_pose_count : {avg_pose_bad_count_per_second}', (10,105), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,0), 1, cv2.LINE_AA)
            cv2.putText(image, f'Pose is good?: {temp_pose}', (10, 235), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 1, cv2.LINE_AA)
            
            #Time
            now = time.gmtime(time.time())
            
            cv2.putText(image, 'Time', 
                        (440,25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,0), 1, cv2.LINE_AA)
            seconds = 0
            minute = 0
            if now.tm_sec < start.tm_sec:
                seconds = 60 - start.tm_sec + now.tm_sec
            else:
                seconds = abs(now.tm_sec - start.tm_sec)

            cv2.putText(image, str(minute) +' : '+ str(seconds),
                        (500,25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,0,0), 1, cv2.LINE_AA)
            
            # 얼굴 랜드마크가 있으면 처리
            if face_result.multi_face_landmarks:
                for face_landmark in face_result.multi_face_landmarks:
                    
                    # 왼쪽 눈과 오른쪽 눈 영역 추출 (크기 비율 적용)
                    left_eye = get_eye_region(face_landmark.landmark, LEFT_EYE_INDEXES, scale_x, scale_y)
                    right_eye = get_eye_region(face_landmark.landmark, RIGHT_EYE_INDEXES, scale_x, scale_y)

                    # 눈 영역에 다각형 그리기
                    cv2.polylines(image, [left_eye], isClosed=True, color=(0, 255, 0), thickness=1)
                    cv2.polylines(image, [right_eye], isClosed=True, color=(0, 255, 0), thickness=1)

                    # 왼쪽 및 오른쪽 홍채 중심 추출
                    left_iris_center, val_left_iris_center = get_iris_center(face_landmark.landmark, LEFT_IRIS_INDEXES, scale_x, scale_y)
                    right_iris_center, val_right_iris_center = get_iris_center(face_landmark.landmark, RIGHT_IRIS_INDEXES, scale_x, scale_y)
                    left_iris_list.append(val_left_iris_center)
                    right_iris_list.append(val_right_iris_center)
                    # left_uclid_distance.append(np.linalg.norm(left_eye - val_left_iris_center))
                    # right_uclid_distance.append(np.linalg.norm(right_eye - val_right_iris_center))

                    temp = (np.linalg.norm(left_eye - val_left_iris_center) + np.linalg.norm(right_eye - val_right_iris_center)) / 2

                    uclid_distance.append(temp)
                    # 홍채 중심에 원 그리기
                    cv2.circle(image, tuple(left_iris_center), 3, (255, 0, 0), -1)
                    cv2.circle(image, tuple(right_iris_center), 3, (255, 0, 0), -1)

                    # 왼쪽 눈동자 중심 계산
                    left_eye_center = np.mean(left_eye, axis=0)
                    right_eye_center = np.mean(right_eye, axis=0)

                    # 눈동자 중심에 원 그리기
                    # cv2.circle(image, tuple(left_eye_center), 3, (0, 255, 0), -1)
                    # cv2.circle(image, tuple(right_eye_center), 3, (0, 255, 0), -1)

                    left_eye_direction = ''
                    right_eye_direction = ''

                    if -3 < left_eye_center[0] - val_left_iris_center[0] <= 2 and 0.3 <= left_eye_center[1] - val_left_iris_center[1] <= 1.7:
                        left_eye_direction = 'center'
                    elif abs(val_left_iris_center[0] - left_eye_center[0]) <= 3 and  left_eye_center[1] - val_left_iris_center[1] > 1.7:
                        left_eye_direction = 'top'
                    elif abs(val_left_iris_center[0] - left_eye_center[0]) <= 3 and  left_eye_center[1] - val_left_iris_center[1] < 0.3:
                        left_eye_direction = 'bottom'
                    elif left_eye_center[0] - val_left_iris_center[0] > 2:
                        left_eye_direction = 'left'
                    elif left_eye_center[0] - val_left_iris_center[0] < -3:
                        left_eye_direction = 'right'

                    if  -2.5 <= right_eye_center[0] - val_right_iris_center[0] <= 2.5 and 0.3 <= right_eye_center[1] - val_right_iris_center[1] <= 1.7:
                        right_eye_direction = 'center'
                    elif abs(val_right_iris_center[0] - right_eye_center[0]) <= 3 and right_eye_center[1] - val_right_iris_center[1] > 1.7:
                        right_eye_direction = 'top'
                    elif abs(val_right_iris_center[0] - right_eye_center[0]) <= 3 and right_eye_center[1] - val_right_iris_center[1] < 0.3:
                        right_eye_direction = 'bottom'
                    elif right_eye_center[0] - val_right_iris_center[0] > 2.5:
                        right_eye_direction = 'left'
                    elif right_eye_center[0] - val_right_iris_center[0] < -2.5:
                        right_eye_direction = 'right'

                    eye_temp = ''
                    
                    if left_eye_direction == right_eye_direction and left_eye_direction != 'center':
                        eye_bad_count += 1
                        total_eye_bad_count += 1
                        # good_count = 0
                        eye_temp='BAD'
                    else:
                        eye_good_count += 1
                        total_eye_good_count += 1
                        eye_temp='GOOD'

                    eye_frame_counter += 1

                    if eye_frame_counter >= 30:
                        avg_eye_bad_count_per_second = round(total_eye_bad_count / 30, 8)
                        avg_eye_good_count_per_second = round(total_eye_good_count / 30, 8)

                        # 변수 리셋
                        eye_frame_counter = 0
                        total_eye_bad_count = 0
                        total_eye_good_count = 0
                    

                    # 홍채 좌표 출력
                    cv2.putText(image, f'L Iris: {val_left_iris_center}', (440, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, f'R Iris: {val_right_iris_center}', (440, 145), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    # 눈동자 중심 좌표 출력
                    cv2.putText(image, f'L eye: {left_eye_center}', (440, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, f'R eye: {right_eye_center}', (440, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    # 눈 방향
                    cv2.putText(image, f'good eye count: {avg_eye_good_count_per_second}', (10, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    cv2.putText(image, f'bad eye count: {avg_eye_bad_count_per_second}', (10, 145), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    # 시선 벗어났는지
                    cv2.putText(image, f'Eye is good?: {eye_temp}', (620, 235), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 1, cv2.LINE_AA)
                    # cv2.putText(image, f'L eye direction: {avg_eye_bad_count_per_second}', (10, 145), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    # cv2.putText(image, f'R eye direction: {avg_eye_good_count_per_second}', (10, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 1, cv2.LINE_AA)
                    
        except Exception as e:
            print(e)
        
        # # 원하는 이미지 크기와 위치 설정
        # overlay_width = 600  # 이미지의 가로 크기
        # overlay_height = 600  # 이미지의 세로 크기
        # overlay_position = (180, 120)  # 이미지가 배치될 왼쪽 위 좌표 (x, y)

        # # 선택한 이미지를 리사이즈

        # overlay_resized = cv2.resize(overlay_image, (overlay_width, overlay_height))
        
    
        # # ROI(Region of Interest)를 설정하여 이미지를 해당 위치에 삽입
        # x, y = overlay_position
        # roi = image[y:y+overlay_height, x:x+overlay_width]
        
        # # 알파 채널 분리
        # if overlay_resized.shape[2] == 4:  # 이미지가 알파 채널을 가지고 있는지 확인
        #     overlay_img = overlay_resized[:, :, :3]  # RGB 채널
        #     mask = overlay_resized[:, :, 3]  # 알파 채널

        #     # 알파 채널을 [0, 1] 범위로 정규화
        #     mask = mask / 255.0

        #     # 불투명도 조정 (원하는 값으로 alpha 설정)
        #     alpha = 0.4  # 불투명도: 1.0은 완전 불투명, 0.0은 완전 투명

        #     # 배경에 원래 프레임의 해당 부분 복사
        #     background = (1.0 - mask * alpha)[:, :, np.newaxis] * roi
        #     # 전경에 overlay 이미지 복사
        #     foreground = (mask * alpha)[:, :, np.newaxis] * overlay_img

        #     # 배경과 전경을 더해 합성
        #     blended = background + foreground

        #     # 합성된 이미지를 원본 프레임에 적용
        #     image[y:y+overlay_height, x:x+overlay_width] = blended
        
        # 결과 이미지 출력
        # cv2.imshow('Camera Feed with Transparent Image Overlay', image)
        # q를 눌러서 종료
        if cv2.waitKey(10) & 0xFF == 27:
            break
        
        

    cap.release()
    cv2.destroyAllWindows()

    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import numpy as np
    from matplotlib.patches import FancyBboxPatch
    def linear_function(x):
        # 두 점 (800, 0.1)과 (450, 0.3)을 기준으로 기울기와 절편을 구함
        x1, y1 = 800, 0.1
        x2, y2 = 450, 0.3
        
        # 기울기 계산
        a = (y2 - y1) / (x2 - x1)
        
        # 절편 계산
        b = y1 - a * x1
        
        # 선형 함수 생성
        return a * x + b

    # 함수 사용 예시
    # print(linear_function(500))  # 대략 0.1
    # print(linear_function(500))  # 대략 0.3

    

    ## pose plot
    # print(angles)
    pose_data = np.array(angles)

    pose_counts, pose_bins = np.histogram(pose_data, bins=20)
    plt.figure(figsize=(8, 5))
    ax = plt.gca()

    for i in range(len(pose_bins) - 1):
        if pose_counts[i] != 0:
            x = pose_bins[i]

            width = pose_bins[i + 1] - pose_bins[i]
            
            height = pose_counts[i]

            pose_rounding_size = height * 0.000125

            rect_pose = FancyBboxPatch((x, 0), width, height,
                                boxstyle=f"round,pad=0,rounding_size={pose_rounding_size}",
                                edgecolor="white", facecolor="#9137fc", zorder=5)
            ax.add_patch(rect_pose)

    # 축 범위 설정
    ax.set_xlim(pose_bins[0], pose_bins[-1])
    ax.set_ylim(0, max(pose_counts) + 2)

    # 격자 다루기
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.grid(False, axis='x')

    # 축 및 제목 설정
    # plt.xlabel('Value')
    # plt.ylabel('Frequency')
    # plt.title('pose_normal_distribution')
    
    # print(video_name)
    # print(first_angle)
    pose_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/posture'
    os.makedirs(pose_path, exist_ok=True)
    # print(video_name)
    pose_graph_path =f'{pose_path}/{video_name}'
    # print(pose_graph_path, '포즈 그래프 패스')
    plt.savefig(pose_graph_path, bbox_inches='tight')
    pose_graph_image_path = f'graph/posture/{video_name}'
    # plt.show()
    plt.close()


    # 데이터 불러오기
    data = np.array(uclid_distance)
    mean = np.mean(data)
    std_dev = np.std(data)

    # 히스토그램 데이터 계산
    eye_counts, eye_bins = np.histogram(data, bins=20)

    # 히스토그램 플롯 설정
    plt.figure(figsize=(8, 5))
    ax = plt.gca()

    # 격자 다루기
    ax.grid(zorder=0)
    plt.grid(axis='y', linestyle='--', alpha=0.5)
    plt.grid(False, axis='x')

    # 각 막대를 둥근 모서리로 그리기
    for i in range(len(eye_bins) - 1):
        if eye_counts[i] != 0:
            x = eye_bins[i]

            width = eye_bins[i + 1] - eye_bins[i]
            
            height = eye_counts[i]

            eye_rounding_size = height * 0.003

            rect = FancyBboxPatch((x, 0), width, height,
                                boxstyle=f"round,pad=0,rounding_size={eye_rounding_size}",
                                edgecolor="white", facecolor="#9137fc", zorder=7)
            ax.add_patch(rect)

    # # 정규분포 곡선 계산 
    # xmin, xmax = plt.xlim()
    # x = np.linspace(xmin, xmax, 100)
    # p = norm.pdf(x, mean, std_dev)
    # plt.plot(x, p, 'k', linewidth=2, label='Normal Distribution')

    # 축 범위 설정
    ax.set_xlim(eye_bins[0], eye_bins[-1])
    ax.set_ylim(0, max(eye_counts) + 2)

    # 축 및 제목 설정
    # plt.xlabel('Value')
    # plt.ylabel('Frequency')
    # plt.title('eye_normal_distribution')
    # plt.show()
    eye_path = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/gaze'
    os.makedirs(eye_path, exist_ok=True)
    eye_graph_path = f'{eye_path}/{video_name}'
    # print(eye_graph_path)
    plt.savefig(eye_graph_path, bbox_inches='tight')
    plt.close()
    eye_graph_image_path = f'graph/gaze/{video_name}'
    
    return eye_graph_path + '.png', pose_graph_path + '.png', eye_graph_image_path + '.png', pose_graph_image_path + '.png'