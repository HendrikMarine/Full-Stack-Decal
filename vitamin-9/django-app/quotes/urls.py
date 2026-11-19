from django.urls import path, include
from . import views

urlpatterns = [
    # TODO 12: template view patterns
    path("", views.home, name="home"),
    path("all/", views.all_quotes, name="all_quotes"),

    # TODO 13: every API route lives under api/
    path("api/", include("quotes.api_urls")),
]
