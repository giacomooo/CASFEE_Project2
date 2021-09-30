from datetime import datetime
from django.db import models
from django_filters import rest_framework as filters
from django_filters.filters import DateTimeFromToRangeFilter

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
        fields = ['ID_Landlord']


class Reservation(models.Model):
    class Meta:
        ordering = ['id']
        db_table = 'PPV_Reservation'
    
    ID_Renter = models.UUIDField(null=False)
    ID_Parking = models.ForeignKey(Parking, on_delete=models.DO_NOTHING, null=False, db_column='ID_Parking', related_name="Parking")
    DateTimeFrom = models.DateTimeField(null=False)
    DateTimeTo = models.DateTimeField(null=False)
    IsCanceled = models.BooleanField(null=False, default=False)
    PricePerHour = models.DecimalField(null=False, decimal_places=2, max_digits=5)
    Amount = models.DecimalField(null=False, decimal_places=2, max_digits=7)

class ReservationFilter(filters.FilterSet):
    withHistory = filters.BooleanFilter(field_name='withHistory', method='filterHistory', required=True)

    class Meta:
        model = Reservation
        fields = ['ID_Renter']

    def filterHistory(self, queryset, value, *args, **kwargs):
        try:
            if args[0] == True:
                return queryset
            else:
                return queryset.filter(DateTimeTo__gt=datetime.now())
        except ValueError:
            print('hier2')
            return queryset.filter(DateTimeTo__gt=datetime.now())
         