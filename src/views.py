# serializers.py
from rest_framework import serializers
from .models import Supplier, Category, Product, StockMovement

class SupplierSerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email', 'phone', 'address', 
                 'status', 'created_at', 'updated_at', 'products_count']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductListSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock_quantity', 'image_url',
                 'supplier_name', 'category_name', 'status']

class ProductDetailSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), 
        write_only=True, 
        source='supplier'
    )
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), 
        write_only=True, 
        source='category',
        required=False
    )

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity',
                 'image_url', 'supplier', 'category', 'supplier_id',
                 'category_id', 'status', 'created_at', 'updated_at']

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'product_name', 'quantity', 'movement_type',
                 'reason', 'created_by', 'created_by_username', 'created_at']
        read_only_fields = ['created_by']

# views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from .models import Supplier, Category, Product, StockMovement
from .serializers import (
    SupplierSerializer, CategorySerializer,
    ProductListSerializer, ProductDetailSerializer,
    StockMovementSerializer
)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.annotate(
        products_count=Count('products')
    )
    serializer_class = SupplierSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'email']
    filterset_fields = ['status']

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('supplier', 'category')
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description', 'supplier__name']
    filterset_fields = ['status', 'supplier', 'category']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductDetailSerializer

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        serializer = StockMovementSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(
                product=product,
                created_by=request.user
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.select_related('product', 'created_by')
    serializer_class = StockMovementSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['product', 'movement_type']

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# urls.py
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    SupplierViewSet, CategoryViewSet,
    ProductViewSet, StockMovementViewSet
)

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'stock-movements', StockMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]