from rest_framework.decorators import api_view, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ecommerce.models import Products, NewArrival, BestSeller, Order, OrderItem, UserProfile, Category
from .serializers import ProductsSerializer, ProductDetailSerializer, NewArrivalSerializer, BestSellerSerializer, \
    CartSerializer, OrderSerializer, CategorySerializer,UserProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from django.db.models import Sum, Count, F


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Enforce authentication
def products(request):
    if request.user.profile.user_type == 'SELLER':
        queryset = Products.objects.filter(seller=request.user)
    else:
        queryset = Products.objects.all()

    serializer = ProductsSerializer(queryset, many=True)
    return Response({"data": serializer.data})


@api_view(["GET"])
def product(request, pk):
    instance = get_object_or_404(Products, pk=pk)
    serializer = ProductDetailSerializer(instance)
    return Response({"data": serializer.data})


@api_view(['GET'])
def new_arrival(request):
    instance = NewArrival.objects.all()
    context = {'request': request}
    serializers = NewArrivalSerializer(instance, context=context, many=True)

    response_data = {
        "data": serializers.data,
        "status_code": 6000,
    }
    return Response(response_data)


@api_view(['GET'])
def best_seller(request):
    instance = BestSeller.objects.all()
    context = {'request': request}
    serializers = BestSellerSerializer(instance, context=context, many=True)

    response_data = {
        "data": serializers.data,
        "status_code": 6000,
    }
    return Response(response_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    cart_items = user_profile.cart_items.all()
    serializer = CartSerializer(cart_items, many=True)

    return Response({"cart_items": serializer.data}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def add_cart(request, product_id):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    product = get_object_or_404(Products, id=product_id)

    if not product.is_in_stock():
        return Response({"error": "Product is out of stock."}, status=400)

    user_profile.cart_items.add(product)
    user_profile.save()
    cart_count = user_profile.cart_items.count()

    serializer = CartSerializer(product)
    return Response(
        {"message": "Product added to cart.",
        "product": serializer.data,
        "cart_count": cart_count,
        }
        , status=200)


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, product_id):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    product = get_object_or_404(Products, id=product_id)

    user_profile.cart_items.remove(product)
    user_profile.save()

    response_data = {
        "status_code": 200,
        "message": "Item removed from cart"
    }
    return Response(response_data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_products(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)

    if user_profile.user_type not in ['SELLER', 'ADMIN']:
        return Response({"message": "Permission denied"}, status=403)

    serializer = ProductsSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(seller=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_list(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)

    if user_profile.user_type == 'SELLER':
        orders = Order.objects.filter(items__product__seller=request.user).distinct()
    elif user_profile.user_type == 'CUSTOMER':
        orders = Order.objects.filter(user=request.user)
    elif user_profile.user_type == 'ADMIN':
        orders = Order.objects.all()
    else:
        return Response({'error': 'Permission denied'}, status=403)

    serializer = OrderSerializer(orders, many=True)
    return Response({"orders": serializer.data})



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_detail(request, order_id):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    order = get_object_or_404(Order, pk=order_id)

    if user_profile.user_type == 'ADMIN' or \
            (user_profile.user_type == 'SELLER' and order.items.filter(product__seller=request.user).exists()) or \
            (user_profile.user_type == 'CUSTOMER' and order.user == request.user):
        serializer = OrderSerializer(order)
        return Response(serializer.data)
    else:
        return Response({'error': 'You do not have permission to view this order'}, status=403)


@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_order(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    cart_items = user_profile.cart_items.all()

    if not cart_items.exists():
        return Response({"error": "Your cart is empty."}, status=400)

    try:
        # Create and save the order instance
        order = Order.objects.create(user=request.user)

        # Initialize total price
        total_price = 0

        # Create order items for each cart item
        for product in cart_items:
            if product.stock < 1:
                return Response({"error": f"Product '{product.name}' is out of stock."}, status=400)

            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,  # Save the product name
                price=product.price,        # Save the product price
                quantity=1                  # Default quantity
            )

            # Add to total price
            total_price += order_item.price * order_item.quantity

            # Reduce stock
            product.stock -= order_item.quantity
            product.save()

        # Update order with the calculated total price
        order.total_price = total_price
        order.save()

        # Clear the cart after placing the order
        user_profile.cart_items.clear()

        return Response({"message": "Order placed successfully!", "order_id": order.id}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def seller_analytics(request):
    user_profile = request.user.profile

    if user_profile.user_type != "SELLER":
        return Response({"error": "Permission denied"}, status=403)

    # Total Revenue
    total_revenue = OrderItem.objects.filter(product__seller=request.user).aggregate(
        total=Sum(F('price') * F('quantity'))
    )['total'] or 0.0

    # Total Orders
    total_orders = Order.objects.filter(items__product__seller=request.user).distinct().count()

    # Best Selling Products
    best_selling_products = OrderItem.objects.filter(product__seller=request.user) \
        .values('product__name') \
        .annotate(quantity_sold=Sum('quantity'), revenue=Sum(F('price') * F('quantity'))) \
        .order_by('-quantity_sold')[:5]

    # Revenue Over Time
    revenue_over_time = Order.objects.filter(items__product__seller=request.user) \
        .annotate(day=F('created_at__date')) \
        .values('day') \
        .annotate(daily_revenue=Sum('total_price')) \
        .order_by('day')

    # Order Status Breakdown
    order_status_breakdown = Order.objects.filter(items__product__seller=request.user) \
        .values('status') \
        .annotate(count=Count('id'))

    # Customer Insights
    unique_customers = Order.objects.filter(items__product__seller=request.user).values('user').distinct().count()
    repeat_customers = Order.objects.filter(items__product__seller=request.user).values('user') \
        .annotate(order_count=Count('id')).filter(order_count__gt=1).count()

    repeat_customer_rate = (repeat_customers / unique_customers) * 100 if unique_customers > 0 else 0

    return Response({
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "best_selling_products": list(best_selling_products),
        "revenue_over_time": list(revenue_over_time),
        "order_status_breakdown": list(order_status_breakdown),
        "customer_count": unique_customers,
        "repeat_customer_rate": repeat_customer_rate,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')  # Most recent orders first
    serializer = OrderSerializer(orders, many=True)
    return Response({"orders": serializer.data})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart_count(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    cart_count = user_profile.cart_items.count()
    return Response({"cart_count": cart_count}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    # Fetch the order and the user's profile
    order = get_object_or_404(Order, id=order_id)
    user_profile = get_object_or_404(UserProfile, user=request.user)

    # Only sellers or admins can update statuses
    if user_profile.user_type not in ['SELLER', 'ADMIN']:
        return Response({"error": "Permission denied"}, status=403)

    # Get the new status from the request data
    new_status = request.data.get("status")
    if not new_status:
        return Response({"error": "No status provided."}, status=400)

    # Define valid status transitions
    valid_transitions = {
        "Pending": ["Processing", "Cancelled"],
        "Processing": ["Shipped", "Cancelled"],
        "Shipped": ["Delivered"],
        "Delivered": [],  # No further transitions allowed
        "Cancelled": [],  # Cannot transition from Cancelled
    }

    # Check if the transition is valid
    if new_status not in valid_transitions.get(order.status, []):
        return Response(
            {"error": f"Invalid transition from {order.status} to {new_status}."},
            status=400,
        )

    # Update the status
    order.status = new_status
    order.save()

    return Response({"message": f"Order status updated to {new_status}."}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    # Ensure the user is the owner of the order
    if order.user != request.user:
        return Response({"error": "You are not authorized to cancel this order."}, status=403)

    # Only allow cancellation if the order is not already shipped or delivered
    if order.status in ['Shipped', 'Delivered']:
        return Response({"error": "Order cannot be cancelled at this stage."}, status=400)

    # Update the status to Cancelled
    order.status = 'Cancelled'
    order.save()

    return Response({"message": "Order has been cancelled successfully."})


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def edit_product(request, product_id):
    # Get the product
    product = get_object_or_404(Products, id=product_id)

    # Ensure the seller owns the product
    if product.seller != request.user:
        return Response({"error": "You are not authorized to edit this product."}, status=403)

    # Update the product with partial=True
    serializer = ProductsSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Product updated successfully!", "data": serializer.data}, status=200)

    return Response(serializer.errors, status=400)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    # Get the product
    product = get_object_or_404(Products, id=product_id)

    # Ensure the seller owns the product
    if product.seller != request.user:
        return Response({"error": "You are not authorized to delete this product."}, status=403)

    # Delete the product
    product.delete()
    return Response({"message": "Product deleted successfully."}, status=200)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)

        if request.method == 'GET':
            # Return current profile data
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)

        elif request.method == 'PUT':
            # Update profile data
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Profile updated successfully!", "data": serializer.data}, status=200)
            return Response(serializer.errors, status=400)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found."}, status=404)