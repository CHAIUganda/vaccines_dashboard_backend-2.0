from django.db import models

from home.utils import OverwriteStorage


class District(models.Model):
    district_name = models.CharField(max_length=70)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'district'
        verbose_name_plural = 'districts'
        ordering = ('district_name',)

    def __str__(self):
        return self.district_name


class HSD(models.Model):
    hsd_name = models.CharField(max_length=70)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hsd'
        verbose_name_plural = 'hsds'
        ordering = ('hsd_name',)

    def __str__(self):
        return self.hsd_name


class SubCounty(models.Model):
    sub_county_name = models.CharField(max_length=70)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    hsd = models.ForeignKey(HSD, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subcounty'
        verbose_name_plural = 'subcounties'

    def __str__(self):
        return self.sub_county_name


class Parish(models.Model):
    parish_name = models.CharField(max_length=70)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    hsd = models.ForeignKey(HSD, on_delete=models.CASCADE)
    sub_county = models.ForeignKey(SubCounty, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'parish'
        verbose_name_plural = 'parishes'

    def __str__(self):
        return self.parish_name



class Vaccine(models.Model):
    vaccine_name = models.CharField(max_length=70)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'vaccine'
        verbose_name_plural = 'vaccines'

    def __str__(self):
        return self.vaccine_name


#District balances and orders
class DistrictBalance(models.Model):
    district_name = models.CharField(max_length=70)
    vaccine_name = models.CharField(max_length=70)
    year = models.IntegerField()
    month = models.IntegerField()
    dose = models.DecimalField(max_digits=18, decimal_places=2)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'district_balance'
        verbose_name_plural = 'district_balances'

    def __str__(self):
        return "%s [ %s - %s  ]" % (
            self.district_name, self.month, self.year)


DOCUMENT_TYPE = (
    ('1', 'TBL_FACILITIES'),
    ('2', 'COVERAGE'),
    ('3', 'DISTRICT BALANCES AND ORDERS'),
)


class Document(models.Model):
    filename = models.CharField(max_length=70)
    path = models.CharField(max_length=255)
    document_type = models.CharField(max_length=1, choices=DOCUMENT_TYPE)
    processed = models.BooleanField(default=False)
    content = models.FileField(upload_to='./', storage=OverwriteStorage(), blank=True)
    date_created = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'document'
        verbose_name_plural = 'file_uploads'

    def __str__(self):
        return self.filename



FACILITY_TYPE = (
    ('1', 'DISTRICT STORE'),
    ('2', 'SUB-DISTRICT STORE'),
    ('3', 'NGO HCI'),
    ('4', 'NGO HCII'),
    ('5', 'NGO HCIV'),
    ('6', 'PUBLIC HCI'),
    ('7', 'PUBLIC HCII'),
    ('8', 'PUBLIC HCIII'),
    ('9', 'NGO HOSPITAL'),
    ('10', 'PUBLIC HOSPITAL')
)


class Facility(models.Model):
    facility_code = models.CharField(max_length=20, primary_key=True)
    facility_name = models.CharField(max_length=70)
    facility_type = models.CharField(max_length=1, choices=FACILITY_TYPE)
    parish = models.ForeignKey(Parish, on_delete=models.CASCADE)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'facility'
        verbose_name_plural = 'facilities'

    def __str__(self):
        return self.facility_name

