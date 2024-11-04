# accounts/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login as auth_login  # Django의 login 함수에 별칭 지정
from .serializers import SignUpSerializer, LoginSerializer
from .models import CustomUser
from django.http import JsonResponse
from django.middleware.csrf import get_token

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        auth_login(request._request, user)
        return Response({'message': '회원가입 성공'}, status=status.HTTP_201_CREATED)
    else:
        print("유효성 검사 오류:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'GET':
        return Response({"detail": "Method 'GET' not allowed. Use 'POST' to log in."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        auth_login(request._request, user)
        return Response({'message': '로그인 성공'}, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  # 인증된 사용자만 접근 가능
def retrieve_user_info(request):
    user = request.user  # 현재 인증된 사용자

    # 사용자 정보와 이력서 리스트를 포함한 응답 데이터
    user_data = {
        "id": user.id,
        "email": user.email,
        "nickname": user.nickname,
        "profileImage": user.profileImage,
        "createdAt": user.created_at,
    }
    return Response(user_data, status=status.HTTP_200_OK)