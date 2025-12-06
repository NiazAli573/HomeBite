# Authentication Fix for Cross-Origin Requests

## Problem Statement

When cook accounts sign in on Vercel, they encountered the error:
```
Authentication credentials were not provided.
```

This prevented cooks from:
- Staying logged in after authentication
- Creating new meals
- Accessing cook-specific API endpoints

## Root Cause

The issue was caused by improper session cookie configuration for cross-origin requests:

1. **`SESSION_COOKIE_SAMESITE = 'Lax'`** - This setting prevented session cookies from being sent with cross-site POST requests (such as when the frontend on Vercel makes POST requests to the backend on Railway)

2. **Missing `SESSION_COOKIE_SECURE`** - Without this setting, browsers wouldn't accept `SameSite=None` cookies over HTTPS

3. **CSRF cookies had similar issues** - Same problem affected CSRF token validation

### Why This Happens

When your frontend is deployed on `*.vercel.app` and your backend is on `*.railway.app`, these are different domains (cross-origin). Modern browsers have strict cookie policies:

- **SameSite=Lax**: Cookies are sent with same-site requests and top-level navigation, but NOT with cross-site POST requests
- **SameSite=None**: Cookies are sent with all requests, but REQUIRES `Secure=True` (HTTPS only)

## Solution

Updated `homebite/settings.py` with environment-aware cookie configuration:

### Production Settings (DEBUG=False, HTTPS)
```python
SESSION_COOKIE_SAMESITE = 'None'     # Allow cross-origin
SESSION_COOKIE_SECURE = True         # Require HTTPS
CSRF_COOKIE_SAMESITE = 'None'        # Allow cross-origin
CSRF_COOKIE_SECURE = True            # Require HTTPS
```

### Development Settings (DEBUG=True, HTTP)
```python
SESSION_COOKIE_SAMESITE = 'Lax'      # More secure for local dev
SESSION_COOKIE_SECURE = False        # Allow HTTP
CSRF_COOKIE_SAMESITE = 'Lax'         # More secure for local dev
CSRF_COOKIE_SECURE = False           # Allow HTTP
```

## Security Considerations

These changes are secure because:

1. **SameSite=None only in production with HTTPS** - The `Secure` flag ensures cookies are only sent over encrypted connections

2. **CORS is properly configured** - The backend only accepts requests from trusted origins (configured in `CORS_ALLOWED_ORIGINS` and `CORS_ALLOWED_ORIGIN_REGEXES`)

3. **CSRF protection remains active** - The CSRF token is still required and validated for all state-changing requests

4. **Session cookies are HttpOnly** - `SESSION_COOKIE_HTTPONLY = True` prevents JavaScript from accessing session cookies, protecting against XSS attacks

## Deployment Instructions

### Backend (Railway)

The backend changes are already deployed when you push this code:

1. **No additional configuration needed** - The settings automatically detect production mode based on `DEBUG` environment variable

2. **Verify environment variables** on Railway:
   - `DEBUG=False` (or not set)
   - `SECRET_KEY=<your-secret-key>`
   - `DATABASE_URL=<your-postgres-url>`
   - `ALLOWED_HOSTS=<your-domains>`

### Frontend (Vercel)

No changes needed on the frontend - it already includes `withCredentials: true` in the API client configuration.

**Verify environment variables** on Vercel:
- `VITE_API_URL=https://web-production-ef53f.up.railway.app/api`

## Testing

After deployment, test the authentication flow:

1. **Sign up as a cook** on https://home-bite-13041.vercel.app
2. **Sign in** with your cook credentials
3. **Create a meal** - This should now work without "Authentication credentials were not provided" error
4. **Check browser DevTools**:
   - Network tab: Verify `Set-Cookie` headers are present in responses
   - Application/Storage tab: Verify `sessionid` and `csrftoken` cookies are set with `SameSite=None; Secure`

## Browser Console Debug

To verify cookies are being sent correctly:

```javascript
// In browser console
document.cookie  // Should show sessionid and csrftoken

// Check API request
fetch('https://web-production-ef53f.up.railway.app/api/auth/user/', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log)
```

## Troubleshooting

### Still getting "Authentication credentials were not provided"?

1. **Clear browser cookies** - Old cookies with wrong settings may still be cached
   - Chrome: DevTools → Application → Cookies → Delete all
   - Or use Incognito/Private mode

2. **Verify backend environment**:
   - Make sure `DEBUG=False` on Railway
   - Check Railway logs for any errors

3. **Check CORS configuration**:
   - Verify your frontend domain is in `CORS_ALLOWED_ORIGINS` or matches `CORS_ALLOWED_ORIGIN_REGEXES`

4. **Inspect Network requests**:
   - Open DevTools → Network tab
   - Look for `Set-Cookie` headers in login response
   - Verify `Cookie` headers are being sent in subsequent requests

### Cookies not being set?

1. **Check if backend is using HTTPS** - `Secure` cookies require HTTPS
2. **Verify `CORS_ALLOW_CREDENTIALS = True`** in settings.py
3. **Check frontend API client** has `withCredentials: true`

## References

- [MDN: SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Django CSRF protection](https://docs.djangoproject.com/en/4.2/ref/csrf/)
- [Django session settings](https://docs.djangoproject.com/en/4.2/ref/settings/#sessions)
- [CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
