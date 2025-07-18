from rest_framework import serializers
from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class DocumentTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentTag
        fields = ['id', 'name']

class LightDocumentVersionSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = DocumentVersion
        fields = ['id', 'version_number', 'file_url', 'created_at']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class DocumentVersionSerializer(LightDocumentVersionSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta(LightDocumentVersionSerializer.Meta):
        fields = LightDocumentVersionSerializer.Meta.fields + [
            'created_by', 'changes', 'is_approved', 'file_size'
        ]

class DocumentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'slug', 'document_type', 'is_public', 'updated_at']

class DocumentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    current_version = LightDocumentVersionSerializer(read_only=True)
    tags = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = ['id', 'title', 'slug', 'description', 'document_type',
                 'created_at', 'updated_at', 'owner', 'category',
                 'current_version', 'tags', 'is_public']
    
    def get_tags(self, obj):
        return list(obj.tags.values_list('name', flat=True))

class DocumentDetailSerializer(DocumentSerializer):
    versions = LightDocumentVersionSerializer(many=True, read_only=True)
    
    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + ['versions']

class DocumentCreateSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)
    changes = serializers.CharField(write_only=True)
    
    class Meta:
        model = Document
        fields = ['title', 'description', 'category', 'file', 'changes', 'is_public']
    
    def create(self, validated_data):
        request = self.context.get('request')
        try:
            file = validated_data.pop('file')
            changes = validated_data.pop('changes')
            
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
        except Exception as e:
            raise serializers.ValidationError(
                "An error occurred while creating the document. Details: The title must be unique."
            ) from e

class DocumentAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentAccess
        fields = ['id', 'document', 'user', 'access_type', 'granted_at', 'expires_at']