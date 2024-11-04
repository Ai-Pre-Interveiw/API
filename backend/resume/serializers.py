# resume/serializers.py
from rest_framework import serializers
from .models import Resume  # Resume 모델을 새 위치에서 가져옴

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['file_path']  # 이력서 파일 경로만 입력받기
