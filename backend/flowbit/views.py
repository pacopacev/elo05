from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer
from global_model import GlobalModel
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]  # For handling file uploads
    
    
    @action(detail=False, methods=['get'], url_path='search_product')
    def get_search_products(self, request):
        
        search = request.query_params.get('search') 
        if not search:
            return JsonResponse({'status': 'error', 'message': 'search is required'}, status=400)
        try:
            products = Product.objects.filter(name__icontains=search)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
    @action(detail=False, methods=['post'], url_path='del_product')
    def delete_product(self, request):
        
        id = request.data.get('product_id')
        where = {'id': id}
        where_product_id_images = {'product_id': id}
        if not id:
            return JsonResponse({'status': 'error', 'message': 'product_id is required'}, status=400)
        try:
            GlobalModel.delete_query('flowbit_productimage', where_product_id_images)
            GlobalModel.delete_query('flowbit_product', where)
            return JsonResponse({'status': 'success', 'message': f'Product with id {id} deleted successfully'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
        
        
        
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().prefetch_related('images'))
        search = request.query_params.get('search')
        
        if search:
            print(f"Search request received: {search}")
            queryset = queryset.filter(name__icontains=search)
        
        # Common pagination and serialization logic
        page = self.paginate_queryset(queryset)
        context = self.get_serializer_context()
        context['request'] = request
        
        if page is not None:
            serializer = self.get_serializer(page, many=True, context=context)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True, context=context)
        return Response(serializer.data)
                
            
            
            
            
            
    def create(self, request, *args, **kwargs):
        print("Request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            print("Creating new product")
            product = serializer.save(created_by=request.user)
            images = request.FILES.getlist('images', [])
            for image in images:
                ProductImage.objects.create(
                    product_id=product.id,
                    file=image,
                    created_by=request.user
                )
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        print("Updating existing product")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_product = serializer.save(created_by=request.user)
        images = request.FILES.getlist('images', [])
        for image in images:
            ProductImage.objects.create(
                product_id=updated_product.id,
                file=image,
                created_by=request.user
            )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'], url_path='add_product')
    def upload_images(self, request, pk=None):
        """
        Add images to existing product (using product_id from URL)
        """
        product = self.get_object()
        images = request.FILES.getlist('images', [])
        
        created_images = []
        for image in images:
            img = ProductImage.objects.create(
                product_id=product.id,  # Explicit product_id usage
                file=image,
                created_by=request.user
            )
            created_images.append(img.id)
            
        return Response(
            {
                'product_id': product.id,
                'created_images': created_images,
                'count': len(created_images)
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['GET'])
    def images(self, request, pk=None):
        """
        Get all images for a specific product_id
        """
        product = self.get_object()
        images = product.images.all()
        serializer = ProductImageSerializer(images, many=True, context={'request': request})
        return Response({
            'product_id': product.id,
            'images': serializer.data
        })

    def perform_create(self, serializer):
        """Auto-set created_by to current user"""
        serializer.save(created_by=self.request.user)
        
    
    