from django.shortcuts import render
from rest_framework import status
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class GoogleView(APIView):
    def post(self, request):
        payload = { 'access_token': request.data.get('token') }
        r = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', params=payload)
        data = json.loads(r.text)

        if 'error' in data:
            content = { 'error': True, 'message': 'invalid google authentication token', 'data': {} }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)
        
        # we don't want create any new users!!!
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            content = { 'error': True, 'message': 'user does not exist', 'data': {} }
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            content = { 'error': True, 'message': 'could not fetch user', 'data': {} }
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        token = RefreshToken.for_user(user)  # generate token without username & password
        response = { 'error': False, 'message': 'successfully logged in', 'data': {} }
        response['data']['access_token'] = str(token.access_token)
        return Response(response, status=status.HTTP_200_OK)