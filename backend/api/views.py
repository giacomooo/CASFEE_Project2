from django_filters import rest_framework
from rest_framework import viewsets, filters
from rest_framework.decorators import action
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
        # timezone.now().date()

        if toDT:
            objs = models.Parking.objects.all()
        else:
            objs = models.Parking.objects.all()

        serializer = serializers.ParkingSerializer(objs, many=True)
        return Response(serializer.data)


class ReservationViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ReservationFilter
    serializer_class = serializers.ReservationSerializer
    queryset = models.Reservation.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']
