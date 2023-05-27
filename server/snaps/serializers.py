from rest_framework import serializers
from .models import Snap , Batch
from users.serializers import StudentProfile ,StudentSerializer



class BatchSerializer(serializers.ModelSerializer):
    class Meta :
        model = Batch
        fields = ['batch_name','batch_code','snap_image']

class SnapSerializer(serializers.ModelSerializer):
    student = StudentSerializer(many=True, read_only=True)
    batch = BatchSerializer(read_only=True)

    class Meta:
        model = Snap
        fields = ['id','batch','student']
