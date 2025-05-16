# Admin Integration Guide

This document explains how to connect your external admin page with the DessertPrint website.

## Overview

The DessertPrint website now includes a secure API that allows an external admin dashboard to connect and manage site content. This integration uses:

1. A secure API endpoint with admin authentication
2. CORS support for cross-origin requests
3. JWT token-based authentication

## API Endpoints

### Base URL

```
https://dessertprint.com/api/admin
```

### Authentication

All requests to the admin API must include an Authorization header with a valid JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To obtain a token, authenticate through the Supabase authentication system. Only users with admin privileges can access these endpoints.

### Available Resources

#### GET Requests

- `/api/admin?resource=products` - Get all products
- `/api/admin?resource=orders` - Get all orders
- `/api/admin?resource=users` - Get all users (limited information)
- `/api/admin?resource=stats` - Get site statistics

#### POST Requests

- `/api/admin?resource=products` - Create or update a product
- `/api/admin?resource=orders` - Update order status

#### DELETE Requests

- `/api/admin?resource=products&id=PRODUCT_ID` - Delete a product

## Implementation Steps

### 1. Set Up Authentication in Your Admin Dashboard

```javascript
// Example code for authenticating with Supabase
async function loginAdmin(email, password) {
  const response = await fetch('https://dessertprint.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  // Store the token securely
  localStorage.setItem('adminToken', data.token);
  return data;
}
```

### 2. Make API Requests

```javascript
// Example function to fetch products
async function getProducts() {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('https://dessertprint.com/api/admin?resource=products', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// Example function to update a product
async function updateProduct(productData) {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch('https://dessertprint.com/api/admin?resource=products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  
  return await response.json();
}
```

## Security Considerations

1. Always use HTTPS for all API requests
2. Store JWT tokens securely and implement token refresh
3. Implement rate limiting in your admin dashboard
4. Only request the data you need

## Troubleshooting

### Common Error Codes

- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Valid user but not an admin
- `400 Bad Request` - Invalid resource type or missing required fields
- `500 Internal Server Error` - Server-side error

### CORS Issues

If you encounter CORS issues, ensure your admin dashboard's domain is properly configured in the DessertPrint CORS settings. By default, the API accepts requests from any origin, but this can be restricted for security.

## Need Help?

Contact the development team at dev@dessertprint.com for assistance with API integration.