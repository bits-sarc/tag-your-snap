import cv2
import numpy as np
import urllib.request
import os
from django.conf import settings
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


def confirmation_mail():
    body = """<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
            <pre style="font-family:Roboto,sans-serif">
Greetings from Student Alumni Relations Cell!

Thank you for using tag-your-snap. %s has tagged you in your batch snaps. Kindly <a href='%s'>click this link</a> to go to the website where you can login and confirm the tag.
If there is any issue regarding the tag you can contact the undersigned.

Name: Prithvi Gowda C
Phone: <a href="tel:+91 96632 74487">+91 96632 74487</a>

</pre>"""
    return body


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
                        if user != added_by:
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
                if user != added_by:
                    subject = "Confirm your batch snaps tag"
                    from_email = (
                        "Student Alumni Relations Cell <alumnicell@pilani.bits-pilani.ac.in>"
                    )
                    if request.user.is_staff or request.user.is_superuser:
                        added = "Admin"
                    else:
                        added = request.user.profile.name
                    body = confirmation_mail()
                    snaps_url = "snaps.bits-sarc.in"
                    to_emails = (user.user.email,)
                    html_message = body % (added, snaps_url)
                    plain_message = strip_tags(html_message)
                    try:
                        send_mail(
                            subject,
                            plain_message,
                            from_email,
                            to_emails,
                            html_message=html_message,
                            fail_silently=False,
                        )
                        print('email was sent to the USER!!!')
                    except Exception as e:
                        print(f'No email was sent: {e}')
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

def get_dnn_face_detector():
    """
    Downloads (once) and loads the OpenCV Res10 SSD face detector.
    Files are saved in MEDIA_ROOT/models/ on the droplet — ~10 MB total.
    Much more accurate than Haar cascade for group photos.
    """
    model_dir = os.path.join(settings.MEDIA_ROOT, "models")
    os.makedirs(model_dir, exist_ok=True)
 
    prototxt_path = os.path.join(model_dir, "deploy.prototxt")
    weights_path  = os.path.join(model_dir, "res10_300x300_ssd_iter_140000.caffemodel")
 
    if not os.path.exists(prototxt_path):
        print("[autodetect] Downloading deploy.prototxt ...")
        urllib.request.urlretrieve(
            "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt",
            prototxt_path,
        )
 
    if not os.path.exists(weights_path):
        print("[autodetect] Downloading model weights (~10 MB) ...")
        urllib.request.urlretrieve(
            "https://github.com/opencv/opencv_3rdparty/raw/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel",
            weights_path,
        )
 
    net = cv2.dnn.readNetFromCaffe(prototxt_path, weights_path)
    return net
 
 
def detect_faces_dnn(img_bgr, confidence_threshold=0.45):
    """
    Returns list of (x, y, w, h) pixel bounding boxes.
    img_bgr: numpy array in BGR format (from cv2.imread).
    confidence_threshold: lower = finds more faces (but more false positives).
    """
    h, w = img_bgr.shape[:2]
 
    blob = cv2.dnn.blobFromImage(
        cv2.resize(img_bgr, (300, 300)),
        scalefactor=1.0,
        size=(300, 300),
        mean=(104.0, 177.0, 123.0),
    )
 
    net = get_dnn_face_detector()
    net.setInput(blob)
    detections = net.forward()
 
    faces = []
    for i in range(detections.shape[2]):
        conf = float(detections[0, 0, i, 2])
        if conf < confidence_threshold:
            continue
 
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        x1, y1, x2, y2 = box.astype(int)
 
        # Clamp to image bounds
        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)
 
        bw, bh = x2 - x1, y2 - y1
        if bw > 5 and bh > 5:
            faces.append((x1, y1, bw, bh))
 
    return faces
 
 
