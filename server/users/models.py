from django.db import models
from django.contrib.auth.models import User
from snaps.models import Branch


class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    name = models.CharField("Full Name", max_length=255)
    bits_id = models.CharField("BITS ID", max_length=13)
    branch = models.ForeignKey(
        Branch, related_name="students", on_delete=models.PROTECT
    )
    is_prof = models.BooleanField("Is User Professor?", default=False)
    location = models.OneToOneField(
        "Location", related_name="user", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"


class Location(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    row = models.SmallIntegerField("Row Number", blank=True, null=True, default=None)
    branch = models.ForeignKey(Branch, related_name="locations", on_delete=models.CASCADE)