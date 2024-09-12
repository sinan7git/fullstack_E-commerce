from django.contrib import admin
from .models import Products, Category, NewArrival, BestSeller, Order, OrderItem, UserProfile

# Register your models here.

admin.site.register(Products)
admin.site.register(Category)
admin.site.register(NewArrival)
admin.site.register(BestSeller)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(UserProfile)