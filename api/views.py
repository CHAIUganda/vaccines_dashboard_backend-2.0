from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum

# Create your views here.
from rest_framework.views import APIView

from api.serializers import DistrictSerializer, VaccineSerializer, FacilitySerializer
from home.models import District, DistrictBalance, Vaccine, Facility


class DistrictList(APIView):

    def get(self, request, format=None):
        snippets = District.objects.all()
        serializer = DistrictSerializer(snippets, many=True)
        return Response(serializer.data)



class VaccinesList(APIView):

    def get(self, request, format=None):
        snippets = Vaccine.objects.all()
        serializer = VaccineSerializer(snippets, many=True)
        return Response(serializer.data)


class FacilitiesList(APIView):

    def get(self, request, format=None):
        snippets = Facility.objects.all()
        serializer = FacilitySerializer(snippets, many=True)
        return Response(serializer.data)


# @api_view(['GET'])
# def district_list(request, year, month_start, vaccine):
#     # if request.method == 'GET':
#     #     units = DistrictBalance.objects.filter(year=year, month=month_start, vaccine=vaccine
#     #                                   ).values('id', 'district_name'
#     #                                            ).annotate(issued=Sum('dose'))
#     #     serializer = DistrictSerializer(units)
#     #
#     #     return Response(serializer.data)
#     pass
