# accounts/serializers.py
from rest_framework import serializers

from .models import Product, ProductImage
from rest_framework import serializers
import sys


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = '__all__'
        read_only_fields = ['created_at']

    def get_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.file.url) if obj.file else None
        return obj.file.url if obj.file else None




class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['create_by', 'created_at', 'updated_at']

    def validate_code(self, value):
        qs = Product.objects.filter(code=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Product with this Product Code already exists.")
        return value
        
        
class ProductImageSerializer(serializers.ModelSerializer):

    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = '__all__'
        read_only_fields = ['created_at']
        # 'url' is added by SerializerMethodField

    def get_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return request.build_absolute_uri(obj.file.url) if obj.file else None
        return obj.file.url if obj.file else None


