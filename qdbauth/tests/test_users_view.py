from django.core.urlresolvers import reverse
from django_webtest import WebTest

from dashboard.models import DashboardUser


class SuperUserAuthMixin():
    def test_should_require_login(self):
        response = self.app.get(self.get_url())
        self.assertEqual(response.status_code, 302)

        user = DashboardUser.objects.create_superuser("a@a.com", "secret")
        response = self.app.get(self.get_url(), user=user)
        self.assertEqual(response.status_code, 200)

    def test_should_require_super_user(self):
        user = DashboardUser.objects.create_user("a@a.com", "secret")
        response = self.app.get(self.get_url(), user=user)
        self.assertEqual(response.status_code, 302)

    def test_should_user_correct_template(self):
        user = DashboardUser.objects.create_superuser("a@a.com", "secret")
        response = self.app.get(self.get_url(), user=user)
        self.assertTemplateUsed(response, self.template_name)


class UsersViewTestCase(WebTest, SuperUserAuthMixin):
    template_name = "dashboard/dashboarduser_list.html"

    def get_url(self):
        return reverse("users")


class UserAddViewTestCase(WebTest, SuperUserAuthMixin):
    template_name = "dashboard/dashboarduser_form.html"

    def get_url(self):
        return reverse("users-add")

    def test_should_validate_form(self):
        user = DashboardUser.objects.create_superuser("a@a.com", "secret")
        response = self.app.get(self.get_url(), user=user)
        form = response.form
        form['email'] = "theuser@mail.com"
        form['password1'] = "secret"
        form['password2'] = ""
        response = form.submit()
        self.assertTrue("form" in response.context)
        self.assertFalse(response.context['form'].is_valid())

    def test_should_create_user(self):
        user = DashboardUser.objects.create_superuser("a@a.com", "secret")
        response = self.app.get(self.get_url(), user=user)
        form = response.form
        form['email'] = "theuser@mail.com"
        form['password1'] = "secret"
        form['password2'] = "secret"
        form['access_level'] = "IP"
        response = form.submit()
        self.assertEquals(response.status_code, 302)
        self.assertEquals(DashboardUser.objects.count(), 2)
