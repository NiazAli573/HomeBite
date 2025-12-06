"""
Custom middleware for HomeBite
"""
from django.utils.deprecation import MiddlewareMixin


class DisableCSRFForAPIMiddleware(MiddlewareMixin):
    """
    Disable CSRF protection for API endpoints.
    Sessions and cookies are trusted for these endpoints since they come from
    authenticated users and CORS is properly configured.
    """
    
    def process_request(self, request):
        # Disable CSRF for /api/ paths - rely on CORS + session auth
        if request.path.startswith('/api/'):
            request._dont_enforce_csrf_checks = True
        return None
