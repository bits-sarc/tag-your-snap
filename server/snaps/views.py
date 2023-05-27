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


class SnapView(APIView):
    permission_classes = [IsAdminUser]
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


class SnapDetailView(APIView):
    permission_classes = [IsAuthenticated]

    '''
    TODO:
    send list of names of students in that branch
    '''
    def get(self, request, batch_code):
        if request.user.is_student:
            if batch_code != request.user.s_profile.branch_code:
                return Response({'error': False, 'data': batch_serializer.data}, status=status.HTTP_)
            batch = Batch.objects.get(batch_code=request.user.s_profile.branch_code)
            batch_serializer = BatchSerializer(batch)
            return Response({'error': False, 'data': batch_serializer.data})

        elif request.user.is_admin:
            batch = Batch.objects.get(batch_code=batch_code)
            batch_serializer = BatchSerializer(batch)
            return Response({ 'error': False, 'data': batch_serializer.data })

        return Response(batch_serializer.errors, status=status.HTTP_204_NO_CONTENT)

    def post(self, request, batch_code):
        '''
        json request body:
        array of people 
        [
            {
                user_id: 1,
                x: 123,
                y: 123,
            }
        ]
        '''
        pass
