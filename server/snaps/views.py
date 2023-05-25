from rest_framework import status
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser ,FormParser
from .serializers import SnapSerializer ,BatchSerializer
from .models import Batch


# Create your views here.
'''
Snap View

post request
upload url: we can snap and specify branch code
rename file to branch code .extension

get request
send back list of snaps
branch codes
'''
class SnapView(APIView):
    parser_classes=(MultiPartParser,FormParser)

    def post(self,request,format=None,*args,**kwargs):
        batch_serializer = BatchSerializer(data=request.data)
        if batch_serializer.is_valid():
            batch_serializer.save()
            return Response(batch_serializer.data ,status=status.HTTP_201_CREATED)
        else:
            return Response(batch_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, format=None):
        batch = Batch.objects.all()
        batch_serializer = BatchSerializer(batch,many=True)
        return Response(batch_serializer.data)


'''
SnapDetailsView
get request : batch code
snap id
image url
batch code
- if student user then only send if the branch matches their branch code
- if superuser then send

post request
snap id

'''