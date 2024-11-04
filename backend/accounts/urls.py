# accounts/urls.py
from django.urls import path
from .views import signup, login_view, retrieve_user_info, get_csrf_token
urlpatterns = [
    path('csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('signup/', signup, name='signup'),
    path('login/', login_view, name='login'),
    path('profile/', retrieve_user_info, name='retrieve_user_info'),
]
