from django.urls import path, re_path

from .views import GoogleView

urlpatterns = [
    path('google/', GoogleView.as_view(), name='google'),
]