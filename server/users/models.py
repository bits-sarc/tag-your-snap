from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from .managers import UserManager, StudentManager, SarcManager


class CustomUser(AbstractBaseUser):
    email = models.EmailField(max_length=250, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    is_sarc = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()

    def __str__(self):
        return str(self.email)

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)


class StudentUser(CustomUser):
    objects = StudentManager()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.id or self.id is None:
            self.is_student = True
            self.is_sarc = False
        return super().save(*args, **kwargs)


class SarcUser(CustomUser):
    objects = SarcManager()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.id or self.id is None:
            self.is_student = False
            self.is_sarc = True
            self.is_admin = True
            self.is_staff = True
        return super().save(*args, **kwargs)


class StudentProfile(models.Model):
    student_profile = models.OneToOneField(
        StudentUser, on_delete=models.CASCADE, related_name="s_profile"
    )
    bits_id = models.CharField(max_length=20)
    branch_code = models.CharField(max_length=10)


class Dimension(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    student = models.OneToOneField(
        StudentProfile, related_name="dimension", on_delete=models.CASCADE,null=True
    )
