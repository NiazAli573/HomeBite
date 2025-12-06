# Deployment URLs - Quick Reference

## Your Deployment Domains

### Frontend (Vercel)
- **Production URL:** `https://home-bite-13041.vercel.app`
- **Vercel Dashboard:** https://vercel.com/niazali573s-projects/home-bite-13041

### Backend (Railway)
- **API Base URL:** `https://web-production-ef53f.up.railway.app`
- **API Endpoint:** `https://web-production-ef53f.up.railway.app/api`
- **Railway Dashboard:** https://railway.com/project/014f71cb-ea33-49c7-b8f1-f6316e384981/service/2a68640c-7e4d-48e4-888f-409e6fef1926

---

## Vercel Environment Variable

Set this in Vercel Dashboard → Settings → Environment Variables:

```
Name: VITE_API_URL
Value: https://web-production-ef53f.up.railway.app/api
Environment: Production, Preview, Development
```

---

## Quick Test Commands

### Test Backend API
```bash
curl https://web-production-ef53f.up.railway.app/api/
```

### Test CSRF Endpoint
```bash
curl https://web-production-ef53f.up.railway.app/api/auth/csrf/
```

### Test Frontend
Open in browser: `https://home-bite-13041.vercel.app`

---

## Next Steps

1. **Set Vercel Environment Variable:**
   - Go to: https://vercel.com/niazali573s-projects/home-bite-13041/settings/environment-variables
   - Add: `VITE_API_URL` = `https://web-production-ef53f.up.railway.app/api`
   - Redeploy frontend

2. **Deploy Backend Changes:**
   - Commit and push the updated `homebite/settings.py`
   - Railway will auto-deploy

3. **Test Connection:**
   - Open: https://home-bite-13041.vercel.app
   - Check browser console (F12) for errors
   - Try login/signup functionality
