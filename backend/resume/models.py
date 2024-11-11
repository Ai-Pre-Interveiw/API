# resume/models.py
from django.db import models
from accounts.models import CustomUser  # CustomUser를 임포트하여 외래 키로 사용
import os

class Resume(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="resume")
    file = models.FileField(upload_to="resume/")  # 파일이 저장될 경로 지정
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.file.name}"

    @property
    def filePath(self):
        return self.file.url  # file 필드의 URL 경로를 반환

# 면접 모델 수정: 면접 시작 시간, 지원 분야, 신입/경력 레벨 추가
class Interview(models.Model):
    EXPERIENCE_CHOICES = [
        ('entry', '신입'),
        ('experienced', '경력'),
    ]

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='interviews')
    scheduled_start = models.DateTimeField(auto_now_add=True)  # 면접 시작 시간
    position = models.CharField(max_length=100)  # 지원 분야
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)  # 신입/경력 선택
    isProcessing = models.BooleanField(default=False)
    isProcessed = models.BooleanField(default=False)

    def __str__(self):
        return f"Interview for {self.resume.user.email} at {self.position} on {self.scheduled_start} ({self.get_experience_level_display()}), {self.id}"

# 질문 모델 수정
class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    content = models.TextField()  # 질문 내용을 저장하는 필드
    created_at = models.DateTimeField(auto_now_add=True)  # 질문 생성 시간

    def __str__(self):
        return f"Question for Interview ID {self.interview.id} - {self.created_at}"


def interview_video_upload_path(instance, filename):
    # 인터뷰 ID 기반 폴더 경로 지정
    return os.path.join(f"interview_videos/{instance.interview.id}", filename)

class InterviewResult(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='results')  # 면접과 연결
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='results')  # 질문과 연결
    
    # 파일 경로 및 그래프 경로들
    video_path = models.FileField(upload_to=interview_video_upload_path, blank=True, null=True)  # 질문별 녹화 파일 경로
    anxiety_graph_path = models.FileField(upload_to="graph/anxiety/", blank=True, null=True)  # 긴장도 그래프 이미지 경로
    gaze_distribution_path = models.FileField(upload_to="graph/gaze/", blank=True, null=True)  # 시선 분포 그래프 이미지 경로
    posture_distribution_path = models.FileField(upload_to="graph/posture/", blank=True, null=True)  # 자세 분포 그래프 이미지 경로
    voice_distribution_path = models.FileField(upload_to="graph/voice/", blank=True, null=True)  # 목소리 분포 그래프 이미지 경로
    expression_distribution_path = models.FileField(upload_to="graph/expression/", blank=True, null=True)  # 표정 분포 그래프 이미지 경로

    # 추가 분석 데이터
    filler_word_positions = models.JSONField(default=list, blank=True)  # 미사여구 위치 리스트
    follow_up_questions = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    updated_at = models.DateTimeField(auto_now=True)  # 업데이트 시간

    def __str__(self):
        return f"Result for Interview ID {self.interview.id} - Question ID {self.question.id}"