# Railway PostgreSQL Setup Instructions

## Current Problem
Your Railway backend is using SQLite instead of PostgreSQL, so database tables don't exist. This causes "no such table: meals_meal" errors.

## Solution: Set Up PostgreSQL on Railway

### Step 1: Add PostgreSQL to Railway Project
1. Go to: https://railway.app
2. Log in to your account
3. Click on "HomeBite" project
4. Click "+ Create" (top right)
5. Search for "PostgreSQL"
6. Click "PostgreSQL" to add it

**Wait 1-2 minutes for PostgreSQL to start**

### Step 2: Get PostgreSQL Connection String
1. In Railway Dashboard, click on the "postgres" service
2. Go to "Connect" tab
3. Copy the connection string under "Railway SDK"

It should look like:
```
postgresql://username:password@hostname:5432/railway
```

### Step 3: Add DATABASE_URL to Backend Service
1. In Railway Dashboard, click on "backend" service
2. Go to "Variables" tab
3. Click "+ Add Variable"
4. Set:
   - **Variable name:** `DATABASE_URL`
   - **Value:** (paste the PostgreSQL connection string from Step 2)
5. Click "Add"

### Step 4: Redeploy Backend
1. In "backend" service, click "Settings" tab
2. Scroll down to "Deployments"
3. Click "Redeploy Latest" button
4. Wait 3-5 minutes for rebuild

**The Procfile will now automatically:**
- Run migrations with `python manage.py migrate --noinput`
- Create all database tables
- Start the Gunicorn server

### Step 5: Verify Deployment
Check the build logs:
1. Click on latest deployment
2. Go to "Build Logs" tab - should show:
   ```
   Running: python manage.py migrate --noinput
   Operations to perform:
     Apply all migrations: accounts, admin, auth, ...
   Running migrations:
     Applying accounts.0001_initial...
     Applying meals.0001_initial...
     ...
   ```
3. Go to "Deploy Logs" tab - should show:
   ```
   Starting gunicorn 23.0.0
   Listening at: http://0.0.0.0:8080
   ```

### Step 6: Test Signup
1. Open https://home-bite-13041.vercel.app
2. Click "Sign Up" → "Customer"
3. Fill in and submit the form
4. Should work without "no such table" errors ✓

## Troubleshooting

### If you see "PermissionError" or "FileNotFoundError"
- This is normal, the migration is running fine - check the next error

### If you see "FATAL: password authentication failed"
- The DATABASE_URL is incorrect
- Go back to Step 2 and copy again carefully
- Make sure there are no extra spaces

### If deployment keeps failing
1. Check the deploy logs for the exact error
2. Go to Railway Dashboard → backend → Deployments
3. Copy the error message and share it

### To manually run migrations
If needed, you can SSH into Railway:
```bash
railway shell
python manage.py migrate --noinput
```

## Files Modified
- `Procfile` - Added release command for migrations
- No other changes needed!

## Expected Result
After PostgreSQL is set up and redeploy is complete:
- ✓ Database tables will be created automatically
- ✓ Signup will work
- ✓ Meal browsing will work
- ✓ Orders will work
- ✓ No more "no such table" errors

---

**Quick Checklist:**
- [ ] PostgreSQL added to Railway project
- [ ] DATABASE_URL copied from PostgreSQL service
- [ ] DATABASE_URL added to backend variables
- [ ] Backend redeployed
- [ ] Deployment logs show "Applying all migrations"
- [ ] Tested signup on frontend

Once all checkboxes are done, your app should be fully functional!
