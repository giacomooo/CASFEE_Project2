from datetime import datetime
from django.db import models
from django_filters import rest_framework as filters

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

class ParkingFilter(filters.FilterSet):
    Location = filters.CharFilter(lookup_expr='contains')
    ZIP = filters.NumberFilter(lookup_expr='contains')

    class Meta:
        model = Parking
        fields = ['id', 'ID_Landlord']


class Reservation(models.Model):
    class Meta:
        ordering = ['id']
        db_table = 'PPV_Reservation'

    ID_Renter = models.UUIDField(null=False)
    ID_Parking = models.ForeignKey(Parking, on_delete=models.DO_NOTHING, null=False, db_column='ID_Parking', related_name="Reservations")
    DateTimeFrom = models.DateTimeField(null=False)
    DateTimeTo = models.DateTimeField(null=False)
    IsCanceled = models.BooleanField(null=False, default=False)
    PricePerHour = models.DecimalField(null=False, decimal_places=2, max_digits=5)
    Amount = models.DecimalField(null=False, decimal_places=2, max_digits=7)

class ReservationFilter(filters.FilterSet):
    withHistory = filters.BooleanFilter(label='withHistory', method='filter_history', required=True)

    class Meta:
        model = Reservation
        fields = ['id', 'ID_Renter', 'ID_Parking__ID_Landlord']

    @classmethod
    # pylint: disable=unused-argument
    def filter_history(cls, queryset, name, value):
        try:
            if value is True:
                return queryset

            return queryset.filter(DateTimeTo__gt=datetime.now())
        except ValueError:
            return queryset.filter(DateTimeTo__gt=datetime.now())
         