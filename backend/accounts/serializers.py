# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from django.db import IntegrityError

class SignUpSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, min_length=8, error_messages={
        "min_length": "비밀번호는 최소 8자 이상이어야 합니다."
    })
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'nickname', 'password1', 'password2')

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("이미 사용 중인 이메일입니다.")  # 커스텀 메시지
        return value

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "비밀번호가 일치하지 않습니다."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password1')
        user = CustomUser(**validated_data)
        user.set_password(password)
        try:
            user.save()
        except IntegrityError:  # 이메일 중복 시 발생하는 에러 처리
            raise serializers.ValidationError({"email": "이미 사용 중인 이메일입니다."})
        return user

# 로그인용 Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        # 이메일과 비밀번호로 사용자 인증 시도
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("이메일 또는 비밀번호가 올바르지 않습니다.")
        
        data["user"] = user
        return data
