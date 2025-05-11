from django.contrib import admin
from django.urls import path
from accounts.views import LoginView
from accounts.views import RegisterView
from accounts.views import MenuListView
from accounts.views import get_users

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/menu/', MenuListView.as_view(), name='menu-list'),
    path('api/users/', get_users, name='user-list'),
    # path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
]