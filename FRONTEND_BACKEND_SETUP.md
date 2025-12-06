# Frontend-Backend Connectivity Setup Guide

This guide will help you configure your Vercel frontend to connect to your Railway backend.

## Prerequisites

- Vercel account with deployed frontend: `home-bite-13041.vercel.app`
- Railway account with deployed backend: `web-production-ef53f.up.railway.app`
- Access to both Vercel and Railway dashboards

## Your Deployment URLs

- **Frontend:** `https://home-bite-13041.vercel.app`
- **Backend API:** `https://web-production-ef53f.up.railway.app/api`

---

## Step 1: Find Your Railway Backend URL

### Option A: From Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Navigate to your project (HomeBite)
3. Click on your **backend service**
4. Go to the **Settings** tab
5. Scroll down to **Networking** section
6. Look for **Public Domain** or **Custom Domain**
7. Copy the URL (it should look like one of these):
   - `https://your-service-name.up.railway.app`
   - `https://your-service-name.railway.app`
   - Or a custom domain if you've set one up

### Option B: From Railway Service Page

1. In Railway Dashboard, click on your backend service
2. Look at the top of the page for a **"Public Domain"** or **"Generate Domain"** button
3. If no domain is shown, click **"Generate Domain"** to create one
4. Copy the generated domain

### Option C: Check Railway Logs

1. In Railway Dashboard → Backend Service → **Deployments**
2. Click on the latest deployment
3. Check the **Logs** tab
4. Look for lines like:
   ```
   Listening on: https://your-service-name.up.railway.app
   ```

### Your Railway Backend URL

Your Railway backend API URL is:
```
https://web-production-ef53f.up.railway.app/api
```

**To verify this is correct:**
1. Go to Railway Dashboard → Your backend service → Settings → Networking
2. Check the Public Domain matches the above

---

## Step 2: Test Your Railway Backend

Before configuring the frontend, verify your backend is accessible:

### Test 1: Check API Root
```bash
curl https://web-production-ef53f.up.railway.app/api/
```

Expected response: JSON with API information

### Test 2: Check CSRF Endpoint
```bash
curl https://web-production-ef53f.up.railway.app/api/auth/csrf/
```

Expected response: `{"detail": "CSRF cookie set"}` or similar

### Test 3: Check in Browser
Open in your browser:
```
https://web-production-ef53f.up.railway.app/api/
```

You should see JSON response, not an error page.

---

## Step 3: Configure Vercel Environment Variables

### Step 3.1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com)
2. Navigate to your project: `home-bite-13041`
3. Click on **Settings** (top navigation)
4. Click on **Environment Variables** (left sidebar)

### Step 3.2: Add VITE_API_URL

1. Click **"Add New"** button
2. Fill in the form:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://web-production-ef53f.up.railway.app/api`
     - **Important:** Include `/api` at the end
   - **Environment:** Select **Production**, **Preview**, and **Development** (or at least Production)
3. Click **Save**

### Your Configuration

```
Name: VITE_API_URL
Value: https://web-production-ef53f.up.railway.app/api
Environment: Production, Preview, Development
```

### Step 3.3: Redeploy Frontend

After adding the environment variable:

1. Go to **Deployments** tab in Vercel
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (2-3 minutes)

**OR** simply push a new commit to trigger a new deployment.

---

## Step 4: Verify Configuration

### Step 4.1: Check Frontend Build

1. In Vercel Dashboard → **Deployments**
2. Click on the latest deployment
3. Check **Build Logs** to ensure build succeeded
4. Look for any errors related to environment variables

### Step 4.2: Test in Browser

1. Open your Vercel frontend: `https://home-bite-13041.vercel.app`
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Look for any API connection errors
5. Go to **Network** tab
6. Try to use the app (login, signup, etc.)
7. Check if API requests are going to your Railway backend:
   - Look for requests to `web-production-ef53f.up.railway.app`
   - Check if requests return 200/201 (success) or errors

### Step 4.3: Common Issues to Check

#### Issue: Requests still going to localhost
**Solution:** 
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure you redeployed after adding the variable
- Hard refresh browser (Ctrl+Shift+R)

#### Issue: CORS errors
**Solution:**
- Backend CORS is already configured to support all Vercel domains
- If you see CORS errors, check Railway backend is running
- Verify Railway backend has the latest code deployed