class SnapAutoDetectView(APIView):
    """
    POST /snaps/<branch_code>/autodetect/
 
    Admin-only. Detects faces in the branch snap, saves Location dots.
    Existing tagged locations are never deleted (protected).
 
    Optional JSON body params:
      "replace_all"  : bool  (default false) — if true, deletes ALL locations first
      "confidence"   : float (default 0.45)  — detection threshold, lower = more faces
    """
 
    permission_classes = [IsAdminUser]
 
    def post(self, request, branch_code):
        try:
            # ── 1. validate ─────────────────────────────────────────────────
            branch = Branch.objects.filter(branch_code=branch_code).first()
            if not branch:
                return Response(
                    {"error": True, "message": "invalid branch code"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            if not branch.snap_image:
                return Response(
                    {"error": True, "message": "no snap image uploaded for this branch"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
 
            # ── 2. load image from disk ──────────────────────────────────────

            image_path = os.path.join(settings.MEDIA_ROOT, branch.snap_image.name)
 
            if not os.path.exists(image_path):
                return Response(
                    {"error": True, "message": f"image file not found: {image_path}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
 
            img = cv2.imread(image_path)
            if img is None:
                return Response(
                    {"error": True, "message": "cv2 could not read the image file"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
 
            orig_h, orig_w = img.shape[:2]
 
            # ── 3. upscale low-res images before detection ───────────────────
            # Batch snaps are often not high resolution.
            # Upscaling helps the detector find small/distant faces.
            # We only upscale for detection — the saved percentages are always
            # relative to the original image dimensions.
            detect_img = img
            scale = 1.0
 
            TARGET_WIDTH = 3000 # upscale to this width for detection
            if orig_w < TARGET_WIDTH:
                scale = TARGET_WIDTH / orig_w
                new_w = int(orig_w * scale)
                new_h = int(orig_h * scale)
                detect_img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
                print(f"[autodetect] {branch_code}: upscaled {orig_w}x{orig_h} → {new_w}x{new_h} for detection")
 
            # ── 4. run detection ─────────────────────────────────────────────
            confidence_threshold = float(request.data.get("confidence", 0.15))
            faces_scaled = detect_faces_dnn(detect_img, confidence_threshold)
 
            print(f"[autodetect] {branch_code}: found {len(faces_scaled)} faces "
                  f"(threshold={confidence_threshold})")
 
            if len(faces_scaled) == 0:
                return Response({
                    "error": False,
                    "detected": 0,
                    "message": (
                        "No faces detected. Try lowering confidence "
                        "(e.g. send { \"confidence\": 0.3 }) or check the image."
                    ),
                    "data": LocationSerializer(
                        Location.objects.filter(branch=branch), many=True
                    ).data,
                }, status=status.HTTP_200_OK)
 
            # ── 5. clear untagged dots ───────────────────────────────────────
            replace_all = request.data.get("replace_all", False)
            if replace_all:
                deleted_count = Location.objects.filter(branch=branch).delete()[0]
            else:
                # Only remove dots that have NOT been tagged yet.
                # This means if the admin already ran autodetect + students
                # tagged some faces, re-running will only refresh the untagged dots.
                deleted_count = Location.objects.filter(branch=branch, tag=None).delete()[0]
 
            print(f"[autodetect] {branch_code}: deleted {deleted_count} existing untagged locations")
 
            # ── 6. convert to original-image percentages + bulk create ───────
            new_locations = []
            for (x, y, w, h) in faces_scaled:
                # Scale bounding box back to original image coordinates
                center_x_orig = (x + w / 2) / scale
                center_y_orig = (y + h / 2) / scale
 
                # Convert to 0–100 percentage — identical to how tagSnapAdmin.tsx
                # calculates it: ((clientX - rect.left) / rect.width) * 100
                pct_x = (center_x_orig / orig_w) * 100
                pct_y = (center_y_orig / orig_h) * 100
 
                new_locations.append(Location(
                    x=round(pct_x, 4),
                    y=round(pct_y, 4),
                    row=0,        # admin assigns rows afterwards using existing UI
                    branch=branch,
                    tag=None,     # no tag yet — students tag themselves
                    added_by=None,
                    locked=False,
                ))
 
            Location.objects.bulk_create(new_locations)
 
            # ── 7. return all locations for the branch ───────────────────────
            all_locs = Location.objects.filter(branch=branch)
            serializer = LocationSerializer(all_locs, many=True)
 
            return Response({
                "error": False,
                "detected": len(faces_scaled),
                "data": serializer.data,
            }, status=status.HTTP_200_OK)
 
        except Exception as e:
            print(f"[autodetect] Exception: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": True, "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
 