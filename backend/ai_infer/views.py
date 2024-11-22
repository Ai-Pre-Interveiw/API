from django.shortcuts import render
from django.http import JsonResponse
from ai_infer.Pose_Eye_mp_Final import mp_pose_eye_infer
from ai_infer.emotion_4_class_recognition import face_recognition
from ai_infer.voice_algolithm import extract_audio_from_video, plot_tension_distribution_line, process_single_file
from ai_infer.STT_infer import stt_result
from ai_infer.question_result import search_and_generate_comment
from ai_infer.sketch_synthesis import sketch_synthesis
from django.core.files import File
from resume.models import InterviewResult, Interview, Question
import numpy as np
import librosa
import scipy.signal
from scipy.stats import entropy
import pandas as pd
import moviepy.editor as mvp
import os
import time
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.conf import settings
import json



# def inference_eye_pose(request):
#     video_folder = '../media/interview_video_test/'
#     for video_file in os.listdir(video_folder):
#         if video_file.endswith(('.mp4', '.avi', 'webm')):
#             video_path = f'{video_folder}/{video_file}'
#             eye_graph_image_path, pose_graph_image_path = mp_pose_eye_infer(video_path)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def inference_eye_pose(request, interview_id):
    video_folder = f'C:/Users/USER/Desktop/pjt/API/backend/media/interview_videos/{interview_id}'  # 특정 인터뷰 ID 폴더 경로
    wav_folder = f'C:/Users/USER/Desktop/pjt/API/backend/media/interview_wavs/{interview_id}'
    anxiety_folder = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/anxiety'
    voice_plt_folder = 'C:/Users/USER/Desktop/pjt/API/backend/media/graph/voice'
    processed_videos = []
    standard_angle = 0
    standard_eye = 0
    standard_emotion = 0
    emotion_labels = []

    eye_graph_path = ''
    pose_graph_path= ''
    eye_graph_image_path = ''
    pose_graph_image_path = ''

    eye_synthesis = []
    pose_synthesis = []
    exp_synthesis = []

    print(f"Looking for videos in folder: {video_folder}")

    # 해당 인터뷰 ID 폴더 내의 파일을 처리
    if os.path.isdir(video_folder):  # 폴더가 존재하는지 확인
        for video_file in os.listdir(video_folder):
            print(video_file)
            if video_file.endswith(('.mp4', '.avi', '.webm')):
                # print(f'비디오 파일이요 : {video_file}')  # 필요한 파일 확장자 필터링
                # video_path = os.path.join(video_folder, video_file)
                video_path = video_folder + '/' + video_file
                # print(f'비디오 경로요 : {video_path}')
                
                try:
                    # 파일명에서 질문 ID를 추출
                    file_name_parts = video_file.split('_')[-1]
                    question_id = int(file_name_parts.split('.')[0])  # 질문 ID 추출

                    # InterviewResult 객체 찾기
                    interview = Interview.objects.get(id=interview_id)
                    question = Question.objects.get(id=question_id)
                    interview_result = InterviewResult.objects.get(interview=interview, question=question)

                    print(standard_emotion)
                    # mp_pose_eye_infer 함수로 그래프 이미지 경로 생성
                    if question_id % 8 == 0:
                        standard_angle, standard_eye = mp_pose_eye_infer(video_path, question_id, standard_angle, standard_eye)
                        standard_emotion = face_recognition(video_path, question_id, standard_emotion)
                    else:
                        eye_graph_path, pose_graph_path, eye_graph_image_path, pose_graph_image_path, eye_std, pose_std = mp_pose_eye_infer(video_path, question_id, standard_angle, standard_eye)
                        exp_graph_output_path, exp_graph_path, bad_emotion, emo_label = face_recognition(video_path, question_id, standard_emotion)
                        eye_synthesis.append(eye_std)
                        pose_synthesis.append(pose_std)
                        exp_synthesis.append(bad_emotion)
                        emotion_labels.append(emo_label)
                    

                    # 파일이 생성된 경우에만 업데이트
                    if os.path.exists(eye_graph_path) and os.path.exists(pose_graph_path) and os.path.exists(exp_graph_output_path) and question_id % 8 != 0:
                        
                        # FileField에 경로만 할당
                        interview_result.gaze_distribution_path = eye_graph_image_path
                        interview_result.posture_distribution_path = pose_graph_image_path
                        interview_result.expression_distribution_path = exp_graph_path
                        # 모델 저장
                        interview_result.save()
                        
                        # with open(eye_graph_path, 'rb') as eye_graph_image_file, open(pose_graph_path, 'rb') as pose_graph_image_file:
                        #     interview_result.gaze_distribution_path.save(
                        #         os.path.basename(eye_graph_image_path), File(eye_graph_image_file), save=True
                        #     )
                        #     print(f"Saved gaze_distribution_path: {interview_result.gaze_distribution_path}")

                        #     interview_result.posture_distribution_path.save(
                        #         os.path.basename(pose_graph_image_path), File(pose_graph_image_file), save=True
                        #     )
                        #     print(f"Saved posture_distribution_path: {interview_result.posture_distribution_path}")

                    else:
                        print(f"Timeout: Unable to find {eye_graph_path} or {pose_graph_path} after waiting.")

                except (Interview.DoesNotExist, Question.DoesNotExist, InterviewResult.DoesNotExist) as e:
                    print(f"Error processing {video_file}: {str(e)}")
                    continue

                extract_audio_from_video(video_path, wav_folder)
                print('일단 wav는 나오고')

    # 음성 감정 분석
    for idx, wav_file in enumerate(os.listdir(wav_folder)):
        wav_path = f"{wav_folder}/{wav_file}"
        print(len(emotion_labels), idx)
        print(emotion_labels)
        print(emotion_labels[idx - 1])
        # `analyze_wav_files`의 첫 번째 결과를 가져와 각 메트릭 값을 추출
        voice_result = process_single_file(wav_path)

        # voice_result에서 각 메트릭 추출
        jitter = voice_result['Jitter']

        # 각 메트릭에 대해 그래프 생성
        # metrics = [freq_std, freq_variation, modulation_index, entropy_std, entropy_rate]
        # metric_names = ["Frequency Std", "Frequency Variation", "Modulation Index", "Entropy Std", "Entropy Rate"]
        line_metrics = [jitter]
        line_metric_names = ['jitter']
        # plot_tension_distribution(metrics, metric_names, output_folder=wav_plt_folder, video=wav_file)
        anxiety_graph_output_path, voice_graph_output_path, anxiety_graph_path, voice_graph_path, voice_top_indices = plot_tension_distribution_line(line_metrics, line_metric_names, output_folder=anxiety_folder, video=wav_file, emo_label=emotion_labels[idx - 1])
        print('긴장도그래프 저장 경로', anxiety_graph_output_path)
        print('목소리그래프 저장 경로', voice_graph_output_path)
        print('긴장도 db 경로', anxiety_graph_path)
        print('목소리 db 경로', voice_graph_path)
        text_result = stt_result(wav_path)

        try:
            # 파일명에서 질문 ID를 추출
            file_name_parts = wav_file.split('_')[-1]
            question_id = int(file_name_parts.split('.')[0])  # 질문 ID 추출

            # InterviewResult 객체 찾기
            interview = Interview.objects.get(id=interview_id)
            question = Question.objects.get(id=question_id)
            interview_result = InterviewResult.objects.get(interview=interview, question=question)

            question_content = question.content
            print(f'질문: {question_content}')
            print(f'답변 리스트: {text_result}')
            tail_question = ''
            if question_content != 'test':
                tail_question, generated_comment = search_and_generate_comment(question=question_content, answer=text_result)

            # 파일이 생성된 경우에만 업데이트
            if os.path.exists(anxiety_graph_output_path) and os.path.exists(voice_graph_output_path) and question_id % 8 != 0:
                # FileField에 경로만 할당
                interview_result.anxiety_graph_path = anxiety_graph_path
                interview_result.voice_distribution_path = voice_graph_path
                interview_result.follow_up_questions = tail_question
                interview_result.answer_text = text_result
                interview_result.voice_top_indices = voice_top_indices
                interview_result.filler_word_positions = generated_comment
            # 모델 저장
            interview_result.save()

            processed_videos.append(video_file)

        except (Interview.DoesNotExist, Question.DoesNotExist, InterviewResult.DoesNotExist) as e:
            print('파일 저장 안된다고~~~~')
            print(f"Error processing {video_file}: {str(e)}")
            continue

    eye_syn_graph_path, eye_syn_graph_db_path, eye_top_indices = sketch_synthesis(eye_synthesis[::-1], interview_id, 'gaze')
    pose_syn_graph_path, pose_syn_graph_db_path, pose_top_indices = sketch_synthesis(pose_synthesis[::-1], interview_id, 'pose')
    exp_syn_graph_path, exp_syn_graph_db_path, exp_top_indices = sketch_synthesis(exp_synthesis[::-1], interview_id, 'exp')

    try:

        # InterviewResult 객체 찾기
        interview = Interview.objects.get(id=interview_id)
        question = Question.objects.get(id=interview_id * 8)
        interview_result = InterviewResult.objects.get(interview=interview, question=question)

        # 파일이 생성된 경우에만 업데이트
        if os.path.exists(eye_syn_graph_path) and os.path.exists(pose_syn_graph_path) and os.path.exists(exp_syn_graph_path):
            # FileField에 경로만 할당
            interview_result.gaze_distribution_path = eye_syn_graph_db_path
            interview_result.posture_distribution_path = pose_syn_graph_db_path
            interview_result.expression_distribution_path = exp_syn_graph_db_path
            interview_result.filler_word_positions = eye_top_indices
            interview_result.follow_up_questions = pose_top_indices
            interview_result.answer_text = exp_top_indices

        # 모델 저장
        interview_result.save()

        processed_videos.append(video_file)

    except (Interview.DoesNotExist, Question.DoesNotExist, InterviewResult.DoesNotExist) as e:
        print('파일 저장 안된다고~~~~')
        print(f"Error processing {video_file}: {str(e)}")
    
    return JsonResponse({"processed_videos": processed_videos}, status=200)

