"""
Custom middleware for HomeBite
"""
from django.utils.deprecation import MiddlewareMixin
from rest_framework.authentication import SessionAuthentication


class DisableCSRFForAPIMiddleware(MiddlewareMixin):
    """
    Disable CSRF protection for API endpoints.
    
    This is necessary because:
    1. Frontend (Vercel) and Backend (Railway) are on different domains
    2. Cross-site cookies with SameSite=None are not reliably set by browsers
    3. We rely on CORS + session authentication instead of CSRF tokens
    4. CORS is properly configured to only allow requests from trusted origins
    """
    
    def process_request(self, request):
        # Disable CSRF for all API paths
        # Security is handled by CORS configuration which restricts origins
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None
    
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Double-check CSRF is disabled for API endpoints
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
        return None


class CsrfExemptSessionAuthentication(SessionAuthentication):
    """
    Session authentication without CSRF enforcement.
    
    Used for API endpoints where CORS provides security instead of CSRF tokens.
    This is necessary for cross-origin requests from Vercel to Railway.
    """
    
    def enforce_csrf(self, request):
        # Don't enforce CSRF for API requests
        # Security is provided by CORS configuration
        return None
