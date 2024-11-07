# accounts/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Resume, Question, Interview, InterviewResult
from .serializers import ResumeGetSerializer, ResumeUploadSerializer, QuestionSerializer, InterviewSerializer, InterviewResultSerializer

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


# 모든 면접 조회
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_interviews(request):
    interviews = Interview.objects.filter(resume__user=request.user)
    serializer = InterviewSerializer(interviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 기본 질문 리스트 설정
DEFAULT_QUESTIONS = [
    "자기 소개를 해주세요.",
    "이 직무를 선택한 이유는 무엇인가요?",
    "본인의 강점과 약점은 무엇인가요?",
    "팀 프로젝트에서 맡았던 역할은 무엇인가요?",
    "최근 읽은 책이나 관심 있는 주제가 무엇인가요?",
    "입사 후 이루고 싶은 목표는 무엇인가요?",
    "해결하기 어려웠던 경험과 극복 방법은 무엇인가요?",
    "test",
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

# 면접 결과 생성
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_interview_result(request):
    serializer = InterviewResultSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()  # 유효한 데이터로 저장
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    print(serializer.errors)  # 오류 메시지를 로그에 출력
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 면접 결과 수정
@api_view(['PUT'])
def update_interview_result(request, pk):
    try:
        interview_result = InterviewResult.objects.get(pk=pk)
    except InterviewResult.DoesNotExist:
        return Response({'error': 'InterviewResult not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = InterviewResultSerializer(interview_result, data=request.data, partial=True)  # 부분 업데이트 허용
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def interview_results_by_interview_id(request, interview_id):
    try:
        # 면접 ID에 해당하는 모든 면접 결과 조회
        interview_results = InterviewResult.objects.filter(interview__id=interview_id)
        serializer = InterviewResultSerializer(interview_results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Interview.DoesNotExist:
        return Response({"error": "Interview not found"}, status=status.HTTP_404_NOT_FOUND)