from django.contrib import admin
from django.urls import path
from accounts.views import LoginView
from accounts.views import RegisterView
from accounts.views import MenuListView
from accounts.views import get_users
from accounts.views import get_user_log
from accounts.views import del_user_log
from accounts.views import update_account_info
from accounts.views import get_user


urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/menu/', MenuListView.as_view(), name='menu-list'),
    path('api/users/', get_users, name='user-list'),
    path('api/user_log/', get_user_log, name='user-log'),
    path('api/del_log/', del_user_log, name='del-log'),
    path('api/your_account/', get_user, name='get-your-account'),
    path('api/your_account/update/', update_account_info, name='update-your-account'),


]