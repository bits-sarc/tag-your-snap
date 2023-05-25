from django.urls import path, re_path

from . import views

urlpatterns = [
    path('google/', views.GoogleView.as_view(), name='google'),
]