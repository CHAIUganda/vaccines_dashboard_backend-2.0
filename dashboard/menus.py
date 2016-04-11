from django.core.urlresolvers import reverse
from menu import Menu, MenuItem


def user_is_admin(request):
    return request.user and request.user.is_staff


def user_is_super_user(request):
    return request.user and request.user.is_superuser


Menu.add_item("main", MenuItem("Coverage",
                               reverse("home"),
                               weight=10))

Menu.add_item("main", MenuItem("Stock Management",
                               reverse("reports"),
                               weight=10))

Menu.add_item("main", MenuItem("Fridge Coverage",
                               reverse("about"),
                               weight=10))

Menu.add_item("main", MenuItem("Surveillance",
                               reverse("about.tests"),
                               weight=10))

Menu.add_item("main", MenuItem("Import Files",
                               reverse("import"),
                               check=user_is_admin,
                               weight=20))

Menu.add_item("main", MenuItem("Users",
                               reverse("users"),
                               check=user_is_super_user,
                               weight=20))
