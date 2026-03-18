from django.urls import path
from .views import SnapView, SnapDetailView, SnapAutoDetectView

urlpatterns = [
    path('', SnapView.as_view(), name='snap'),
    path('<str:branch_code>/', SnapDetailView.as_view(), name='snap-detail'),
    path('<str:branch_code>/autodetect/', SnapAutoDetectView.as_view(), name='snap-autodetect'),
]