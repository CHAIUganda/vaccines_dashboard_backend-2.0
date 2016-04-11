import random

from django.core.urlresolvers import reverse
from django_webtest import WebTest
from model_mommy import mommy

from dashboard.data.nn import NNRTINEWPAEDCheck, NNRTICURRENTPAEDCheck, NNRTINewAdultsCheck, NNRTICURRENTADULTSCheck
from dashboard.helpers import DEFAULT, YES, F1, F1_QUERY, DF1, DF2, F1_PATIENT_QUERY, PACKS_ORDERED, ESTIMATED_NUMBER_OF_NEW_PREGNANT_WOMEN, ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS, QUANTITY_REQUIRED_FOR_CURRENT_PATIENTS, MONTHS_OF_STOCK_OF_HAND, CLOSING_BALANCE, LOSES_ADJUSTMENTS, ART_CONSUMPTION, PMTCT_CONSUMPTION, QUANTITY_RECEIVED, OPENING_BALANCE
from dashboard.models import Score, Consumption, AdultPatientsRecord, PAEDPatientsRecord


def generate_values():
    fields = [
        PACKS_ORDERED,
        ESTIMATED_NUMBER_OF_NEW_PREGNANT_WOMEN,
        ESTIMATED_NUMBER_OF_NEW_ART_PATIENTS,
        QUANTITY_REQUIRED_FOR_CURRENT_PATIENTS,
        MONTHS_OF_STOCK_OF_HAND,
        CLOSING_BALANCE,
        LOSES_ADJUSTMENTS,
        ART_CONSUMPTION,
        PMTCT_CONSUMPTION,
        QUANTITY_RECEIVED,
        OPENING_BALANCE
    ]
    data = {}
    for field in fields:
        data[field] = random.randrange(0, 600)
    return data


class ScoreDetailTestCase():
    formulations = [F1_QUERY]

    def test_view_loads(self):
        name = "F1"
        warehouse = "W1"
        ip = "I1"
        district = "D1"
        cycle = "Jan - Feb 2015"
        score = Score.objects.create(name=name, warehouse=warehouse, ip=ip, district=district, REPORTING={DEFAULT: YES},
                                     WEB_BASED={DEFAULT: YES}, cycle=cycle)
        for q in F1_PATIENT_QUERY:
            mommy.make(AdultPatientsRecord, name=name, warehouse=warehouse, ip=ip, district=district, cycle=cycle, formulation=q, new=random.randrange(0, 600), existing=random.randrange(0, 600))
            mommy.make(PAEDPatientsRecord, name=name, warehouse=warehouse, ip=ip, district=district, cycle=cycle, formulation=q, new=random.randrange(0, 600), existing=random.randrange(0, 600))
        for formulation in self.get_formulations():
            values = generate_values()
            mommy.make(Consumption, name=name, warehouse=warehouse, ip=ip, district=district, cycle=cycle, formulation=formulation, **values)
        url = reverse("scores-detail", kwargs={"id": score.id, "column": self.column}) + "?combination=" + F1
        response = self.app.get(url)
        self.assertEqual(response.status_code, 200)

    def test_correct_template_rendered(self):
        score = Score.objects.create(name="F1", warehouse="W1", ip="I1", district="D1", REPORTING={DEFAULT: YES},
                                     WEB_BASED={DEFAULT: YES}, cycle="Jan - Feb 2015")
        url = reverse("scores-detail", kwargs={"id": score.id, "column": self.column}) + "?combination=" + F1
        response = self.app.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, self.template_name)

    def get_formulations(self):
        return self.formulations


class NNRTICheckTestMixin(ScoreDetailTestCase):
    check = NNRTINEWPAEDCheck

    def get_formulations(self):
        check = NNRTINEWPAEDCheck({})
        formulations = check.combinations[0][DF1] + check.combinations[0][DF2]
        return formulations


class ReportingCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 4
    template_name = "check/base.html"


class OrderTypeCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 5
    template_name = "check/base.html"


class MultipleOrdersCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 11
    template_name = "check/base.html"


class GapsCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 10
    template_name = "check/base.html"


class GuideLineAdherenceAdult1LCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 6
    template_name = "check/adherence.html"


class GuideLineAdherenceAdult2LCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 7
    template_name = "check/adherence.html"


class GuideLineAdherencePaed1LCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 8
    template_name = "check/adherence.html"


class NNRTINewPaedCheckDetailView(WebTest, NNRTICheckTestMixin):
    check = NNRTINEWPAEDCheck
    column = 18
    template_name = "check/nnrti.html"


class NNRTICurrentPaedCheckDetailView(WebTest, NNRTICheckTestMixin):
    check = NNRTICURRENTPAEDCheck
    column = 19
    template_name = "check/nnrti.html"


class NNRTINewAdultCheckDetailView(WebTest, NNRTICheckTestMixin):
    check = NNRTINewAdultsCheck
    column = 20
    template_name = "check/nnrti.html"


class NNRTICurrentAdultCheckDetailView(WebTest, NNRTICheckTestMixin):
    check = NNRTICURRENTADULTSCheck
    column = 21
    template_name = "check/nnrti.html"


class StablePatientsCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 16
    template_name = "check/differentOrdersOverTime.html"


class ConsumptionAndPatientsCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 12
    template_name = "check/consumptionAndPatients.html"


class WarehouseCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 17
    template_name = "check/differentOrdersOverTime.html"


class DiffOrdersCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 13
    template_name = "check/differentOrdersOverTime.html"


class ClosingBalanceCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 14
    template_name = "check/differentOrdersOverTime.html"


class NegativesCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 11
    template_name = "check/orderFormFreeOfNegativeNumbers.html"


class StableConsumptionCheckDetailView(WebTest, ScoreDetailTestCase):
    column = 15
    template_name = "check/differentOrdersOverTime.html"
