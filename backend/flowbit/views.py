from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser
from .models import Product, ProductImage
from .serializers import ProductSerializer, ProductImageSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, JSONParser]  # For handling file uploads

    def create(self, request, *args, **kwargs):
        """
        Create product with optional images in single request
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Save product first to get product_id
            product = serializer.save(created_by=request.user)
            
            # Process images if included
            images = request.FILES.getlist('images', [])
            for image in images:
                ProductImage.objects.create(
                    product_id=product.id,  # Explicitly using product_id
                    file=image,
                    created_by=request.user
                )
                
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

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
        serializer = ProductImageSerializer(images, many=True)
        return Response({
            'product_id': product.id,
            'images': serializer.data
        })

    def perform_create(self, serializer):
        """Auto-set created_by to current user"""
        serializer.save(created_by=self.request.user)