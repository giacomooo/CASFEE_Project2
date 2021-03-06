from django.conf.urls import url, include
from rest_framework import routers

from . import views

# pylint: disable=invalid-name
app_name = 'api'

router = routers.DefaultRouter()
router.register(r'parking', views.ParkingViewSet)
router.register(r'reservation', views.ReservationViewSet)

urlpatterns = [
    url( r'^', include(router.urls)),
]
