from django.db import models
from django.contrib.auth.models import User
    
class Category(models.Model):
    name = models.CharField(max_length=255)
    
    class Meta:
        db_table = "products_category"
    verbose_name_plural = 'categories'
    
    def __str__(self):
        return self.name
    
    
class NewArrival(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="media/new/")
    price = models.FloatField()
    old_price = models.FloatField()
    
    def __str__(self):
        return self.name

    
class BestSeller(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="media/best/")
    price = models.FloatField()
    old_price = models.FloatField()
    
    def __str__(self):
        return self.name


class Products(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to="media/products/")
    price = models.FloatField()
    old_price = models.FloatField()
    stock = models.PositiveIntegerField(default=0)  # New field for stock
    description = models.TextField()
    review = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    add_cart = models.BooleanField(default=False)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', null=True)

    class Meta:
        permissions = (
            ("can_manage_products", "Can add and manage products"),
        )
        verbose_name_plural = 'products'

    def __str__(self):
        return self.name

    def is_in_stock(self):
        return self.stock > 0
    
    def decrease_stock(self, amount):
        if self.stock >= amount:
            self.stock -= amount
            self.save()
        else:
            raise ValueError("Not enough stock available.")

    


class Order(models.Model):
    ORDER_STATUS = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='Pending')
    total_price = models.FloatField(default=0.0)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='order_items')
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField()

    def save(self, *args, **kwargs):
        if not self.product_name:
            self.product_name = self.product.name  
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in Order {self.order.id}"


class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ('CUSTOMER', 'Customer'),
        ('SELLER', 'Product Provider'),
        ('ADMIN', 'Administrator'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='CUSTOMER')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    # Address Fields
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    cart_items = models.ManyToManyField('Products', blank=True, related_name='cart_users')

    def clear_cart(self):
        self.cart_items.clear()

    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"


