# HomeBite Frontend - Vercel Deployment Guide

## Overview
Deploy the HomeBite React frontend to Vercel for fast, global CDN hosting with automatic deployments from GitHub.

## Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository with HomeBite project
- Backend deployed on Railway (already done ✓)

---

## Step 1: Connect GitHub to Vercel

### Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Import Project
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Search for "HomeBite"
4. Click "Import"

---

## Step 2: Configure Vercel Project Settings

### Framework Preset
- Framework: **Vite**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)
- Install Command: `npm install`

### Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL = https://web-production-ef53f.up.railway.app/api
```

**For Different Environments:**
- **Production**: `https://web-production-ef53f.up.railway.app/api`
- **Preview**: `https://web-production-ef53f.up.railway.app/api` (same backend for testing)
- **Development**: Leave empty (uses http://localhost:8000/api locally)

---

## Step 3: Configure Root Directory

Since frontend is in `/frontend` subdirectory:

1. In Vercel Project Settings
2. Go to "General"
3. Find "Root Directory"
4. Set to: `frontend`

---

## Step 4: Deploy

### Option A: Auto-Deploy (Recommended)
- Vercel automatically deploys every push to main branch
- No action needed - just push to GitHub!

### Option B: Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

---

## Step 5: Verify Deployment

After deployment completes:

1. **Visit Frontend**: `https://your-project.vercel.app`
2. **Check Deployments**: View logs in Vercel Dashboard
3. **Test API Connection**: 
   - Try logging in
   - Browse meals
   - Place an order

---

## Environment Variables Explained

### VITE_API_URL
Points frontend to backend API endpoint:
- **Local**: `http://localhost:8000/api` (development only)
- **Production**: `https://web-production-ef53f.up.railway.app/api` (Vercel)

The frontend automatically uses this URL for all API calls.

---

## Frontend Build Files

### .env.production
```
VITE_API_URL=https://web-production-ef53f.up.railway.app/api
```
Used when building for production (Vercel deployment)

### .env.development
```
VITE_API_URL=http://localhost:8000/api
```
Used for local development (npm run dev)

### vercel.json
Vercel-specific configuration:
- Build command
- Output directory
- Framework settings

---

## Deployment Flow

```
Git Push to main
        ↓
GitHub triggers Vercel webhook
        ↓
Vercel clones repository
        ↓
Installs dependencies (npm install)
        ↓
Builds React app (npm run build)
        ↓
Uploads dist/ to Vercel CDN
        ↓
Global distribution to 200+ edge locations
        ↓
App available at your-project.vercel.app
```

---

## Troubleshooting

### Blank Page / 404
- Check browser console for errors
- Verify VITE_API_URL is correct in Vercel dashboard
- Ensure backend is running and accessible

### API Connection Errors
- Verify Railway backend is online
- Check VITE_API_URL environment variable
- Test with: `curl https://web-production-ef53f.up.railway.app/api/meals/`

### Build Failures
```
# View build logs in Vercel Dashboard
# Check for:
- Missing dependencies
- Build errors in console
- Environment variables not set
```

### Slow Performance
- Check Vercel Analytics dashboard
- Enable compression in backend
- Optimize images before uploading

---

## Custom Domain (Optional)

1. In Vercel Project Settings → Domains
2. Click "Add Domain"
3. Enter your custom domain
4. Follow DNS configuration steps

---

## Production Checklist

✅ **Before Production Deployment:**
- [ ] Backend deployed on Railway
- [ ] VITE_API_URL points to Railway backend
- [ ] Environment variables set in Vercel
- [ ] CORS enabled on Django backend
- [ ] Frontend .env files committed to git
- [ ] All tests passing locally
- [ ] GitHub main branch is stable
- [ ] Deployed frontend can connect to backend

✅ **After Deployment:**
- [ ] Visit production URL
- [ ] Test user signup/login
- [ ] Browse meals
- [ ] Place test order
- [ ] Check console for errors
- [ ] Monitor Vercel dashboard

---

## Monitoring & Logs

### Vercel Dashboard
- Real-time deployment logs
- Performance analytics
- Error tracking
- Function execution logs

### View Deployment Logs
```bash
# Using Vercel CLI
vercel logs
```

### Monitor Frontend Errors
1. Vercel Dashboard → Analytics
2. Check for JavaScript errors
3. Review Core Web Vitals

---

## Automatic Deployments

### Trigger Options
- Every push to `main` branch
- Pull request previews (optional)
- Manual redeploy from dashboard

### Disable Auto-Deploy (if needed)
Vercel Dashboard → Settings → Git → Uncheck "Automatic Deployments"

---

## Next Steps

1. ✅ Configure environment variables in Vercel
2. ✅ Set root directory to `frontend`
3. ✅ Push to GitHub (triggers auto-deploy)
4. ✅ Wait for deployment to complete
5. ✅ Visit your live app URL
6. ✅ Test all features with production backend
7. Monitor performance and errors
8. Set up custom domain (optional)

---

## Useful Links

- **Vercel Docs**: https://vercel.com/docs
- **Vite Guide**: https://vitejs.dev/guide/
- **React Deployment**: https://react.dev/learn/deployment
- **Your Frontend URL**: Will be assigned after first deployment
- **Your Backend URL**: https://web-production-ef53f.up.railway.app/api

---

## Common Issues & Solutions

### "Root Directory is not valid"
- Ensure root directory is set to `frontend`
- Check folder structure in GitHub

### "VITE_API_URL is undefined"
- Add VITE_API_URL to Vercel environment variables
- Restart deployment after adding variables

### CORS Errors
- Backend CORS_ALLOWED_ORIGINS must include Vercel domain
- Update in Railway environment variables

### Build Times Too Long
- Check if node_modules being installed
- Consider using `pnpm` instead of `npm` for faster builds

---

For questions or issues during deployment, check:
1. Vercel build logs
2. Browser console (F12)
3. Network tab in DevTools
4. Backend logs on Railway
