# resume/models.py
from django.db import models
from accounts.models import CustomUser  # CustomUser를 임포트하여 외래 키로 사용

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

    def __str__(self):
        return f"Interview for {self.resume.user.email} at {self.position} on {self.scheduled_start} ({self.get_experience_level_display()}), {self.id}"

# 질문 모델 수정
class Question(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    content = models.TextField()  # 질문 내용을 저장하는 필드
    created_at = models.DateTimeField(auto_now_add=True)  # 질문 생성 시간

    def __str__(self):
        return f"Question for Interview ID {self.interview.id} - {self.created_at}"