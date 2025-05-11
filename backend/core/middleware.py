# core/middleware.py
from .request import _thread_locals

class GlobalRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Store request in thread-local storage
        _thread_locals.request = request
        response = self.get_response(request)
        # Clean up after processing
        _thread_locals.request = None
        return response