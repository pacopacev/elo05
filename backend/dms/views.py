from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from .models import Document, DocumentVersion, Category, DocumentTag, DocumentAccess
from .serializers import (
    DocumentSerializer, DocumentCreateSerializer, DocumentVersionSerializer,
    CategorySerializer, DocumentTagSerializer, DocumentAccessSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        # from pprint import pprint
        # pprint(self.__dict__)
        if self.action == 'create':
            return DocumentCreateSerializer
        return DocumentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by owner or shared documents
        if not self.request.user.is_superuser:
            queryset = queryset.filter(
                models.Q(owner=self.request.user) |
                models.Q(accesses__user=self.request.user)
            ).distinct()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) |
                models.Q(description__icontains=search) |
                models.Q(versions__changes__icontains=search)
            ).distinct()
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def upload_version(self, request, pk=None):
        document = self.get_object()
        file = request.FILES.get('file')
        changes = request.data.get('changes', '')
     
        
        
        if not file:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_version = DocumentVersion.objects.create(
            document=document,
            file=file,
            changes=changes,
            created_by=request.user
        )
        
        document.current_version = new_version
        document.save()
        
        serializer = DocumentVersionSerializer(
            new_version,
            context={'request': request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        document = self.get_object()
        if not document.current_version:
            return Response(
                {'error': 'No version available'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        file = document.current_version.file
        response = FileResponse(file)
        response['Content-Disposition'] = f'attachment; filename="{file.name}"'
        return response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

class DocumentTagViewSet(viewsets.ModelViewSet):
    queryset = DocumentTag.objects.all()
    serializer_class = DocumentTagSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

class DocumentAccessViewSet(viewsets.ModelViewSet):
    queryset = DocumentAccess.objects.all()
    serializer_class = DocumentAccessSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        document_id = self.request.query_params.get('document')
        if document_id:
            queryset = queryset.filter(document_id=document_id)
        return queryset