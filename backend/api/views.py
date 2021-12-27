from datetime import datetime
from django_filters import rest_framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from . import serializers, models

class ParkingViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ParkingFilter
    serializer_class = serializers.ParkingSerializer
    queryset = models.Parking.objects.all()
    search_fields = ['Location']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    @action(methods=['get'], detail=False)
    def available(self, request, pk=None):
        location = self.request.query_params.get('location')
        fromDT = self.request.query_params.get('from')
        toDT = self.request.query_params.get('to')

        reservations = models.Reservation.objects.filter(ID_Parking__Location=location)
        reservations.filter(DateTimeTo__gt=fromDT)
        # get all Parkings with the correct location
        parkings = models.Parking.objects.filter(Location=location).filter(Reservations__StartDateTime_gt=fromDT)

        # if fromDT:
        #     parkings.filter(Reservations__DateTimeFrom__gt=)
        # else:
        #     objs = models.Parking.objects.filter(Location=location).filter()

        serializer = serializers.ParkingwithReservationsSerializer(parkings, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ReservationFilter
    serializer_class = serializers.ReservationwithParkingSerializer
    queryset = models.Reservation.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_serializer_class(self):
         if self.request.method in ['GET']:
             return serializers.ReservationSerializer
         return serializers.ReservationwithParkingSerializer

    def create(self, request):
        request.data['ID_Parking'] = request.data['ID_Parking']['id']
        serializer = serializers.ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
