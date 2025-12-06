# HomeBite Testing Guide

## Quick Test Steps

### 1. Create Superuser (if not already created)
```powershell
python manage.py createsuperuser
# Username: admin
# Email: admin@homebite.com
# Password: admin123
```

### 2. Access Admin Panel
- Go to: http://localhost:8000/admin
- Login with superuser credentials
- Create test data if needed

### 3. Test Customer Flow

#### A. Customer Signup
1. Go to http://localhost:3000/signup
2. Click "Sign up as Customer"
3. Fill in:
   - Username: customer1
   - Email: customer1@test.com
   - Password: Test123!
   - First Name: John
   - Last Name: Doe
   - Phone: 1234567890
   - Address: 123 Test St
4. Click "Sign Up"

#### B. Browse and Order
1. Login as customer1
2. Go to "Browse Meals"
3. Click on a meal to view details
4. Click "Order Now"
5. Select quantity and delivery type
6. Add special instructions
7. Submit order

#### C. View Orders
1. Go to "Order History"
2. Click "View Details" on an order
3. If pending, try to cancel
4. If completed, try to rate

### 4. Test Cook Flow

#### A. Cook Signup
1. Go to http://localhost:3000/signup
2. Click "Sign up as Cook"
3. Fill in:
   - Username: cook1
   - Email: cook1@test.com
   - Password: Test123!
   - First Name: Jane
   - Last Name: Smith
   - Phone: 0987654321
   - Address: 456 Cook Ave
   - Kitchen Location: Click on map to set location
4. Click "Sign Up"

#### B. Create Meal
1. Login as cook1
2. Go to "Cook Dashboard"
3. Click "Add New Meal" or go to "Create Meal"
4. Fill in:
   - Name: Test Biryani
   - Description: Delicious homemade biryani
   - Price: 250
   - Cuisine: Indian
   - Quantity Available: 10
   - Preparation Time: 30
   - Upload a photo (optional)
5. Click "Create Meal"

#### C. Manage Orders
1. Go to "Cook Dashboard"
2. View statistics (orders, revenue, etc.)
3. See recent orders table
4. Click status update buttons:
   - Pending → Confirmed
   - Confirmed → Ready
   - Ready → Completed

#### D. Manage Meals
1. Go to "My Meals"
2. Click "Edit" to update a meal
3. Click toggle to activate/deactivate
4. Click "Delete" to remove

---

## Common Issues and Fixes

### Issue: "Failed to load dashboard data"
**Fixed!** The following changes were made:
- ✅ Added `Order.objects.none()` return in OrderViewSet for users without profiles
- ✅ Added rating and review fields to Order model
- ✅ Updated OrderSerializer to include rating/review
- ✅ Added CSRF token endpoint
- ✅ Configured CSRF cookie settings
- ✅ Fixed mealService.getMyMeals() function name

### Issue: CSRF Token Missing
**Fixed!** CSRF token is now fetched on app initialization via `/api/auth/csrf/`

### Issue: 401 Unauthorized
- Make sure you're logged in
- Check that session cookie is being sent
- Try logging out and logging in again

### Issue: Cook can't create meals
**Fixed!** Added cook profile assignment in `perform_create` method

### Issue: Customer can't see orders
**Fixed!** Updated queryset filter to check user role properly

---

## API Endpoints to Test

### Authentication
- `GET /api/auth/csrf/` - Get CSRF token
- `GET /api/auth/user/` - Current user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/signup/customer/` - Customer signup
- `POST /api/auth/signup/cook/` - Cook signup

### Meals
- `GET /api/meals/` - List meals
- `GET /api/meals/{id}/` - Meal detail
- `POST /api/meals/` - Create meal (cook only)
- `PUT /api/meals/{id}/` - Update meal
- `DELETE /api/meals/{id}/` - Delete meal
- `GET /api/meals/my-meals/` - Cook's meals

### Orders
- `GET /api/orders/` - List orders (filtered by user)
- `GET /api/orders/{id}/` - Order detail
- `POST /api/orders/` - Create order (customer only)
- `PATCH /api/orders/{id}/` - Update status (cook only)
- `POST /api/orders/{id}/cancel/` - Cancel order
- `POST /api/orders/{id}/rate/` - Rate order

---

## Testing with curl (optional)

```powershell
# Get CSRF token
curl -c cookies.txt http://localhost:8000/api/auth/csrf/

# Login
curl -b cookies.txt -c cookies.txt -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d '{"username":"customer1","password":"Test123!"}'

# Get current user
curl -b cookies.txt http://localhost:8000/api/auth/user/

# List meals
curl http://localhost:8000/api/meals/

# Create order (need CSRF token from cookie)
curl -b cookies.txt -X POST http://localhost:8000/api/orders/ -H "Content-Type: application/json" -H "X-CSRFToken: <token>" -d '{"meal":1,"quantity":2,"delivery_type":"pickup","payment_method":"cash","notes":"Extra spicy"}'
```

---

## Verification Checklist

### Frontend
- [ ] Home page loads
- [ ] Can navigate between pages
- [ ] Login/Signup forms work
- [ ] Protected routes redirect to login
- [ ] Browse meals shows all meals
- [ ] Meal detail page shows full info
- [ ] Can create orders
- [ ] Order history displays
- [ ] Cook dashboard shows stats
- [ ] Can create/edit/delete meals
- [ ] Order status updates work

### Backend
- [ ] Django server running on port 8000
- [ ] Admin panel accessible
- [ ] API endpoints respond correctly
- [ ] CSRF protection working
- [ ] Authentication working
- [ ] Database queries optimized (select_related)
- [ ] Permissions enforced (customer/cook roles)

### Database
- [ ] Migrations applied
- [ ] Models created correctly
- [ ] Foreign keys working
- [ ] Signals working (if any)

---

## Next Steps After Testing

1. **Fix any bugs found** during testing
2. **Add more sample data** via admin or API
3. **Implement rating system** UI (currently backend ready)
4. **Add search and filters** to browse page
5. **Optimize images** (compression, thumbnails)
6. **Add notifications** for order status changes
7. **Improve error messages** throughout the app
8. **Add loading animations** and better UX
9. **Deploy to production** when ready

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check Django server terminal for errors
3. Verify database migrations are applied
4. Clear browser cookies and try again
5. Restart both servers

**All major issues have been fixed! The app should now work fully.** 🎉
