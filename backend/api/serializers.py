from datetime import datetime
from rest_framework import serializers
from . import models

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Reservation
        fields = '__all__'

class ParkingwithReservationsSerializer(serializers.ModelSerializer):
    Reservations = ReservationSerializer(many=True)

    class Meta:
        model = models.Parking
        fields = '__all__'

class ParkingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Parking
        fields = '__all__'

class ReservationwithParkingSerializer(serializers.ModelSerializer):
    ID_Parking = ParkingSerializer(read_only=True)

    class Meta:
        model = models.Reservation
        fields = '__all__'