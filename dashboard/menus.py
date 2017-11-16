from django.core.urlresolvers import reverse
from menu import Menu, MenuItem


def user_is_admin(request):
    return request.user and request.user.is_staff


def user_is_super_user(request):
    return request.user and request.user.is_superuser


Menu.add_item("main", MenuItem("UNEPI",
                               "#/unepi/download",
                                weight=1))

Menu.add_item("main", MenuItem("Coverage".upper(),
                               "#/coverage/coverage",
                               weight=1))

Menu.add_item("main", MenuItem("Stock Management".upper(),
                               "#/stock/stockonhand",
                               weight=1))

Menu.add_item("main", MenuItem("Cold Chain".upper(),
                               "#/fridge/facilities",
                               weight=1))

Menu.add_item("main", MenuItem("FINANCE",
                               "#/finance/obligations",
                               weight=1))

'''
Menu.add_item("main", MenuItem("Planning",
                               "#/planning/awp",
                              weight=10))

Menu.add_item("main", MenuItem("CVS",
                               "#",
                               weight=10))
'''
Menu.add_item("main", MenuItem("Import Files",
                               reverse("import"),
                               check=user_is_admin,
                               weight=20))

Menu.add_item("main", MenuItem("Financing Data",
                               reverse("finance"),
                               check=user_is_admin,
                               weight=20))

Menu.add_item("main", MenuItem("Users",
                               reverse("users"),
                               check=user_is_super_user,
                               weight=20))
