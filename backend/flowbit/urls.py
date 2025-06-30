from django.urls import path
from . import views  # or from flowbit import views if needed
from .views import ProductViewSet
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Example route
    path('api/flowbit/add_product/', ProductViewSet.as_view({'post': 'create'}), name='flowbit-add_product'),
    path('api/flowbit/products/', ProductViewSet.as_view({'get': 'list_products'}), name='flowbit-product-list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# from rest_framework.routers import DefaultRouter
# from .views import ProductViewSet

# router = DefaultRouter()
# router.register(r'api/flowbit/add_product/', ProductViewSet)


# urlpatterns = router.urls