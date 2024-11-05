# accounts/serializers.py
from rest_framework import serializers
from .models import Resume, Question, Interview

class ResumeGetSerializer(serializers.ModelSerializer):
    filePath = serializers.CharField(source="file.name")  # 파일 이름
    uploadTime = serializers.DateTimeField(source="created_at")  # 업로드 시간

    class Meta:
        model = Resume
        fields = ['id', 'filePath', 'uploadTime']  # 필요한 필드만 선택


class ResumeUploadSerializer(serializers.ModelSerializer):
    filePath = serializers.CharField(source="file.name", read_only=True)  # file 필드의 경로를 가져옴
    uploadTime = serializers.DateTimeField(source="created_at", read_only=True)  # 업로드 시간

    class Meta:
        model = Resume
        fields = ['file', 'filePath', 'uploadTime']  # 필요한 필드만 선택

    # file 필드가 없으면 유효성 검사 실패
    def validate_file(self, value):
        if not value:
            raise serializers.ValidationError("파일을 업로드해야 합니다.")
        return value
    
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['content']  # 필요한 필드를 지정


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['id', 'resume', 'scheduled_start', 'position', 'experience_level']  # 면접 생성에 필요한 필드들