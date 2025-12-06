# HomeBite Backend Connectivity Guide

## Issue Summary
Signup failed because the backend on Railway couldn't validate requests from the Vercel frontend due to ALLOWED_HOSTS and CORS misconfigurations.

## Root Causes Fixed ✓

### 1. ALLOWED_HOSTS Issue
**Problem:** Django rejects requests with unrecognized Host headers
**Fix Applied:**
```python
ALLOWED_HOSTS = os.environ.get(
    'ALLOWED_HOSTS',
    'localhost,127.0.0.1,.vercel.app,.railway.app,.up.railway.app'
).split(',')
```
This now includes:
- `localhost`, `127.0.0.1` - Local development
- `.vercel.app` - All Vercel deployments
- `.railway.app`, `.up.railway.app` - All Railway deployments

### 2. CORS Configuration
**Problem:** Frontend couldn't make cross-origin requests to backend
**Fix Applied:**
- Added wildcard Railway domains to CSRF_TRUSTED_ORIGINS
- Added CORS_ALLOW_HEADERS for proper header validation
- Added support for ADDITIONAL_CORS_ORIGINS environment variable

## Current Configuration

### Frontend (.env.production)
```
VITE_API_URL=https://web-production-ef53f.up.railway.app/api
```

### Backend (settings.py)
```python
# ALLOWED_HOSTS: Accepts requests from any vercel.app or railway.app domain
# CORS: Allows requests from localhost:5173, localhost:3000, and Vercel domain
# CSRF: Trusts Vercel domain and Railway wildcard domains
```

## How to Verify It's Working

### Step 1: Check Backend is Running
```bash
curl -I https://web-production-ef53f.up.railway.app/api/
# Should return: HTTP/2 400 (200 for root, 400 for auth endpoints - expected)
```

### Step 2: Check CSRF Endpoint
```bash
curl https://web-production-ef53f.up.railway.app/api/auth/csrf/
# Should return: {"detail": "CSRF cookie set"}
```

### Step 3: Test Signup in Frontend
1. Go to: https://home-bite-13041.vercel.app
2. Click "Sign Up" → "Customer"
3. Fill in the form:
   - Username: `testuser123`
   - Email: `test@yourdomain.com`
   - Password: `TestPass123!`
   - Phone: `+923001234567`
   - Address: `123 Test St, Karachi`
4. Click Submit

### Expected Success Response
- ✓ "Account created! Please login."
- ✓ Redirected to login page
- ✓ Can login with your credentials

## If Signup Still Fails

### Check 1: Verify Railway is Running
1. Go to: https://railway.app
2. Click on "HomeBite" project
3. Check the "backend" service status (should be "Running")
4. Check "Deployments" tab for recent builds

### Check 2: Check Browser Console (DevTools)
1. Open DevTools (F12)
2. Go to "Network" tab
3. Try signup again
4. Look for failed requests to `/api/auth/signup/customer/`
5. Click on the failed request → "Response" tab
6. Share the error message

### Check 3: View Railway Logs
1. Railway Dashboard → HomeBite → backend
2. Click "Deployments"
3. Click the latest deployment
4. View "Logs" tab for error messages

## Environment Variables on Railway

Your Railway backend should have these set:

```
DEBUG=False                              (production mode)
SECRET_KEY=<your-secret-key>           (set during deployment)
DATABASE_URL=<postgresql-connection>    (set by Railway)
ALLOWED_HOSTS=localhost,127.0.0.1,.vercel.app,.railway.app,.up.railway.app
```

## Local Testing (Your Machine)

If you want to test locally with the Railway database:

```bash
# 1. Create .env file with:
# DATABASE_URL=<get-from-railway-dashboard>
# DEBUG=True
# SECRET_KEY=your-secret-key

# 2. Run migrations (if needed)
python manage.py migrate

# 3. Start server
python manage.py runserver

# 4. Test in browser: http://localhost:5173 (if running frontend too)
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Railway service crashed - check logs |
| 400 Bad Request | ALLOWED_HOSTS mismatch - verify domain |
| CORS error | Frontend domain not in CORS_ALLOWED_ORIGINS |
| Database error | PostgreSQL not running or URL invalid |
| "Signup failed" | Check browser console for actual error message |

## Next Steps

1. **Wait 2-3 minutes** for Railway to rebuild and deploy
2. **Refresh your Vercel frontend** (hard refresh: Ctrl+Shift+R)
3. **Try signup again**
4. If still failing, **share the browser console error** with me

---

**Quick Test Command:**
```bash
# This should return valid JSON response
curl -X POST https://web-production-ef53f.up.railway.app/api/auth/signup/customer/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+923001234567",
    "customer_type": "office_worker"
  }'
```

Expected: HTTP 201 Created with user data
