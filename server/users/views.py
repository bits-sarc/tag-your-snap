from django.shortcuts import render
from rest_framework import status
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import jwt
import os


# Create your views here.
class GoogleView(APIView):
    def post(self, request):
        payload = {"access_token": request.data.get("token")}
        r = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo", params=payload
        )
        data = json.loads(r.text)

        if "error" in data:
            content = {
                "error": True,
                "message": "invalid google authentication token",
                "data": {},
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        # we don't want to create any new users!!!
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            content = {"error": True, "message": "user does not exist", "data": {}}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            content = {"error": True, "message": "could not fetch user", "data": {}}
            return Response(content, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        token = RefreshToken.for_user(
            user
        )  # generate token without username & password
        decode_jwt = jwt.decode(
            str(token.access_token),
            os.environ.get("SECRET_KEY", default="ilovecats"),
            algorithms=["HS256"],
        )

        if not (user.is_superuser or user.is_staff):
            decode_jwt["bits_id"] = user.profile.bits_id
            decode_jwt["branch"] = user.profile.branch.branch_code
            content = {
                "error": True,
                "message": "portal closed",
                "data": {},
            }
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        decode_jwt["email"] = user.email

        encoded_token = jwt.encode(
            decode_jwt, os.environ.get("SECRET_KEY", default="ilovecats")
        )

        response = {"error": False, "message": "successfully logged in", "data": {}}
        response["data"]["access_token"] = str(encoded_token)
        return Response(response, status=status.HTTP_200_OK)


class UserList(APIView):
    def get(self, request):
        pass
