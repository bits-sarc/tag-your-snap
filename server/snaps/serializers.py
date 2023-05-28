from rest_framework import serializers
from .models import Branch
from users.serializers import LocationSerializer, StudentSerializer, StudentNameSerializer


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ["branch_name", "branch_code", "snap_image"]


class BranchDetailsSerializer(BranchSerializer):
    locations = LocationSerializer(many=True)

    class Meta:
        model = Branch
        fields = BranchSerializer.Meta.fields + ["locations"]
