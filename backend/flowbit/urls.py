from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'api/flowbit/products', ProductViewSet, basename='flowbit-product')


urlpatterns = [
    path('', include(router.urls)),
    # Keep custom endpoint for delete if needed
    path('api/flowbit/del_product/', ProductViewSet.as_view({'post': 'delete_product'}), name='flowbit-del_product'),
    path('api/flowbit/search_products/', ProductViewSet.as_view({'get': 'get_search_products'}), name='flowbit-get-search_products'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)