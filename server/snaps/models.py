from django.db import models
import os


def path_and_rename(instance, filename):
    upload_to = "branch_snaps"
    ext = filename.split(".")[-1]
    new_name = instance.branch_code
    filename = f"{new_name}.{ext}"
    return os.path.join(upload_to, filename)


class Branch(models.Model):
    branch_name = models.CharField(
        verbose_name="Branch Name", max_length=255, unique=True
    )
    branch_code = models.CharField(
        verbose_name="Branch Code", max_length=5, unique=True, primary_key=True
    )
    snap_image = models.ImageField(upload_to=path_and_rename)
    is_done = models.BooleanField(default=False)
