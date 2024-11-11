# urls.py
from django.urls import path
from .views import inference_eye_pose

urlpatterns = [
    path('<int:interview_id>/', inference_eye_pose, name='inference_eye_pose'),
]