from django.contrib import admin
from django.urls import path
from accounts.views import LoginView
from accounts.views import RegisterView
from accounts.views import MenuListView

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/dashboard/', MenuListView.as_view(), name='menu-list'),
    # path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
]