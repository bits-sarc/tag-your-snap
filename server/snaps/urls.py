from django.urls import path, re_path

from .views import SnapView

urlpatterns = [
    path('snap/', SnapView.as_view(), name='snap'),
]