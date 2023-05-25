from rest_framework import serializers
from .models import Snap , Batch


class SnapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snap
        fields = ['id','batch','student']

class BatchSerializer(serializers.ModelSerializer):
    class Meta :
        model = Batch
        fields = ['batch_name','batch_code','snap_image']