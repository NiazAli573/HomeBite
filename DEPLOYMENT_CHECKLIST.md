# Deployment Checklist for Authentication Fix

## What Was Fixed

We fixed the "Authentication credentials were not provided" error that prevented cook accounts from signing in and creating meals on Vercel.

**Root Cause**: Session cookies were not being sent with cross-origin requests due to incorrect `SameSite` cookie settings.

**Solution**: Updated session and CSRF cookie configuration to support cross-origin authentication while maintaining security.

## Deployment Steps

### 1. Backend (Railway) - Deploy Updated Code

The backend code has been updated. Deploy it to Railway:

#### Option A: Automatic Deployment (If connected to GitHub)
1. Push these changes to your GitHub repository
2. Railway will automatically detect and deploy the changes
3. Wait 2-3 minutes for deployment to complete
4. Check Railway logs to ensure deployment succeeded

#### Option B: Manual Deployment
```bash
# Commit and push changes
git push origin main

# Or use Railway CLI
railway up
```

#### Verify Backend Environment Variables
Make sure these are set on Railway:
- ✅ `DEBUG=False` (or not set - defaults to False in production)
- ✅ `SECRET_KEY=<your-secret-key>` (required)
- ✅ `DATABASE_URL=<postgres-url>` (should be auto-configured)
- ✅ `ALLOWED_HOSTS=<your-domains>` (optional, has good defaults)

### 2. Frontend (Vercel) - No Code Changes Needed

The frontend code already supports session-based authentication correctly. Just verify environment variables:

#### Verify Frontend Environment Variable
1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project: `home-bite-13041`
3. Go to **Settings** → **Environment Variables**
4. Verify `VITE_API_URL` is set:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://web-production-ef53f.up.railway.app/api`
   - **Environments**: Production, Preview, Development (all checked)

If not set, add it and redeploy:
```bash
# No code changes needed - just redeploy
# Go to Deployments → Latest → "..." → "Redeploy"
```

### 3. Test the Fix

After deployment, test the authentication flow:

#### Test Sign In
1. Go to https://home-bite-13041.vercel.app
2. Sign in with a cook account
3. ✅ Should successfully sign in without errors
4. ✅ Should see the cook dashboard

#### Test Meal Creation
1. While logged in as a cook
2. Go to "Create Meal" or "Add Meal"
3. Fill in the meal details
4. Submit the form
5. ✅ Should successfully create the meal
6. ✅ Should NOT see "Authentication credentials were not provided" error

#### Verify Cookies in Browser DevTools
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Cookies** → `https://web-production-ef53f.up.railway.app`
4. Check for these cookies:
   - ✅ `sessionid` - Should have `SameSite=None; Secure`
   - ✅ `csrftoken` - Should have `SameSite=None; Secure`

## Troubleshooting

### Still Getting "Authentication credentials were not provided"?

#### 1. Clear Browser Cookies
Old cookies with incorrect settings may still be cached:
- **Chrome**: DevTools → Application → Cookies → Right-click → Clear
- **Or**: Use Incognito/Private mode for testing

#### 2. Check Backend Logs on Railway
```bash
# Via Railway CLI
railway logs

# Or via Railway Dashboard:
# Project → Backend Service → Deployments → View Logs
```

Look for:
- ✅ Successful deployment messages
- ❌ Any errors during startup
- ✅ Incoming API requests

#### 3. Check Browser Console
Open DevTools (F12) → Console tab:
- ❌ Look for CORS errors
- ❌ Look for 401/403 authentication errors
- ✅ API requests should return 200/201 status codes

#### 4. Check Network Requests
Open DevTools (F12) → Network tab:
1. Filter by "XHR" or "Fetch"
2. Sign in as a cook
3. Check the login request:
   - ✅ Response should include `Set-Cookie` headers
   - ✅ Status should be 200
4. Try creating a meal
5. Check the create meal request:
   - ✅ Request should include `Cookie` header with `sessionid`
   - ✅ Status should be 201 (created)

### Cookies Not Being Set?

#### Verify HTTPS
- ✅ Backend must use HTTPS (Railway provides this automatically)
- ✅ `SESSION_COOKIE_SECURE = True` in production (we set this based on DEBUG)

#### Verify CORS
- ✅ `CORS_ALLOW_CREDENTIALS = True` (already set in settings.py)
- ✅ Frontend is in `CORS_ALLOWED_ORIGINS` or matches regex (already configured)

#### Verify Frontend API Client
Check `frontend/src/services/api.js`:
- ✅ Should have `withCredentials: true` (already present)

## What Changed

### Files Modified
1. **`homebite/settings.py`**:
   - Updated `SESSION_COOKIE_SAMESITE` and `SESSION_COOKIE_SECURE`
   - Updated `CSRF_COOKIE_SAMESITE` and `CSRF_COOKIE_SECURE`
   - Added `SESSION_COOKIE_HTTPONLY`

### Files Added
1. **`AUTHENTICATION_FIX.md`** - Detailed technical explanation
2. **`DEPLOYMENT_CHECKLIST.md`** - This file

## Security Notes

✅ **These changes are secure**:
- SameSite=None only in production with HTTPS (Secure=True)
- CORS properly configured to allow only trusted origins
- CSRF protection remains active
- Session cookies are HttpOnly (prevents XSS)
- CodeQL security scan passed with 0 alerts

## Next Steps

1. ✅ Deploy backend to Railway (push code or use Railway CLI)
2. ✅ Verify frontend environment variable on Vercel
3. ✅ Test sign in as cook
4. ✅ Test meal creation
5. ✅ Verify cookies are set correctly
6. 🎉 Authentication should now work correctly!

## Need Help?

If issues persist:
1. Check the detailed guide in `AUTHENTICATION_FIX.md`
2. Review Railway logs for backend errors
3. Check browser DevTools for frontend errors
4. Verify all environment variables are set correctly

---

**Summary**: The code is ready. Just deploy to Railway and verify your environment variables!
