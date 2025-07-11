from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'documents', views.DocumentViewSet, basename='document')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.DocumentTagViewSet, basename='tag')
router.register(r'access', views.DocumentAccessViewSet, basename='access')

urlpatterns = [
    path('api/dms/', include(router.urls)),
]
