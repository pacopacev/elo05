# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# If you don't need any custom admin configurations, you can remove this file entirely
# as User is already registered in Django's admin by default

# If you want to keep the file for future customizations:
admin.site.unregister(User)  # Unregister first to avoid duplicate registration
admin.site.register(User, UserAdmin)