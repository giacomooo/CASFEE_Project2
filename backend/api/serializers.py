from datetime import datetime
from rest_framework import serializers
from . import models

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Reservation
        fields = '__all__'

class ParkingwithReservationsSerializer(serializers.ModelSerializer):    
    #Reservations = ReservationSerializer(many=True, queryset=models.Reservation.objects.filter(DateTimeTo__gt=datetime.now()))
    Reservations = serializers.SerializerMethodField('getExistingReservations')

    def getExistingReservations(self, parking):
        reservations = models.Reservation.objects.filter(ID_Parking=parking, DateTimeTo__gt=datetime.now())
        serializer = ReservationSerializer(reservations, many=True)
        return serializer.data

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