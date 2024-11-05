# accounts/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Resume, Question, Interview
from .serializers import ResumeGetSerializer, ResumeUploadSerializer, QuestionSerializer, InterviewSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):
    if 'file' not in request.FILES:  # 파일이 없는 경우 오류 반환
        return Response({"error": "파일을 업로드해야 합니다."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = ResumeUploadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, file=request.FILES['file'])  # request.FILES에서 파일 가져오기
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_resume(request):
    resume = Resume.objects.filter(user=request.user)
    serializer = ResumeGetSerializer(resume, many=True)
    print(serializer.data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_questions(request, interview_id):
    try:
        # 면접 ID로 인터뷰 객체를 가져오고, 관련 질문을 필터링하여 조회
        interview = Interview.objects.get(id=interview_id)
        questions = Question.objects.filter(interview=interview)

        # 질문 목록을 직렬화하고 반환
        serializer = QuestionSerializer(questions, many=True)
        print(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Interview.DoesNotExist:
        return Response({"error": "Interview not found"}, status=status.HTTP_404_NOT_FOUND)
    
# 기본 질문 리스트 설정
DEFAULT_QUESTIONS = [
    "자기 소개를 해주세요.",
    "이 직무를 선택한 이유는 무엇인가요?",
    "본인의 강점과 약점은 무엇인가요?",
    "팀 프로젝트에서 맡았던 역할은 무엇인가요?",
    "최근 읽은 책이나 관심 있는 주제가 무엇인가요?",
    "입사 후 이루고 싶은 목표는 무엇인가요?",
    "해결하기 어려웠던 경험과 극복 방법은 무엇인가요?"
]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview(request):
    serializer = InterviewSerializer(data=request.data)
    if serializer.is_valid():
        # 면접 생성
        interview = serializer.save()
        
        # 기본 질문 생성
        for question_text in DEFAULT_QUESTIONS:
            Question.objects.create(interview=interview, content=f'{question_text}, {interview}')

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)