# def process_all_videos():
#     video_folder = 'C:/Users/USER/Desktop/API/API/backend/media/interview_video_test'
#     compare_folder = 'C:/Users/USER/Desktop/API/API/backend/media/graph/gaze'
#     wav_folder = 'C:/Users/USER/Desktop/API/API/backend/media/interview_wavs'
#     wav_plt_folder = 'C:/Users/USER/Desktop/API/API/backend/media/graph/voice'
#     processed_videos = []

#     # # 비디오 폴더 내 모든 파일에 대해 처리
#     # for video_file in os.listdir(video_folder):
#     #     if video_file.endswith(('.mp4', '.avi', '.webm')):  # 필요한 파일 확장자 필터링
#     #         video_path = f"{video_folder}/{video_file}"
#     #         compare_path = f"{compare_folder}/{video_file}"

#     #         # 결과 폴더에 같은 이름의 파일이 있는지 확인
#     #         if not os.path.exists(compare_path):  # 파일이 없을 경우에만 처리
#     #             extract_audio_from_video(video_path, wav_folder)
#     #             mp_pose_eye_infer(video_path)
#     #             processed_videos.append(video_file)  # 처리된 파일 이름 저장

#     # 음성 감정 분석
#     voice_emotion = VocalTremorAnalyzer()
#     for idx, wav_file in enumerate(os.listdir(wav_folder)):
#         wav_path = f"{wav_folder}/{wav_file}"
        
#         # `analyze_wav_files`의 첫 번째 결과를 가져와 각 메트릭 값을 추출
#         voice_result = voice_emotion.analyze_wav_files([wav_path])
        
#         # voice_result에서 각 메트릭 추출

#         freq_std = voice_result['freq_std']
#         freq_variation = voice_result['freq_variation']
#         modulation_index = voice_result['modulation_index']
#         entropy_std = voice_result['entropy_std']
#         entropy_rate = voice_result['entropy_rate']

        

#         # 각 메트릭에 대해 그래프 생성
#         metrics = [freq_std, freq_variation, modulation_index, entropy_std, entropy_rate]
#         metric_names = ["Frequency Std", "Frequency Variation", "Modulation Index", "Entropy Std", "Entropy Rate"]
#         line_metrics = [freq_std]
#         line_metric_names = ['Frequency Std']
#         plot_tension_distribution(metrics, metric_names, output_folder=wav_plt_folder, video=wav_file)
#         plot_tension_distribution_line(line_metrics, line_metric_names, output_folder=wav_plt_folder, video=wav_file)

    # return JsonResponse({
    #     'message': 'Processing completed.',
    #     'processed_videos': processed_videos  # 처리된 파일 목록 반환
    # })


# process_all_videos()


