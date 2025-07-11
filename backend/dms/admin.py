from django.contrib import admin
from .models import Category, Document, DocumentVersion, DocumentTag, DocumentAccess

class DocumentVersionInline(admin.StackedInline):
    model = DocumentVersion
    extra = 0
    readonly_fields = ['created_at', 'file_size']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'category', 'created_at']
    list_filter = ['category', 'document_type', 'created_at']
    search_fields = ['title', 'description']
    inlines = [DocumentVersionInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'created_at']
    list_filter = ['parent']
    search_fields = ['name']

@admin.register(DocumentTag)
class DocumentTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(DocumentAccess)
class DocumentAccessAdmin(admin.ModelAdmin):
    list_display = ['document', 'user', 'access_type', 'granted_at', 'expires_at']
    list_filter = ['access_type']
    search_fields = ['document__title', 'user__username']