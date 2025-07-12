from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.DocumentTagViewSet, basename='tag')
router.register(r'access', views.DocumentAccessViewSet, basename='access')

urlpatterns = [
    path('api/dms/', include(router.urls)),
]

urlpatterns += static(settings.DOCUMENT_URL, document_root=settings.DOCUMENT_UPLOAD_ROOT)
