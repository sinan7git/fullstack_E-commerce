from rest_framework import serializers
from ecommerce.models import Products, NewArrival, BestSeller, Order, OrderItem, UserProfile, Category

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('user_type', 'phone_number', 'address')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class ProductsSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Products
        fields = ("id", "image", "name", "category", "price", "old_price", "seller")

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    seller = serializers.ReadOnlyField(source='seller.username')

    class Meta:
        model = Products
        fields = ("id", "image", "name", "category", "description", "review", "old_price", "price", "seller")

class NewArrivalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewArrival
        fields = ("id", "image", "name", "old_price", "price")

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ("id", "image", "name", "category", "description", "old_price", "price")

class BestSellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BestSeller
        fields = ("id", "image", "name", "old_price", "price")

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'status', 'items']