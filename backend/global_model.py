from datetime import datetime
from django.db import connection

from rest_framework.exceptions import NotAuthenticated



class GlobalModel:


    @staticmethod
    def currentYear():
        current_year = datetime.now().year
        return current_year

    # def get_user_id(request):
    #     """
    #     Static method to get user ID from request
    #     Usage: user_id = GlobalModel.get_user_id(request)
    #     """
    #     if not request.user.is_authenticated:
    #         raise NotAuthenticated("User is not authenticated")
    #     return request.user.id

    def fetch_data_from_db(query, params=None):
        if params is None:
            params = []
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            columns = [col[0] for col in cursor.description]
            result = cursor.fetchall()
            return [dict(zip(columns, row)) for row in result]