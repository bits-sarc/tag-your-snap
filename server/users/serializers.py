from rest_framework import serializers
from .models import Location, UserProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["id", "name", "bits_id"]


class LocationSerializer(serializers.ModelSerializer):
    tag = StudentSerializer()
    added_by = StudentSerializer()

    class Meta:
        model = Location
        fields = ["id", "x", "y", "tag", "added_by", "locked", "row"]
