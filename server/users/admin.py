from django.contrib import admin
from .models import StudentProfile, Dimension, CustomUser

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(StudentProfile)
admin.site.register(Dimension)