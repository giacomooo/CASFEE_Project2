from django.shortcuts import render
from django_filters import rest_framework
from rest_framework import viewsets, filters, permissions

from . import serializers, models

class ParkingViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter]
    # filterset_fields = ['id', 'priority', 'is_enable', 'tenant']
    serializer_class = serializers.ParkingSerializer
    queryset = models.Parking.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']