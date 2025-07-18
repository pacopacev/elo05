# accounts/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from global_model import GlobalModel
from django.db import connection
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from core.request import get_user_id
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
import os
from datetime import datetime
from django.conf import settings
from .models import UploadedImage
from django.contrib.auth.models import User

# user_id = get_user_id()



class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


    def post(self, request, *args, **kwargs):
        #print(2)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #print(3)


        user = serializer.save()
        self.initial_menu_for_new_registered_user(user)
        #print(4)


        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

    def initial_menu_for_new_registered_user(self, user):
        #print(user)
        if user:
            query_get_user_id = "SELECT id FROM auth_user WHERE username = %s"
            # print(query_get_user_id)
            data = GlobalModel.fetch_data_from_db(query_get_user_id, [user.username])
            user_id = data[0]['id']
            defult_menus = [3, 5]
            total_rows = 0

            for menu_id in defult_menus:
                insert_params = {
                    'user_id': user_id,
                    'menu_id': menu_id,
                    'created_at': timezone.now()  # Prefer Django's timezone-aware datetime
                }
                rows_inserted = GlobalModel.insert_query('user_access', insert_params)
                total_rows += rows_inserted
                print(total_rows)










@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def options(self, request, *args, **kwargs):
        """
        Handle OPTIONS preflight requests
        """
        response = Response()
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Max-Age'] = '86400'
        return response
    
    def post(self, request, *args, **kwargs):
        """
        Handle login requests with proper CORS headers
        """
        # Handle preflight for some browsers
        if request.method == 'OPTIONS':
            return self.options(request, *args, **kwargs)
            
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            insert_user_log(user.pk)
            response = Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username
            })
        else:
            response = Response(
                {'error': 'Invalid Credentials'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add CORS headers to response
        response['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
        response['Access-Control-Allow-Credentials'] = 'true'
        return response

class MenuListView(APIView, GlobalModel):
    # authentication_classes = [SessionAuthentication]
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
    query = "SELECT id, username, email, date_joined FROM auth_user ORDER BY id ASC"

    # Fetching data using the GlobalModel method
    data = GlobalModel.fetch_data_from_db(query)
    # print(data)  # Optional: For debugging purposes

    return JsonResponse(data, safe=False)  # Return data as a JsonResponse

def get_user_log(request):
    query = "SELECT id, user_id, email, created_at FROM user_log ORDER BY created_at DESC "
    # Fetching data using the GlobalModel method
    data = GlobalModel.fetch_data_from_db(query)
    # print(data)  # Optional: For debugging purposes
    return JsonResponse(data, safe=False)  # Return data as a JsonResponse

def insert_user_log(user_id):
    query_get_email = "SELECT email FROM auth_user WHERE id = %s"
    data = GlobalModel.fetch_data_from_db(query_get_email, [user_id])
    if data[0]['email'] =='':
        raise ValueError("User not found")
    email = data[0]['email']
    insert_params = {
        'user_id': user_id,
        'email': email,
        'created_at': timezone.now()  # Prefer Django's timezone-aware datetime
    }
    rows_inserted = GlobalModel.insert_query('user_log', insert_params)
    return Response({
        'rows_inserted': rows_inserted,
    })

@api_view(['POST'])
def del_user_log(request):
    id = request.data.get('sequence_id')
    where = {
        'id': id,
    }
    if not id:
        return JsonResponse({'status': 'error', 'message': 'user_id is required'}, status=400)
    # Prepare the raw SQL query to delete the user log
    try:
        GlobalModel.delete_query('user_log', where)
        return JsonResponse({'status': 'success', 'message': f'User log with id {id} deleted successfully'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    data = GlobalModel.get_logged_user()
    return Response(data)

@api_view(['POST'])
def update_account_info(request):
    user_id = request.data.get('id')

    if not user_id:
        return JsonResponse({'status': 'error', 'message': 'user_id is required'}, status=400)

    try:
        # Update user basic info
        GlobalModel.update_query(
            table='auth_user',
            updates={
                'username': request.data.get('username'),
                'email': request.data.get('email')
            },
            where={'id': user_id}
        )

        # Handle image upload
        file = request.FILES.get('file')
        if file:
            # Save file manually to D:\elo05_uploaded_images\user_<id>\
            upload_dir = os.path.join(settings.MEDIA_ROOT, f'user_{user_id}')
            print(f"upload_dir", upload_dir)
            os.makedirs(upload_dir, exist_ok=True)

            file_path = os.path.join(upload_dir, file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            # Save file path to DB
            UploadedImage.objects.create(
                file=file_path,
                user_id=user_id
            )

        return JsonResponse({'status': 'success', 'message': 'User info updated successfully.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    

 
        



