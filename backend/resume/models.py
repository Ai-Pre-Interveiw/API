# resume/models.py
from django.db import models
from accounts.models import CustomUser  # CustomUser를 임포트하여 외래 키로 사용

class Resume(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='resumes')
    file_path = models.CharField(max_length=512)  # 파일 경로를 문자열로 저장
    created_at = models.DateTimeField(auto_now_add=True)  # 등록 시간

    def __str__(self):
        return f"{self.user.email} - Resume ({self.created_at})"

# 질문 모델 추가
class Question(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='questions')
    content = models.TextField()  # 질문 내용을 저장하는 필드
    created_at = models.DateTimeField(auto_now_add=True)  # 질문 생성 시간

    def __str__(self):
        return f"Question for {self.resume.user.email} - {self.created_at}"
