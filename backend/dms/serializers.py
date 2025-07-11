from rest_framework import serializers
from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'description', 'created_at']

class DocumentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentTag
        fields = ['id', 'name', 'slug']

class DocumentVersionSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentVersion
        fields = ['id', 'version_number', 'file', 'file_url', 'created_at', 
                 'created_by', 'changes', 'is_approved', 'file_size']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    current_version = DocumentVersionSerializer(read_only=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)
    tags = DocumentTagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'slug', 'description', 'document_type',
                 'created_at', 'updated_at', 'owner', 'category',
                 'current_version', 'versions', 'tags', 'is_public']

class DocumentCreateSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    changes = serializers.CharField(write_only=True)
    
    class Meta:
        model = Document
        fields = ['title', 'description', 'category', 'file', 'changes', 'is_public']
    
    def create(self, validated_data):
        file = validated_data.pop('file')
        changes = validated_data.pop('changes')
        request = self.context.get('request')
        
        document = Document.objects.create(
            owner=request.user,
            **validated_data
        )
        
        DocumentVersion.objects.create(
            document=document,
            file=file,
            changes=changes,
            created_by=request.user
        )
        
        return document

class DocumentAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentAccess
        fields = ['id', 'document', 'user', 'access_type', 'granted_at', 'expires_at']