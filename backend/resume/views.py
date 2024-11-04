# resume/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import ResumeSerializer
from .models import Resume

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):
    serializer = ResumeSerializer(data=request.data)
    if serializer.is_valid():
        # 현재 사용자와 함께 이력서 생성
        Resume.objects.create(user=request.user, **serializer.validated_data)
        return Response({'message': '이력서 등록 성공'}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
