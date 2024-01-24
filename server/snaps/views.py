from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from snaps.serializers import BranchSerializer, BranchDetailsSerializer
from users.serializers import LocationSerializer, StudentSerializer
from snaps.models import Branch
from users.models import Location, UserProfile


class SnapView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None, *args, **kwargs):
        try:
            branch_serializer = BranchSerializer(data=request.data)
            if branch_serializer.is_valid():
                branch_serializer.save()
                return Response(
                    {"error": False, "data": branch_serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"error": True, "message": branch_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except Exception as e:
            print(e)
            return Response(
                {"error": True, "message": e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get(self, request, format=None):
        try:
            branch = Branch.objects.all()
            branch_serializer = BranchSerializer(branch, many=True)
            return Response({"error": False, "data": branch_serializer.data})
        except Exception as e:
            print(e)
            return Response(
                {"error": True, "message": e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SnapDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, branch_code):
        try:
            if not Branch.objects.filter(branch_code=branch_code).exists():
                return Response(
                    {"error": True, "message": "invalid branch code"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if not (request.user.is_staff or request.user.is_superuser):
                if branch_code != request.user.profile.branch.branch_code:
                    return Response(
                        {"error": True, "message": "you cannot access this snap"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                branch = Branch.objects.get(
                    branch_code=request.user.profile.branch.branch_code
                )
                branch_serializer = BranchDetailsSerializer(branch)
                return Response({"error": False, "data": branch_serializer.data})

            branch = Branch.objects.get(branch_code=branch_code)
            branch_serializer = BranchDetailsSerializer(branch)
            return Response(
                {
                    "error": False,
                    "data": branch_serializer.data,
                }
            )
        except Exception as e:
            print(e)
            return Response(
                {"error": True, "message": e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, branch_code):
        try:
            if not (request.user.is_staff or request.user.is_superuser):
                return Response(status=status.HTTP_403_FORBIDDEN)

            if not Branch.objects.filter(branch_code=branch_code).exists():
                return Response(
                    {"error": True, "message": "invalid branch code"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            final_locations = request.data["locations"]
            branch = Branch.objects.get(branch_code=branch_code)

            ids = []
            for loc in final_locations:
                if id in loc:
                    db_loc = Location.objects.get(pk=id)
                    db_loc.x = loc["x"]
                    db_loc.y = loc["y"]
                    db_loc.row = loc["row"]
                    db_loc.save()
                    ids.append(db_loc.id)
                    continue

                if not "row" in loc:
                    loc["row"] = 0

                new = Location.objects.create(
                    x=loc["x"], y=loc["y"], row=loc["row"], branch=branch
                )
                ids.append(new.id)

            Location.objects.filter(branch__branch_code=branch_code).exclude(
                id__in=ids
            ).delete()

            new_locs = LocationSerializer(
                Location.objects.filter(branch__branch_code=branch_code), many=True
            )
            return Response({"error": False, "data": new_locs.data})
        except KeyError:
            return Response(
                {"error": True, "message": "invalid data"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(e)
            return Response(
                {"error": True, "message": e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request, branch_code):
        try:
            new_taggings = request.data["taggings"]
            if not Branch.objects.filter(branch_code=branch_code).exists():
                return Response(
                    {"error": True, "message": "invalid branch code"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            for tag in new_taggings:
                loc = Location.objects.get(pk=tag["id"])
                user = UserProfile.objects.get(
                    pk=tag["userprofile_id"], branch__branch_code=branch_code
                )
                user.location = loc
                user.save()

            new_taggings = LocationSerializer(
                Location.objects.filter(branch__branch_code=branch_code), many=True
            )
            return Response({"error": False, "data": new_taggings.data})

        except KeyError:
            return Response(
                {"error": True, "message": "invalid data"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(e)
            return Response(
                {"error": True, "message": e.message},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
