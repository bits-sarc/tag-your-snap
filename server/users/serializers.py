from rest_framework import serializers
from .models import StudentUser ,StudentProfile ,Dimension


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentUser
        fields = ['id','email']

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ['bits_id','branch_code']

class DimensionSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)

    class Meta:
        model = Dimension
        fields=['x','y','student']



