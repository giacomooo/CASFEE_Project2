from datetime import datetime
from django_filters import rest_framework
from rest_framework import permissions, viewsets, filters, status
from rest_framework import decorators
from rest_framework.decorators import action
from rest_framework.response import Response

from api.permissions import KeycloakRolePermissions

from . import serializers, models

class ParkingViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ParkingFilter
    serializer_class = serializers.ParkingSerializer
    queryset = models.Parking.objects.all()
    search_fields = ['Location', 'ZIP']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        else: 
            permission_classes =  [permission() for permission in self.permission_classes]
            permission_classes += (KeycloakRolePermissions(), )
            return permission_classes

    @action(methods=['get'], detail=True)
    def reservation(self, request, pk=None):
        reservations = models.Reservation.objects.filter(ID_Parking=pk)

        serializer = serializers.ReservationSerializer(reservations, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=False)
    def reservations(self, request, pk=None):
        id_landlord = self.request.query_params.get('ID_Landlord')
        parkings = models.Parking.objects.filter(ID_Landlord=id_landlord)

        serializer = serializers.ParkingwithReservationsSerializer(parkings, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ReservationFilter
    serializer_class = serializers.ReservationwithParkingSerializer
    queryset = models.Reservation.objects.all()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        else: 
            permission_classes =  [permission() for permission in self.permission_classes]
            permission_classes += (KeycloakRolePermissions(), )
            return permission_classes

    def get_serializer_class(self):
         if self.request.method in ['GET']:
             return serializers.ReservationwithParkingSerializer
         return serializers.ReservationwithParkingSerializer

    def create(self, request):
        request.data['ID_Parking'] = request.data['ID_Parking']['id']
        serializer = serializers.ReservationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
