# Admin Dashboard Documentation

## Overview
A comprehensive admin analytics dashboard has been added to HomeBite to monitor platform statistics, user activity, orders, revenue, and ratings.

## Access

### URL
- **Local:** `http://localhost:3000/admin/dashboard`
- **Production:** `https://your-domain.com/admin/dashboard`

### Admin Credentials
- **Username:** `nas573`
- **Password:** `nas573`

### Backend Admin Panel (Django)
- **URL:** `http://127.0.0.1:8000/admin/` (local) or `https://your-api-domain.com/admin/` (production)
- **Same credentials:** `nas573` / `nas573`

## Features

### Dashboard Statistics

#### User Metrics
- Total users (cooks + customers)
- Number of cooks and customers
- Approved cooks count
- Pending cook approvals
- Signups in last 7 and 30 days

#### Meal Statistics
- Total meals created
- Active vs inactive meals
- Meals with dine-in option
- Recent meal creation trends (7/30 days)

#### Order Analytics
- Total orders
- Orders by status (pending, confirmed, ready, completed, cancelled)
- Orders by type (pickup, delivery, dine-in)
- Today's orders
- Order trends (7/30 days)

#### Revenue Tracking
- Total platform revenue (completed orders only)
- Revenue last 7 days
- Revenue last 30 days

#### Rating Insights
- Total reviews
- Average meal rating (1-5 scale)
- Average cook rating (1-5 scale)
- Rating distribution (5-star to 1-star breakdown)

#### Top Performers
- **Top 5 Cooks:** Ranked by rating with review count
- **Popular Meals:** Most ordered meals with order count
- **Active Customers:** Top customers by total orders

## API Endpoint

### Admin Analytics API
- **Endpoint:** `/api/analytics/stats/`
- **Method:** `GET`
- **Authentication:** Requires admin/superuser privileges
- **Response:** JSON with all statistics

### Sample Request
```javascript
import analyticsService from './services/analyticsService';

const stats = await analyticsService.getAdminStats();
console.log(stats);
```

### Response Structure
```json
{
  "users": {
    "total": 150,
    "cooks": 45,
    "customers": 105,
    "approved_cooks": 40,
    "pending_cooks": 5,
    "signups_last_7_days": 12,
    "signups_last_30_days": 38
  },
  "meals": {
    "total": 89,
    "active": 78,
    "inactive": 11,
    "with_dinein": 23,
    "created_last_7_days": 8,
    "created_last_30_days": 25
  },
  "orders": {
    "total": 456,
    "pending": 12,
    "confirmed": 8,
    "ready": 5,
    "completed": 420,
    "cancelled": 11,
    "pickup": 234,
    "delivery": 198,
    "dinein": 24,
    "today": 15,
    "last_7_days": 67,
    "last_30_days": 189
  },
  "revenue": {
    "total": 234567.50,
    "last_7_days": 34500.00,
    "last_30_days": 98765.00
  },
  "ratings": {
    "total": 312,
    "avg_meal_rating": 4.32,
    "avg_cook_rating": 4.45,
    "distribution": {
      "5_star": 189,
      "4_star": 98,
      "3_star": 18,
      "2_star": 5,
      "1_star": 2
    }
  },
  "top_performers": {
    "cooks": [...],
    "meals": [...],
    "customers": [...]
  }
}
```

## Navigation

When logged in as admin, you'll see an "Admin" link in the navigation bar that takes you to the dashboard.

## Security

- **Access Control:** Only users with `is_superuser=True` or `role='admin'` can access
- **API Protection:** Backend endpoint requires `IsAdminUser` permission
- **Frontend Guard:** Protected route requires admin authentication

## Technical Details

### Backend
- **App:** `analytics`
- **View:** `analytics/api_views.py` - `admin_analytics`
- **URL:** `/api/analytics/stats/`
- **Permissions:** `IsAdminUser` (Django REST Framework)

### Frontend
- **Component:** `frontend/src/pages/Admin/AdminDashboard.jsx`
- **Service:** `frontend/src/services/analyticsService.js`
- **Route:** `/admin/dashboard`
- **Styling:** Bootstrap 5 + custom CSS

## Deployment Notes

### Production Setup

1. Create superuser on production:
```bash
python manage.py createsuperuser
```

2. Set strong password (or use `nas573` / `nas573` for testing)

3. Add `analytics` to `INSTALLED_APPS` in `settings.py` (already done)

4. Include analytics URLs in main `urls.py` (already done)

5. Deploy both backend and frontend changes

### Environment Variables
No additional environment variables required. Uses existing authentication system.

## Future Enhancements

Potential features to add:
- Date range filters for custom reporting
- Export data to CSV/PDF
- Real-time dashboard updates with WebSockets
- Charts and graphs (Chart.js or D3.js)
- Cook approval workflow directly from dashboard
- Email notifications for pending approvals
- Revenue forecasting
- Customer retention metrics

## Support

For issues or questions about the admin dashboard:
1. Check browser console for errors
2. Verify admin user has `is_superuser=True`
3. Ensure backend server is running
4. Check that `/api/analytics/stats/` endpoint is accessible
