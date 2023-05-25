from django.db import models
from .utils import batch_id


class snap(models.Model):
    batch_id = models.IntegerField(
        choices=batch_id.choices(), default=batch_id.NONE)
    batch_snap = models.ImageField(upload_to=batch_snaps)

    def get_batch_id_type_label(self):
        return batch_id(self.type).name.title()
