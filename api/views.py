from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
from api.serializers import DistrictSerializer
from home.models import District


@api_view(['GET'])
def district_list(request):
    if request.method == 'GET':
        districts = District.objects.all()
        serializer = DistrictSerializer(districts)
        return Response(serializer.data)


