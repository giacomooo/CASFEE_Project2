from parler_rest import serializers, fields

from . import models

class ParkingSerializer(serializers.TranslatableModelSerializer):
    class Meta:
        model = models.Parking
        fields = '__all__'