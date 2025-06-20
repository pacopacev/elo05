from django.urls import path
from . import views  # or from flowbit import views if needed

# urlpatterns = [
#     # Example route
#     path('', views.index, name='flowbit-home'),
# ]

from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'api/flowbit/save_product/', ProductViewSet)

urlpatterns = router.urls