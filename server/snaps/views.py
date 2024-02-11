from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from snaps.serializers import BranchSerializer, BranchDetailsSerializer
from users.serializers import LocationSerializer, StudentSerializer
from snaps.models import Branch
from users.models import Location, UserProfile
from django.contrib.auth.models import User
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils.html import strip_tags


class SnapView(APIView):
    permission_classes = [IsAdminUser]

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

    def put(self, request, format=None):
        try:
            branch_code = request.data["branch_code"]
            if not Branch.objects.filter(branch_code=branch_code).exists():
                return Response(
                    {"error": True, "message": "invalid branch code"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            branch = Branch.objects.get(branch_code=branch_code)
            branch_serializer = BranchSerializer(
                branch, data=request.data, partial=True
            )
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
                if "id" in loc:
                    db_loc = Location.objects.get(pk=loc["id"])
                    db_loc.x = loc["x"]
                    db_loc.y = loc["y"]
                    db_loc.row = loc["row"]
                    try:
                        # if loc["user"] and (
                        #     request.user.is_staff or request.user.is_superuser
                        # ):
                        #     db_loc.added_by = request.user.profile
                        #     db_loc.locked = True
                        #     profile = UserProfile.objects.get(id=loc["user"]["id"])
                        #     db_loc.tag = profile
                        #     db_loc.save()
                        #     profile.save()
                        # else:
                        db_loc.save()
                    except Exception as e:
                        return Response(
                            {"error": True, "message": e.message},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    ids.append(db_loc.id)
                else:
                    if not "row" in loc:
                        loc["row"] = None

                    new = Location.objects.create(
                        x=loc["x"], y=loc["y"], row=loc["row"], branch=branch
                    )
                    # if loc["user"] and (
                    #     request.user.is_staff or request.user.is_superuser
                    # ):
                    #     new.added_by = request.user.profile
                    #     new.locked = True
                    #     profile = UserProfile.objects.get(id=loc["user"]["id"])
                    #     new.tag = profile
                    #     profile.save()
                    #     new.save()
                    # else:
                    new.save()
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
            if Branch.objects.filter(branch_code=branch_code).first().is_done and not (
                request.user.is_staff or request.user.is_superuser
            ):
                return Response(
                    {"error": True, "message": "Branch cannot be edited "},
                    status=status.HTTP_403_FORBIDDEN,
                )

            for tag in new_taggings:
                loc = Location.objects.get(pk=tag["id"])
                user = UserProfile.objects.get(
                    pk=tag["userprofile_id"], branch__branch_code=branch_code
                )
                added_by = request.user.profile
                if user != added_by:
                    if loc.locked and not (
                        request.user.is_staff or request.user.is_superuser
                    ):
                        return Response(
                            {
                                "error": True,
                                "message": f"The location is locked and cannot be edited",
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

                if user.tag.count() > 0 or (
                    user.is_prof
                    and user.tag
                    in Location.objects.filter(
                        branch=Branch.objects.filter(branch_code=branch_code).first()
                    )
                ):
                    tag = Location.objects.filter(tag=user, branch=branch_code)
                    for i in tag:
                        if i.locked and not (
                            request.user.is_staff or request.user.is_superuser
                        ):
                            return Response(
                                {
                                    "error": True,
                                    "message": f"The user has already been tagged in a locked location",
                                },
                                status=status.HTTP_403_FORBIDDEN,
                            )
                        i.tag = None
                        i.added_by = None
                        i.locked = False
                        i.save()

                if (
                    request.user.is_staff
                    or request.user.is_superuser
                    or user == added_by
                ):
                    loc.locked = True
                    loc.save()

                loc.tag = user
                loc.added_by = added_by
                loc.save()
                user.save()
                new_taggings = LocationSerializer(
                    Location.objects.filter(branch__branch_code=branch_code), many=True
                )
            # subject = "Confirm your batch snaps tag"
            # from_email = "Student Alumni Relations Cell <alumnicell@bits-sarc.in>"
            # to_emails = (user.user.email,)
            # html_message = render_to_string("users/send_confirmation.html")
            # plain_message = strip_tags(html_message)
            # try:
            #     send_mail(
            #         subject,
            #         plain_message,
            #         from_email,
            #         to_emails,
            #         html_message=html_message,
            #         fail_silently=False,
            #     )
            # except:
            #     pass
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
