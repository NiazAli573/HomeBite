# HomeBite API Documentation

## Base URL
```
http://localhost:8000/api  (Development)
https://your-backend-domain.com/api  (Production)
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register as Customer
**POST** `/auth/register/customer/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+923001234567",
  "customer_type": "office_worker",
  "location_address": "123 Main Street, Karachi",
  "location_lat": 24.8607,
  "location_lng": 67.0011
}
```

**Customer Types:**
- `office_worker` - Office-based professionals needing meal delivery/pickup
- `hostel_student` - University hostel residents

**Response:** `201 Created`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Backward Compatibility Notes:**
The API accepts legacy field names (`office_address`, `office_location_lat`, `office_location_lng`) for backward compatibility. Use the new generic field names (`location_address`, `location_lat`, `location_lng`) for new implementations.

### Register as Cook
**POST** `/auth/register/cook/`

**Request Body:**
```json
{
  "username": "chef_mike",
  "password": "secure_password",
  "first_name": "Mike",
  "last_name": "Smith",
  "email": "mike@example.com",
  "phone": "+923001234567",
  "kitchen_address": "456 Cooking Lane, Karachi",
  "kitchen_location_lat": 24.8650,
  "kitchen_location_lng": 67.0100,
  "bio": "Home cook specializing in Pakistani cuisine",
  "specialization": "Pakistani"
}
```

**Response:** `201 Created`

### Login
**POST** `/auth/login/`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "user_type": "customer"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Logout
**POST** `/auth/logout/`

**Headers:** Requires authentication

**Response:** `200 OK`

---

## Meals Endpoints

### Get All Meals
**GET** `/meals/`

**Query Parameters:**
- `search` - Search by meal name
- `cook_id` - Filter by cook
- `max_price` - Filter by maximum price
- `nearby` - Set to "true" for nearby meals
- `latitude` - Required if nearby=true
- `longitude` - Required if nearby=true
- `distance` - Distance in km (default: 5)

**Response:** `200 OK`
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Chicken Biryani",
      "description": "Delicious chicken biryani",
      "price": 500,
      "quantity": 10,
      "cook": {
        "id": 1,
        "username": "chef_mike",
        "rating": 4.5
      },
      "location_lat": 24.8607,
      "location_lng": 67.0011,
      "image": "https://...",
      "created_at": "2025-12-06T10:00:00Z"
    }
  ]
}
```

### Get Meal Details
**GET** `/meals/{id}/`

**Response:** `200 OK`

### Create Meal (Cook only)
**POST** `/meals/`

**Headers:** Requires authentication (must be cook)

**Request Body:**
```json
{
  "name": "Chicken Karahi",
  "description": "Spicy chicken curry",
  "price": 450,
  "quantity": 15,
  "dine_with_us_available": true,
  "dine_price": 500,
  "image": "<multipart file>"
}
```

**Response:** `201 Created`

### Update Meal (Cook only)
**PUT** `/meals/{id}/`

**Headers:** Requires authentication

**Response:** `200 OK`

### Delete Meal (Cook only)
**DELETE** `/meals/{id}/`

**Headers:** Requires authentication

**Response:** `204 No Content`

---

## Orders Endpoints

### Get User Orders
**GET** `/orders/`

**Headers:** Requires authentication

**Query Parameters:**
- `status` - Filter by status (pending, confirmed, ready, completed, cancelled)

**Response:** `200 OK`
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "meal": {
        "id": 1,
        "name": "Chicken Biryani"
      },
      "quantity": 2,
      "delivery_type": "delivery",
      "delivery_address": "Office Address",
      "delivery_location_lat": 24.8607,
      "delivery_location_lng": 67.0011,
      "status": "pending",
      "total_price": 1000,
      "created_at": "2025-12-06T10:00:00Z"
    }
  ]
}
```

### Place Order
**POST** `/orders/`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "meal_id": 1,
  "quantity": 2,
  "delivery_type": "delivery",
  "delivery_address": "123 Office St",
  "delivery_location_lat": 24.8607,
  "delivery_location_lng": 67.0011,
  "special_instructions": "No onions please"
}
```

**Response:** `201 Created`

### Get Order Details
**GET** `/orders/{id}/`

**Headers:** Requires authentication

**Response:** `200 OK`

### Update Order Status (Cook only)
**PUT** `/orders/{id}/`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "status": "confirmed"  // or "ready", "completed"
}
```

**Response:** `200 OK`

### Cancel Order
**DELETE** `/orders/{id}/`

**Headers:** Requires authentication

**Response:** `204 No Content`

---

## Dashboard Endpoints

### Cook Dashboard
**GET** `/dashboard/cook/`

**Headers:** Requires authentication (must be cook)

**Response:** `200 OK`
```json
{
  "today_orders": 5,
  "today_earnings": 2500,
  "today_rating": 4.8,
  "pending_orders": 2,
  "confirmed_orders": 1,
  "ready_orders": 0,
  "completed_orders": 2,
  "total_orders": 150,
  "average_rating": 4.6,
  "total_reviews": 45
}
```

### Customer Dashboard
**GET** `/dashboard/customer/`

**Headers:** Requires authentication (must be customer)

**Response:** `200 OK`
```json
{
  "active_orders": 2,
  "completed_orders": 15,
  "total_spent": 7500,
  "orders_awaiting_rating": 3
}
```

---

## Ratings Endpoints

### Submit Rating
**POST** `/ratings/`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "order_id": 1,
  "meal_rating": 4,
  "cook_rating": 5,
  "meal_review": "Delicious!",
  "cook_review": "Great service"
}
```

**Response:** `201 Created`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication credentials were not provided"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- 100 requests per hour per IP address
- 50 requests per hour for authenticated users per endpoint

---

## Pagination

List endpoints support pagination with query parameters:
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20)

---

For more information, visit the [DEPLOYMENT.md](DEPLOYMENT.md) guide.
