from django.shortcuts import render
from django_filters import rest_framework
from rest_framework import viewsets, filters, permissions

from . import serializers, models

class ParkingViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ParkingFilter
    serializer_class = serializers.ParkingSerializer
    queryset = models.Parking.objects.all()
    search_fields = ['Location']
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

class ReservationViewSet(viewsets.ModelViewSet):
    pagination_class = None
    filter_backends = [rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = models.ReservationFilter
    serializer_class = serializers.ReservationSerializer
    queryset = models.Reservation.objects.all()
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']