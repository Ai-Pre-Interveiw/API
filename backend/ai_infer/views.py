from django.shortcuts import render
from django.http import JsonResponse
from Pose_Eye_mp_Final import mp_pose_eye_infer
from emotion_4_class_recognition import face_recognition
from voice_algolithm import extract_audio_from_video, VocalTremorAnalyzer, plot_tension_distribution

import numpy as np
import librosa
import scipy.signal
from scipy.stats import entropy
import pandas as pd
import moviepy.editor as mvp
import os


def process_all_videos():
    video_folder = 'C:/Users/USER/Desktop/API/API/backend/media/interview_video_test'
    compare_folder = 'C:/Users/USER/Desktop/API/API/backend/media/graph/gaze'
    wav_folder = 'C:/Users/USER/Desktop/API/API/backend/media/interview_wavs'
    wav_plt_folder = 'C:/Users/USER/Desktop/API/API/backend/media/graph/voice'
    processed_videos = []

    # 비디오 폴더 내 모든 파일에 대해 처리
    for video_file in os.listdir(video_folder):
        if video_file.endswith(('.mp4', '.avi', '.webm')):  # 필요한 파일 확장자 필터링
            video_path = f"{video_folder}/{video_file}"
            compare_path = f"{compare_folder}/{video_file}"

            # 결과 폴더에 같은 이름의 파일이 있는지 확인
            if not os.path.exists(compare_path):  # 파일이 없을 경우에만 처리
                extract_audio_from_video(video_path, wav_folder)
                mp_pose_eye_infer(video_path)
                processed_videos.append(video_file)  # 처리된 파일 이름 저장

    # 음성 감정 분석
    voice_emotion = VocalTremorAnalyzer()
    for idx, wav_file in enumerate(os.listdir(wav_folder)):
        # 단일 wav 파일을 analyze_wav_files에 리스트 형태로 전달
        wav_path = f"{wav_folder}/{wav_file}"
        voice_result = voice_emotion.analyze_wav_files([wav_path])  # wav_path를 리스트로 형 변환 

        # voice_result에서 필요한 메트릭 값 추출 
        freq_std = voice_result.get('freq_std')
        freq_variation = voice_result.get('freq_variation')
        modulation_index = voice_result.get('modulation_index')
        entropy_std = voice_result.get('entropy_std')
        entropy_rate = voice_result.get('entropy_rate')

        # plot_custom_distribution 호출
        metrics = [freq_std, freq_variation, modulation_index, entropy_std, entropy_rate]
        metric_names = ["Frequency Std", "Frequency Variation", "Modulation Index", "Entropy Std", "Entropy Rate"]
        plot_tension_distribution(metrics, metric_names, output_folder=wav_plt_folder, video=processed_videos[idx])

    # return JsonResponse({
    #     'message': 'Processing completed.',
    #     'processed_videos': processed_videos  # 처리된 파일 목록 반환
    # })


process_all_videos()
