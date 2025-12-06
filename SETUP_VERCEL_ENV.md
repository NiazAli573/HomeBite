# Quick Setup: Vercel Environment Variable

## Your Configuration

**Environment Variable to Set:**
```
Name: VITE_API_URL
Value: https://web-production-ef53f.up.railway.app/api
Environment: Production, Preview, Development
```

## Step-by-Step Instructions

### Method 1: Via Vercel Dashboard (Recommended)

1. **Open Vercel Dashboard:**
   - Go to: https://vercel.com/niazali573s-projects/home-bite-13041/settings/environment-variables
   - Or: Vercel Dashboard → Your Project → Settings → Environment Variables

2. **Add Environment Variable:**
   - Click **"Add New"** button
   - **Key:** `VITE_API_URL`
   - **Value:** `https://web-production-ef53f.up.railway.app/api`
   - **Environment:** Select all three:
     - ☑ Production
     - ☑ Preview  
     - ☑ Development
   - Click **"Save"**

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Wait 2-3 minutes

### Method 2: Via Vercel CLI

If you have Vercel CLI installed:

```bash
cd frontend
vercel env add VITE_API_URL
# When prompted, enter: https://web-production-ef53f.up.railway.app/api
# Select: Production, Preview, Development
vercel --prod
```

### Method 3: Via Git Push (Auto-deploy)

1. Set the environment variable in Vercel Dashboard (Method 1, steps 1-2)
2. Push any commit to trigger auto-deploy:
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy with env vars"
   git push
   ```

## Verify It's Set

1. **Check Vercel Dashboard:**
   - Settings → Environment Variables
   - Should see `VITE_API_URL` listed

2. **Check Build Logs:**
   - Deployments → Latest → Build Logs
   - Should not show errors about missing API URL

3. **Test in Browser:**
   - Open: https://home-bite-13041.vercel.app
   - Open DevTools (F12) → Console
   - Should not see errors about API connection
   - Check Network tab → API requests should go to Railway backend

## Troubleshooting

### Variable Not Working?
- ✅ Make sure variable name is exactly: `VITE_API_URL` (case-sensitive)
- ✅ Make sure value includes `/api` at the end
- ✅ Make sure you selected all environments (Production, Preview, Development)
- ✅ Make sure you redeployed after setting the variable
- ✅ Clear browser cache (Ctrl+Shift+R)

### Still Getting localhost Errors?
- The frontend code defaults to `http://localhost:8000/api` if `VITE_API_URL` is not set
- This means the environment variable is not being picked up
- Double-check it's set correctly in Vercel Dashboard
- Make sure you redeployed after setting it

---

**Once set, your frontend will automatically use the Railway backend!**
