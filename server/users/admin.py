from django.contrib import admin
from .models import UserProfile, Location
from import_export.admin import ImportExportModelAdmin, ExportMixin
from import_export import resources


class UserProfileResource(resources.ModelResource):
    class Meta:
        model = UserProfile
        fields = ["user__email", "bits_id"]
        export_order = ["user__email", "bits_id"]


class UserProfileAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UserProfileResource


# Register your models here.
admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Location)
