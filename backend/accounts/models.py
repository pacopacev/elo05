# from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import os
from django.contrib.auth.models import User
#
# class CustomUser(AbstractUser):
#     pass

def user_directory_path(instance, filename):
    # This will save files like D:/uploads/user_5/filename.jpg
    return f'user_{instance.user_id}/{filename}'

class UploadedImage(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.ImageField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    user_id = models.IntegerField(null=False, blank=False)

class Menu(models.Model):
    title = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    route = models.CharField(max_length=100, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return self.title


