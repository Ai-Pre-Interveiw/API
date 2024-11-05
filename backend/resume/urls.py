# accounts/urls.py
from django.urls import path
from .views import upload_resume, get_resume, interview_questions, create_interview

urlpatterns = [
    path('upload/', upload_resume, name='upload_resume'),
    path('', get_resume, name='get_resume'),
    path('interviews/create/', create_interview, name='create-interview'),
    path('interviews/<int:interview_id>/questions/', interview_questions, name='interview_questions'),
]
