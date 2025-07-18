
from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.text import slugify
from django.conf import settings

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, 
                             null=True, blank=True, related_name='children')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('dms:category-detail', kwargs={'slug': self.slug})

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('pdf', 'PDF'),
        ('doc', 'Word'),
        ('xls', 'Excel'),
        ('ppt', 'PowerPoint'),
        ('img', 'Image'),
        ('txt', 'Text'),
        ('other', 'Other'),
    )
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    document_type = models.CharField(max_length=10, choices=DOCUMENT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, 
                               null=True, blank=True, related_name='documents')
    current_version = models.ForeignKey('DocumentVersion', on_delete=models.SET_NULL, 
                                      null=True, blank=True, related_name='current_for_document')
    is_public = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('dms:document-detail', kwargs={'slug': self.slug})
    
    def get_download_url(self):
        return reverse('dms:document-download', kwargs={'slug': self.slug})

class DocumentVersion(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    file = models.FileField(upload_to='flowbit_uploaded_documents/%Y/%m/%d/')
    version_number = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    changes = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    file_size = models.PositiveIntegerField(editable=False)
    checksum = models.CharField(max_length=64, editable=False)
    
    class Meta:
        unique_together = ('document', 'version_number')
        ordering = ['-version_number']
    
    def __str__(self):
        return f"{self.document.title} {self.version_number}"
    
    def save(self, *args, **kwargs):
        print("Saving DocumentVersion:", self.document.title, "v", self.version_number)
        if not self.version_number:
            
            last_version = self.document.versions.order_by('-version_number').first()
            if last_version:
                self.version_number = last_version.version_number + 1
            else:
                self.version_number = 1
        # Calculate file size and checksum
        if self.file and not self.pk:
            self.file_size = self.file.size
            # You can add checksum calculation here
        
        super().save(*args, **kwargs)
        
        # Update document's current version if this is the first version
        if not self.document.current_version:
            self.document.current_version = self
            self.document.save()

class DocumentTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    documents = models.ManyToManyField(Document, related_name='tags')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class DocumentAccess(models.Model):
    ACCESS_TYPES = (
        ('view', 'View'),
        ('edit', 'Edit'),
        ('share', 'Share'),
    )
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='accesses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='document_accesses')
    access_type = models.CharField(max_length=10, choices=ACCESS_TYPES)
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='granted_accesses')
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ('document', 'user', 'access_type')
    
    def __str__(self):
        return f"{self.user} can {self.access_type} {self.document}"

