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
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    seller = serializers.ReadOnlyField(source="seller.username")

    class Meta:
        model = Products
        fields = "__all__"

    def validate(self, data):
        # Ensure image is optional during partial updates
        if self.partial and "image" not in data:
            data["image"] = self.instance.image  # Retain the existing image if not updated

        # Ensure category is provided and is a valid primary key
        if "category" in data and not isinstance(data["category"], Category):
            raise serializers.ValidationError({"category": "Invalid category provided."})

        return data


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
        fields = ['id', 'product_name', 'quantity', 'price',]



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.ReadOnlyField(source='user.username')
    user_email = serializers.ReadOnlyField(source='user.email')
    user_profile = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'created_at', 'status', 'total_price', 'items',
            'user_name', 'user_email', 'user_profile'
        ]

    def get_user_profile(self, obj):
        profile = UserProfile.objects.filter(user=obj.user).first()
        if profile:
            return {
                "phone_number": profile.phone_number,
            }
        return {"phone_number": None, "address": None}


    

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 'street_address', 'city', 'state', 'postal_code', 'country'
        ]