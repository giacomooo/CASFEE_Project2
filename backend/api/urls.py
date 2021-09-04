from django.conf.urls import url, include
from rest_framework import routers

from . import views

app_name = 'api'

router = routers.DefaultRouter()
router.register(r'parking', views.ParkingViewSet)

urlpatterns = [
    url( r'^', include(router.urls)),
]
