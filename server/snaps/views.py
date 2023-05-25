from rest_framework import status
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework.response import Response

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

    def post(request):
        pass

    def get(request):
        pass

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