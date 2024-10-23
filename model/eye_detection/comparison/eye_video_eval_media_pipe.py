import mediapipe as mp
import cv2
import numpy as np
from tqdm import tqdm

# 눈 좌표 범위
LEFT_EYE_INDEXES = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7]
RIGHT_EYE_INDEXES = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382]

LEFT_IRIS_INDEXES = [469, 470, 471, 472]
RIGHT_IRIS_INDEXES = [474, 475, 476, 477]


def get_eye_region(landmarks, indexes, image):
    # 랜드마크 좌표를 사용하여 눈 영역 추출
    points = []
    for idx in indexes:
        x = int(landmarks[idx].x * image.shape[1])
        y = int(landmarks[idx].y * image.shape[0])
        points.append([x, y])
    return np.array(points, dtype=np.int32)

def get_iris_center(landmarks, iris_indexes, image):
    # 홍채 중심 좌표 계산
    iris_points = np.array([[landmarks[idx].x * image.shape[1], landmarks[idx].y * image.shape[0]] for idx in iris_indexes])
    iris_center = np.mean(iris_points, axis=0).astype(int)
    val_iris_center = np.mean(iris_points, axis=0)
    return iris_center, val_iris_center

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5)

video_path = '../yolo_test/more_video/카메라 2024-10-22 12-35-07 (online-video-cutter.com).mp4'
cap = cv2.VideoCapture(video_path)

# 비디오 저장을 위한 설정
fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # 코덱 설정
out = cv2.VideoWriter('output_video_mediapipe_8.mp4', fourcc, 20.0, (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))

while True:
    ret, image = cap.read()
    if not ret == True:
        break

    eye_result = []
    eye_direction_list = []

    # image = cv2.imread(img)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    result = face_mesh.process(image_rgb)

    if not result.multi_face_landmarks:
        # print(f'No pose detected in {img_path, i}')
        eye_result.append([])
        eye_direction_list.append([])
        continue

    for face_landmark in result.multi_face_landmarks:
        
        # 왼쪽 눈과 오른쪽 눈 영역 추출 (크기 비율 적용)
        left_eye = get_eye_region(face_landmark.landmark, LEFT_EYE_INDEXES, image)
        right_eye = get_eye_region(face_landmark.landmark, RIGHT_EYE_INDEXES, image)

        # 눈 영역에 다각형 그리기
        cv2.polylines(image, [left_eye], isClosed=True, color=(255, 255, 255), thickness=1)
        cv2.polylines(image, [right_eye], isClosed=True, color=(255, 255, 255), thickness=1)

        # 왼쪽 및 오른쪽 홍채 중심 추출
        left_iris_center, val_left_iris_center = get_iris_center(face_landmark.landmark, LEFT_IRIS_INDEXES, image)
        right_iris_center, val_right_iris_center = get_iris_center(face_landmark.landmark, RIGHT_IRIS_INDEXES, image)
        # left_iris_list.append(val_left_iris_center)
        # right_iris_list.append(val_right_iris_center)
        # left_uclid_distance.append(np.linalg.norm(left_eye - val_left_iris_center))
        # right_uclid_distance.append(np.linalg.norm(right_eye - val_right_iris_center))
        # 홍채 중심에 원 그리기
        cv2.circle(image, tuple(left_iris_center), 8, (255, 255, 255), thickness=1)
        cv2.circle(image, tuple(right_iris_center), 8, (255, 255, 255), thickness=1)
        
        # 왼쪽 눈동자 중심 계산
        left_eye_center = np.mean(left_eye, axis=0)
        right_eye_center = np.mean(right_eye, axis=0)
        
        eye_result.append([left_eye, left_eye_center, left_iris_center, right_eye, right_eye_center, right_iris_center])
        
        left_eye_direction = ''
        right_eye_direction = ''

        if  abs(left_eye_center[0] - val_left_iris_center[0]) <= 1 and abs(left_eye_center[1] - val_left_iris_center[1]) <= 1:
            left_eye_direction = 'center'
        elif abs(val_left_iris_center[0] - left_eye_center[0]) <= 1 and  left_eye_center[1] - val_left_iris_center[1] > 1:
            left_eye_direction = 'top'
        elif abs(val_left_iris_center[0] - left_eye_center[0]) <= 1 and  left_eye_center[1] - val_left_iris_center[1] < 1:
            left_eye_direction = 'bottom'
        elif left_eye_center[0] - val_left_iris_center[0] > 1:
            left_eye_direction = 'left'
        elif left_eye_center[0] - val_left_iris_center[0] < -1:
            left_eye_direction = 'right'

        if  abs(right_eye_center[0] - val_right_iris_center[0]) <= 1 and abs(right_eye_center[1] - val_right_iris_center[1]) <= 1:
            right_eye_direction = 'center'
        elif abs(val_right_iris_center[0] - right_eye_center[0]) <= 1 and right_eye_center[1] - val_right_iris_center[1] > 1:
            right_eye_direction = 'top'
        elif abs(val_right_iris_center[0] - right_eye_center[0]) <= 1 and right_eye_center[1] - val_right_iris_center[1] < 1:
            right_eye_direction = 'bottom'
        elif right_eye_center[0] - val_right_iris_center[0] > 1:
            right_eye_direction = 'left'
        elif right_eye_center[0] - val_right_iris_center[0] < -1:
            right_eye_direction = 'right'
        
        eye_direction_list.append([left_eye_direction, right_eye_direction])

    cv2.imshow('img', image)
    out.write(image)

    if cv2.waitKey(10) & 0xFF == 27:
        break

cap.release()
out.release()