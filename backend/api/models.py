from django.db import models

class Parking(models.Model):
    class Meta:
        ordering = ['id']
        db_table = 'PPV_Parking'

    ID_Landlord = models.UUIDField()
    Street = models.TextField(null=False)
    StreetNo = models.IntegerField(null=False)
    StreetNoSuffix = models.CharField(null=True, max_length=10)
    ZIP = models.IntegerField(null=False)
    Location = models.CharField(null=False, max_length=120)
    PricePerHour = models.DecimalField(null=False, decimal_places=2, max_digits=5)

    def __str__(self):
        return self.title

class Reservation(models.Model):
    class Meta:
        ordering = ['id']
        db_table = 'PPV_Reservation'
    
    ID_Renter = models.UUIDField(null=False)
    ID_Parking = models.ForeignKey(Parking, on_delete=models.DO_NOTHING, null=False, db_column='ID_Parking', related_name="Parking")
    DateTimeFrom = models.DateTimeField(null=False)
    DateTimeTo = models.DateTimeField(null=False)