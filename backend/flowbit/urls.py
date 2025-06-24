from django.urls import path
from . import views  # or from flowbit import views if needed
from .views import ProductViewSet

urlpatterns = [
    # Example route
    path('api/flowbit/add_product/', ProductViewSet.as_view({'post': 'create'}), name='flowbit-add_product'),
]

# from rest_framework.routers import DefaultRouter
# from .views import ProductViewSet

# router = DefaultRouter()
# router.register(r'api/flowbit/add_product/', ProductViewSet)


# urlpatterns = router.urls