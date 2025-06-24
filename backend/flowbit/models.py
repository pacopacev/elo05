from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.core.files.storage import FileSystemStorage
import platform
import os
from django.conf import settings

# ====== STORAGE DEFINITIONS FIRST ======
# Platform-specific settings
current_platform = platform.system()
PRODUCT_IMAGES_ROOT = r'D:\elo05_product_images' if current_platform == 'Windows' else '/home/test/product_images'
os.makedirs(PRODUCT_IMAGES_ROOT, exist_ok=True)

class ProductImageStorage(FileSystemStorage):
    def __init__(self, location=None, base_url=None):
        if location is None:
            location = PRODUCT_IMAGES_ROOT
        super().__init__(location=location, base_url=base_url)

# ====== PATH FUNCTION ======
def product_image_directory_path(instance, filename):
    """File will be uploaded to PRODUCT_IMAGES_ROOT/product_<id>/<filename>"""
    return f'product_{instance.product_id}/{filename}'

# ====== MODELS ======
class Product(models.Model):
    name = models.CharField('Product Name', max_length=100)
    code = models.CharField('Product Code', max_length=30, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products_created',
        verbose_name='Created By'
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
        ordering = ['-created_at']

class ProductImage(models.Model):
    file = models.ImageField(
        upload_to=product_image_directory_path,
        storage=ProductImageStorage(),
        verbose_name='Image File'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Product'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='product_images',
        verbose_name='Created By'
    )

    def __str__(self):
        return f"Image {self.id} for Product {self.product_id}"

    class Meta:
        db_table = 'flowbit_productimage'
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'
        ordering = ['-created_at']
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
 