from django.db import models

class Parking(models.Model):
    class Meta:
        ordering = ['id']
        db_table = 'PPV_Parking'

    is_enable = models.BooleanField(blank=False, default=False)
    street = models.TextField(blank=True, default="")
    # streetno = models.IntegerField(blank=True, unique=False)

    def __str__(self):
        return self.title