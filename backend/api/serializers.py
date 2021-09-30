from rest_framework import serializers
from . import models

class ParkingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Parking
        fields = '__all__'
    
class ReservationSerializer(serializers.ModelSerializer):
    Parking = ParkingSerializer(source='ID_Parking', read_only=True)

    class Meta:
        model = models.Reservation
        fields = '__all__'