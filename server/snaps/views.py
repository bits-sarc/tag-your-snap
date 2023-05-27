from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import SnapSerializer, BatchSerializer
from django.contrib.auth.models import User
from .models import Batch


# Create your views here.
"""
Snap View

post request
upload url: we can snap and specify branch code
rename file to branch code .extension

get request
send back list of snaps
branch codes
"""



class SnapView(APIView):
    permission_classes=[IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None, *args, **kwargs):
        batch_serializer = BatchSerializer(data=request.data)
        if batch_serializer.is_valid():
            batch_serializer.save()
            return Response(batch_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(batch_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        batch = Batch.objects.all()
        batch_serializer = BatchSerializer(batch, many=True)
        return Response(batch_serializer.data)


"""
SnapDetailsView
get request : batch code
snap id
image url
batch code
- if student user then only send if the branch matches their branch code
- if superuser then send

post request
snap id

"""


class SnapDetailView(APIView):
    
    def get(self,request,format=None):
        if request.user.is_student:
            batch = Batch.objects.get(batch_code=request.user.s_profile.branch_code)
            batch_serializer = BatchSerializer(batch)
            return Response(batch_serializer.data)
        elif request.user.is_admin:
            batch = Batch.objects.all()
            batch_serializer = BatchSerializer(batch, many=True)
            return Response(batch_serializer.data)
        return Response(batch_serializer.errors, status=status.HTTP_204_NO_CONTENT)
    


