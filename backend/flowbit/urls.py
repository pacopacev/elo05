from django.urls import path
from . import views  # or from flowbit import views if needed

urlpatterns = [
    # Example route
    path('', views.index, name='flowbit-home'),
]