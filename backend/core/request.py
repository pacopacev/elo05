# core/request.py
from threading import local
from django.core.exceptions import PermissionDenied

_thread_locals = local()

def get_request():
    """Retrieve the request object from thread-local storage"""
    return getattr(_thread_locals, 'request', None)

def get_user_id():
    """Get current user ID globally"""
    request = get_request()
    if not request or not request.user.is_authenticated:
        raise PermissionDenied("User not authenticated")
    print(request.user.id)
    return request.user.id