# accounts/urls.py
from django.urls import path
from .views import upload_resume, get_resume, interview_questions, create_interview, create_interview_result, interview_results_by_interview_id, update_interview_result, get_all_interviews, get_specific_interview, update_interview

urlpatterns = [
    path('upload/', upload_resume, name='upload_resume'),
    path('', get_resume, name='get_resume'),
    path('interviews/', get_all_interviews, name='get_all_interviews'),
    path('interviews/<int:interview_id>/', get_specific_interview, name='get_specific_interview'),
    path('interviews/create/', create_interview, name='create-interview'),
    path('interviews/<int:interview_id>/update/', update_interview, name='update_interview'),  # 업데이트 URL
    path('interviews/<int:interview_id>/questions/', interview_questions, name='interview_questions'),
    path('interviews/<int:interview_id>/results/', interview_results_by_interview_id, name='interview_results_by_interview_id'),
    path('results/create/', create_interview_result, name='create_interview_result'),
    path('results/<int:pk>/update/', update_interview_result, name='update_interview_result'),
]
