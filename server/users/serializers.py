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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["name"] = user.profile.name
        token["email"] = user.email
        token["branch_code"] = user.profile.branch.branch_code

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer