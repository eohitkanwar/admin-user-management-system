# Pagination Documentation

## Overview
This backend now supports pagination for the `/api/auth/users` endpoint and can be easily extended to other endpoints.

## Usage

### Basic Pagination
```http
GET /api/auth/users?page=1&limit=10
```

### Query Parameters
- `page` (optional): Page number (default: 1, min: 1)
- `limit` (optional): Items per page (default: 10, min: 1, max: 100)

### Response Format
```json
{
  "success": true,
  "count": 10,
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 50,
  "itemsPerPage": 10,
  "hasNextPage": true,
  "hasPrevPage": false,
  "nextPage": 2,
  "prevPage": null,
  "users": [
    {
      "_id": "64f1234567890abcdef12345",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

## Examples

### Get First Page (Default)
```http
GET /api/auth/users
```

### Get Specific Page
```http
GET /api/auth/users?page=2&limit=5
```

### Get Large Page Size
```http
GET /api/auth/users?page=1&limit=50
```

## Error Handling

### Invalid Page Number
```http
GET /api/auth/users?page=0
```
Response:
```json
{
  "success": false,
  "message": "Page must be a positive integer"
}
```

### Invalid Limit
```http
GET /api/auth/users?limit=101
```
Response:
```json
{
  "success": false,
  "message": "Limit must be a positive integer (max 100)"
}
```

## Implementation Details

### Files Added/Modified:
1. **`utils/pagination.js`** - Pagination utility functions
2. **`middleware/paginationMiddleware.js`** - Validation middleware
3. **`routes/userRoutes.js`** - Added pagination middleware
4. **`controllers/authController.js`** - Updated getAllUsers function

### Reusable Components:
- `paginate()` - Main pagination utility
- `sendPaginatedResponse()` - Standardized response format
- `validatePagination()` - Query parameter validation

## Extending to Other Endpoints

To add pagination to other endpoints:

1. Import the utilities:
```javascript
import { paginate, sendPaginatedResponse } from "../utils/pagination.js";
```

2. Add validation middleware to routes:
```javascript
import { validatePagination } from '../middleware/paginationMiddleware.js';
router.get("/items", validatePagination, getItems);
```

3. Update controller:
```javascript
export const getItems = async (req, res) => {
  try {
    const result = await paginate(
      Item.find(),
      req,
      {
        select: "-sensitiveField",
        sort: { createdAt: -1 },
        populate: "relatedField"
      }
    );

    sendPaginatedResponse(res, result, { items: result.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
```
