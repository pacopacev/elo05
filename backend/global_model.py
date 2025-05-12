from datetime import datetime
from django.db import connection, DatabaseError

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

    def insert_query(table, params: dict):
        if not table or not params:
            raise ValueError("Table name and parameters are required")

        columns = ', '.join(params.keys())
        placeholders = ', '.join(['%s'] * len(params))
        values = list(params.values())

        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"

        with connection.cursor() as cursor:
            cursor.execute(query, values)
            return cursor.rowcount  # returns 1 if insert succeeded

    def delete_query(table: str, where: dict):
        if not table or not where:
            raise ValueError("Both table name and where clause are required")
        where_clause = ' AND '.join([f"{col} = %s" for col in where.keys()])
        values = list(where.values())
        query = f"DELETE FROM {table} WHERE {where_clause}"
        try:
            with connection.cursor() as cursor:
                cursor.execute(query, values)
                return cursor.rowcount  # Number of rows deleted
        except DatabaseError as e:
            print(f"Database error during delete: {e}")
            raise