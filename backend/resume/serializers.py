# accounts/serializers.py
from rest_framework import serializers
from .models import Resume, Question, Interview, InterviewResult

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
        fields = ['content', 'audio_file']  # 필요한 필드를 지정


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = ['id', 'resume', 'scheduled_start', 'position', 'experience_level', 'isProcessing', 'isProcessed']  # 면접 생성에 필요한 필드들

class InterviewResultSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())  # question ID만 포함
    question_detail = QuestionSerializer(source='question', read_only=True)  # question의 상세 정보 포함

    class Meta:
        model = InterviewResult
        fields = ['id',
                  'video_path',
                  'question',
                  'question_detail',
                  'created_at', 
                  'updated_at',
                  'interview',
                  'anxiety_graph_path',
                  'gaze_distribution_path',
                  'posture_distribution_path',
                  'voice_distribution_path',
                  'expression_distribution_path',
                  'answer_text',
                  'follow_up_questions',
                  'filler_word_positions',]
