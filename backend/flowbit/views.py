from django.http import HttpResponse
from .serializers import ProductSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Product

# def index(request):
#     return HttpResponse("Hello from Flowbit!")


class ProductViewSet(viewsets.ModelViewSet):
    print(11)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Optional: Adjust permissions

    # Auto-set `created_by` to the current user on create
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)