# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Menu

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Changed from get_user_model() to User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Token.objects.create(user=user)

        return user

class MenuSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=100)
    icon = serializers.CharField(max_length=50, allow_blank=True)
    route = serializers.CharField(max_length=100, allow_blank=True)
    sort_order = serializers.IntegerField()
    is_active = serializers.BooleanField()