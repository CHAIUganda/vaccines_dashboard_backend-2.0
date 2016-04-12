import csv
import json
from functools import cmp_to_key
import pydash

from arrow import now
from braces.views import LoginRequiredMixin
from django.db.models import Count, Sum
from django.http import HttpResponse
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.expressions import F

from dashboard.helpers import *

from dashboard.models import Balance, YearMonth

class AccessAreasView(APIView):
    def get(self, request):
        level = request.GET.get('level', None)
        access_levels = ['district']
        access_areas = []
        return Response(access_areas)
