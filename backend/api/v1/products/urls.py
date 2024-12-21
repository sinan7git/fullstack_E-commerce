from django.urls import path
from . import views


urlpatterns = [
    path('', views.products),
    path('view/<int:pk>', views.product),
    path('new_arrival/', views.new_arrival),
    path('best_seller/', views.best_seller),
    path("add_cart/<int:product_id>",views.add_cart),
    path("dele_cart/<int:pk>",views.delete_cart_item),
    path("add_products/",views.add_products),
    path('categories/', views.get_categories, name='categories'),
    path("cart/",views.cart),
    path("place_order/", views.place_order, name="place_order"),
    path('orders/', views.order_list, name='order_list'),
    path('orders/<int:pk>/', views.order_detail, name='order_detail'),
    path('analytics/seller/', views.seller_analytics, name='seller_analytics'),
    path('my-orders/', views.my_orders, name='my_orders'),
    path('cart/count/', views.get_cart_count, name='get_cart_count'),
    path('orders/<int:order_id>/update_status/', views.update_order_status, name='update_order_status'),
    path("products/<int:product_id>/edit/", views.edit_product, name="edit_product"),
    path("products/<int:product_id>/delete/", views.delete_product, name="delete_product"),
    path('update/profile/', views.update_profile, name='update_profile'),
]
