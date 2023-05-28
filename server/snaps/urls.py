from django.urls import path, re_path

from .views import SnapView, SnapDetailView

urlpatterns = [
    path('', SnapView.as_view(), name='snap'),
    path('<str:branch_code>/', SnapDetailView.as_view(), name='snap'),
]