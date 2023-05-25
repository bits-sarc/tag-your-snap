from django.db import models
from users.models import StudentUser


# Create your models here.
class Batch(models.Model):
    batch_name = models.CharField(
        verbose_name="Batch Name", max_length=255, unique=True
    )
    batch_code = models.CharField(
        verbose_name="Batch Code", max_length=5, unique=True
    )  # A8, B5, BXA7, H123


class Snap(models.Model):
    batch = models.OneToOneField(Batch, related_name="snap", on_delete=models.CASCADE)
    student = models.ForeignKey(
        StudentUser, related_name="snap", on_delete=models.CASCADE
    )
