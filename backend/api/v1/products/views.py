from rest_framework.decorators import api_view, permission_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ecommerce.models import Products, NewArrival, BestSeller, Order, OrderItem, UserProfile
from .serializers import ProductsSerializer, ProductDetailSerializer, NewArrivalSerializer, BestSellerSerializer, \
    CartSerializer, OrderSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions


@api_view(['GET'])
def products(request):
    instance = Products.objects.all()

    q = request.GET.get("q")
    if q:
        ids = q.split(",")
        instance = instance.filter(category__in=ids)

    context = {'request': request}
    serializer = ProductsSerializer(instance, context=context, many=True)

    response_data = {
        "data": serializer.data,
        "status_code": 6000,
    }
    return Response(response_data)


@api_view(["GET"])
def product(request, pk):
    instance = get_object_or_404(Products, pk=pk)
    context = {'request': request}
    serializer = ProductDetailSerializer(instance, context=context)

    response_data = {
        "data": serializer.data,
        "status_code": 6000,
    }
    return Response(response_data)


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
    context = {"request": request}
    serializer = CartSerializer(user_profile.items.all(), many=True, context=context)

    response_data = {
        "data": serializer.data,
        "status_code": 6000
    }
    return Response(response_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@csrf_exempt
def add_cart(request, pk):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    instance = get_object_or_404(Products, pk=pk)

    user_profile.items.add(instance)
    user_profile.save()

    serializer = CartSerializer(instance)

    response_data = {
        "status_code": 200,
        "message": "Added to Cart",
        "data": serializer.data
    }
    return Response(response_data, status=200)


@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_cart_item(request, pk):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    product_item = get_object_or_404(Products, pk=pk)

    user_profile.items.remove(product_item)

    response_data = {
        "status_code": 200,
        "message": "Item removed from cart"
    }
    return Response(response_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_products(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    if user_profile.user_type in ['SELLER', 'ADMIN']:
        serializer = ProductsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(seller=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    else:
        return Response({"message": "Permission denied"}, status=403)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def order_list(request):
    user_profile = get_object_or_404(UserProfile, user=request.user)
    if user_profile.user_type == 'ADMIN':
        orders = Order.objects.all()
    elif user_profile.user_type == 'SELLER':
        orders = Order.objects.filter(items__product__seller=request.user).distinct()
    else:
        orders = Order.objects.filter(user=request.user)

    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


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