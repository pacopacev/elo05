# accounts/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User  # Add this import
from .serializers import UserSerializer
from global_model import GlobalModel
from django.db import connection
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from core.request import get_user_id
from django.http import JsonResponse


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]


    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            })
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class MenuListView(APIView, GlobalModel):
    authentication_classes = [TokenAuthentication]  # Ensure Token Authentication
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated
    def get(self, request):

        user_id = get_user_id()
        # user_id = GlobalModel.get_user_id(request)
        # print(f"Logged in User ID: {user_id}")  # This should print the user's ID

        def fetch_raw_sql(query, params=None):
            with connection.cursor() as cursor:
                cursor.execute(query, params or [])
                columns = [col[0] for col in cursor.description]
                return [dict(zip(columns, row)) for row in cursor.fetchall()]

        # Root Menus (parent_id is NULL)
        root_query = """
            SELECT DISTINCT m.id, m.title, m.icon, m.route, m.sort_order, m.is_active
            FROM accounts_menu m
            INNER JOIN user_access u ON u.menu_id = m.id
            WHERE m.parent_id IS NULL AND m.is_active = TRUE AND u.user_id = %s
            ORDER BY m.sort_order;
        """
        # Child Menus (parent_id is NOT NULL)
        child_query = """
            SELECT DISTINCT m.id, m.title, m.icon, m.route, m.sort_order, m.is_active, m.parent_id
            FROM accounts_menu m
            INNER JOIN user_access u ON u.menu_id = m.id
            WHERE m.parent_id IS NOT NULL AND m.is_active = TRUE AND u.user_id = %s
            ORDER BY m.sort_order;
        """
        root_menus = fetch_raw_sql(root_query, [user_id])
        child_menus = fetch_raw_sql(child_query, [user_id])

        # Map children under their parents
        menu_map = {menu['id']: {**menu, 'children': []} for menu in root_menus}
        for child in child_menus:
            parent_id = child['parent_id']
            if parent_id in menu_map:
                menu_map[parent_id]['children'].append(child)

        return Response(list(menu_map.values()))


def get_users(request):
    query = "SELECT id, username, email FROM auth_user ORDER BY id ASC"

    # Fetching data using the GlobalModel method
    data = GlobalModel.fetch_data_from_db(query)
    print(data)  # Optional: For debugging purposes

    return JsonResponse(data, safe=False)  # Return data as a JsonResponse


