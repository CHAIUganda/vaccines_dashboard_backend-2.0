from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum

# Create your views here.
from api.serializers import DistrictSerializer
from home.models import District, DistrictBalance


@api_view(['GET'])
def district_list(request, year, month_start, vaccine):
    # if request.method == 'GET':
    #     units = DistrictBalance.objects.filter(year=year, month=month_start, vaccine=vaccine
    #                                   ).values('id', 'district_name'
    #                                            ).annotate(issued=Sum('dose'))
    #     serializer = DistrictSerializer(units)
    #
    #     return Response(serializer.data)
    pass
