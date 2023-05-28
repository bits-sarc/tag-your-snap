from rest_framework import serializers
from .models import Location, UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class StudentNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["name"]


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "name"]


class LocationSerializer(serializers.ModelSerializer):
    user = StudentSerializer()

    class Meta:
        model = Location
        fields = ["id", "x", "y", "user"]