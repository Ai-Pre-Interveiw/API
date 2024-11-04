# accounts/models.py
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("이메일 주소는 필수입니다.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    username = None  # username 필드를 제거
    email = models.EmailField(unique=True)  # 이메일을 고유 식별자로 사용
    nickname = models.CharField(max_length=30, blank=True, default='의문의유저')
    company = models.CharField(max_length=20, blank=True, null=True)
    domain = models.CharField(max_length=20, blank=True, null=True)
    profileImage = models.CharField(max_length=512, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    USERNAME_FIELD = 'email'  # 사용자 식별자로 이메일을 사용
    REQUIRED_FIELDS = []  # 추가 필수 필드 없음

    objects = CustomUserManager()

    def __str__(self):
        return self.email
