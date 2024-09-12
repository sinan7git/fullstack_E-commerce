from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from ecommerce.models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction


@api_view(["POST"])
@permission_classes([AllowAny])
def create(request):
    email = request.data['email']
    password = request.data['password']
    name = request.data['name']
    user_type = request.data.get('user_type', 'CUSTOMER')

    if User.objects.filter(username=email).exists():
        return Response({
            "status_code": 6001,
            "message": "User already exists",
        })

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=name
            )

            user_profile, created = UserProfile.objects.get_or_create(user=user)
            user_profile.user_type = user_type
            user_profile.save()

            refresh = RefreshToken.for_user(user)

            return Response({
                "status_code": 6000,
                "message": "Account created",
                "data": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_type": user_type
                }
            })
    except Exception as e:
        return Response({
            "status_code": 6002,
            "message": f"An error occurred: {str(e)}",
        }, status=500)