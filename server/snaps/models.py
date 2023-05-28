from django.db import models
from users.models import StudentUser
import os 


def path_and_rename(instance,filename):
    upload_to = 'batch_snaps'
    ext = filename.split('.')[-1]
    new_name = instance.batch_code
    filename = f'{new_name}.{ext}'
    return os.path.join(upload_to, filename)


class Batch(models.Model):
    batch_name = models.CharField(
        verbose_name="Batch Name", max_length=255, unique=True
    )
    batch_code = models.CharField(
        verbose_name="Batch Code", max_length=5, unique=True
    )  # A8, B5, BXA7, H123
    snap_image = models.ImageField(upload_to=path_and_rename)


class Snap(models.Model):
    batch = models.OneToOneField(Batch, related_name="snap", on_delete=models.CASCADE)
    student = models.ForeignKey(
        StudentUser, related_name="student_snap", on_delete=models.CASCADE
    )