#### Issue: 401 Unauthorized
**Solution:**
- This is normal for unauthenticated requests
- Try logging in or signing up
- Check if CSRF token is being set (check cookies in DevTools)

#### Issue: 400 Bad Request
**Solution:**
- Check Railway backend logs for specific error
- Verify ALLOWED_HOSTS includes Railway domain
- Check if backend is receiving the requests

---

## Step 5: Railway Backend Configuration

Ensure your Railway backend has these environment variables set:

### Required Environment Variables

1. **SECRET_KEY**
   - A strong random secret key for Django
   - Generate one: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

2. **DEBUG**
   - Set to `False` for production

3. **ALLOWED_HOSTS**
   - Should include: `localhost,127.0.0.1,.vercel.app,.railway.app,.up.railway.app`
   - Or leave empty to use defaults (already configured in settings.py)

4. **DATABASE_URL**
   - Automatically set by Railway if you added PostgreSQL
   - Format: `postgresql://user:password@host:port/database`

### How to Set Railway Environment Variables

1. In Railway Dashboard → Backend Service
2. Go to **Variables** tab
3. Click **"New Variable"**
4. Add each variable:
   - **Name:** `SECRET_KEY`
   - **Value:** (your generated secret key)
5. Repeat for other variables
6. Railway will automatically redeploy

---

## Troubleshooting

### Problem: Frontend can't connect to backend

**Checklist:**
- [ ] Railway backend is running (check Railway dashboard)
- [ ] Railway backend URL is correct (test with curl)
- [ ] `VITE_API_URL` is set in Vercel
- [ ] Frontend was redeployed after setting `VITE_API_URL`
- [ ] Browser cache cleared (hard refresh)

### Problem: CORS errors in browser console

**Solution:**
- Backend CORS is configured to support all Vercel domains
- If errors persist, check Railway backend logs
- Verify backend has latest code with updated CORS settings

### Problem: CSRF token errors

**Solution:**
- CSRF is configured to trust all Vercel and Railway domains
- Check if cookies are being set (DevTools → Application → Cookies)
- Verify `withCredentials: true` in frontend API config (already set)

### Problem: 502 Bad Gateway

**Solution:**
- Railway backend might be down or crashed
- Check Railway logs for errors
- Verify database connection (if using PostgreSQL)
- Check if migrations ran successfully

### Problem: Environment variable not working

**Solution:**
- Vite environment variables must start with `VITE_`
- Variable name is case-sensitive: `VITE_API_URL` (not `vite_api_url`)
- Must redeploy after adding/changing environment variables
- Check Vercel build logs to verify variable is available

---

## Quick Reference

### Frontend API Configuration
- **File:** `frontend/src/services/api.js`
- **Base URL:** Uses `import.meta.env.VITE_API_URL`
- **Default:** `http://localhost:8000/api` (development only)

### Backend CORS Configuration
- **File:** `homebite/settings.py`
- **Supports:** All `*.vercel.app` domains (production, preview, branch)
- **Supports:** All `*.railway.app` and `*.up.railway.app` domains

### Backend CSRF Configuration
- **File:** `homebite/settings.py`
- **Trusts:** All Vercel and Railway domains
- **Supports:** Local development (localhost:3000, localhost:5173)

---

## Testing Checklist

After setup, verify:

- [ ] Railway backend is accessible via browser
- [ ] Railway backend API endpoints respond correctly
- [ ] `VITE_API_URL` is set in Vercel
- [ ] Frontend is redeployed with new environment variable
- [ ] Frontend can make API requests (check Network tab)
- [ ] No CORS errors in browser console
- [ ] Login/signup functionality works
- [ ] API requests show correct backend URL in Network tab

---

## Need Help?

If you're still experiencing issues:

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for red error messages
   - Check Network tab for failed requests

2. **Check Railway Logs:**
   - Railway Dashboard → Backend Service → Deployments
   - Click latest deployment → View Logs

3. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → Deployments
   - Click latest deployment → View Function Logs

4. **Verify URLs:**
   - Railway backend: `https://web-production-ef53f.up.railway.app/api/`
   - Vercel frontend: `https://home-bite-13041.vercel.app`
   - Environment variable: `VITE_API_URL=https://web-production-ef53f.up.railway.app/api`

---

**Last Updated:** Based on current project configuration
