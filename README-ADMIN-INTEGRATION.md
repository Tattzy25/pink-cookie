# Connecting External Admin Page with DessertPrint

## Overview

This document explains how to connect your external admin dashboard with the DessertPrint website. We've implemented a secure API system that allows your admin dashboard to interact with the main site's data.

## What You Need to Provide

To successfully connect your admin dashboard to the DessertPrint website, you'll need to provide the following:

1. **Admin Credentials**:
   - Admin email address (must be registered in our system with admin privileges)
   - Admin password

2. **Admin Dashboard Information**:
   - Your admin dashboard URL/domain (for CORS configuration)
   - Expected request origins (if different from your main dashboard URL)
   - IP addresses that will access our API (for additional security)

3. **Technical Contact**:
   - Name and email of your technical contact for troubleshooting
   - Preferred communication method for urgent issues

4. **API Key Requirements** (if applicable):
   - Purpose of integration (which resources you need to access)
   - Expected request volume
   - Security measures implemented on your side

Please send this information securely to our development team at dev@dessertprint.com. We'll set up the necessary configurations on our end and provide you with any additional credentials needed.

## Integration Architecture

1. **Authentication**: JWT token-based authentication via Supabase
2. **API Endpoints**: RESTful API endpoints for managing site content
3. **CORS Support**: Cross-origin resource sharing enabled for external admin access

## Available Endpoints

### Authentication

```
POST /api/auth/admin-login
```

This endpoint authenticates admin users and provides a JWT token for API access.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Data Management

All data management endpoints require an Authorization header with the JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Products

- `GET /api/admin?resource=products` - Get all products
- `POST /api/admin?resource=products` - Create or update a product
- `DELETE /api/admin?resource=products&id=PRODUCT_ID` - Delete a product

#### Orders

- `GET /api/admin?resource=orders` - Get all orders
- `POST /api/admin?resource=orders` - Update order status

#### Users

- `GET /api/admin?resource=users` - Get all users (limited information)

#### Statistics

- `GET /api/admin?resource=stats` - Get site statistics

## Implementation Steps

### 1. Authentication

```javascript
async function loginAdmin(email, password) {
  const response = await fetch('https://dessertprint.com/api/auth/admin-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (response.ok) {
    // Store the token securely
    localStorage.setItem('adminToken', data.token);
    return data;
  } else {
    throw new Error(data.error || 'Authentication failed');
  }
}
```

### 2. Making API Requests

```javascript
async function fetchAdminData(resource) {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`https://dessertprint.com/api/admin?resource=${resource}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch ${resource}`);
  }
  
  return data;
}

async function updateResource(resource, data) {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`https://dessertprint.com/api/admin?resource=${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || `Failed to update ${resource}`);
  }
  
  return responseData;
}

async function deleteResource(resource, id) {
  const token = localStorage.getItem('adminToken');
  if (!token) throw new Error('Not authenticated');
  
  const response = await fetch(`https://dessertprint.com/api/admin?resource=${resource}&id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Failed to delete ${resource}`);
  }
  
  return data;
}
```

## Security Considerations

1. Always use HTTPS for all API requests
2. Implement token refresh mechanisms
3. Store JWT tokens securely (HttpOnly cookies or secure storage)
4. Implement proper error handling and logging
5. Consider implementing rate limiting on your admin dashboard
6. Do not hardcode credentials in your frontend code
7. Implement proper user session management and timeouts
8. Use environment variables for storing sensitive configuration

## Integration Process

1. **Request Access**: Send your admin dashboard information to dev@dessertprint.com
2. **Receive Credentials**: We'll provide you with admin API credentials
3. **CORS Configuration**: We'll add your domain to our allowed origins list
4. **Implement Authentication**: Use the provided code examples to implement authentication
5. **Test Integration**: Test your integration with our staging environment
6. **Go Live**: Once testing is successful, we'll enable production access

## Troubleshooting

### Common Issues

1. **Authentication Failures**: 
   - Ensure you're using the correct admin credentials
   - Check that your account has admin privileges in our system
   - Verify that your IP address is in our allowlist if IP restrictions are enabled

2. **CORS Errors**: 
   - Verify that your admin dashboard domain is in our allowed origins list
   - Check that the request is coming from the exact domain you provided
   - Ensure your request includes the proper headers (Origin, Content-Type)

3. **Token Expiration**: 
   - JWT tokens expire after 24 hours by default
   - Implement token refresh logic using the refresh token provided
   - Store tokens securely and implement proper session management

4. **API Rate Limiting**:
   - We limit requests to 100 per minute per IP address
   - Implement request batching for bulk operations
   - Add exponential backoff for retry logic

### Error Codes

- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: User is not an admin or lacks specific permissions
- `400 Bad Request`: Invalid request parameters or malformed request
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error (please report these to our team)

### Testing Checklist

Before contacting support, please verify:

- [ ] You can successfully authenticate and receive a token
- [ ] Your requests include the Authorization header with the token
- [ ] You're using HTTPS for all API requests
- [ ] Your admin dashboard domain matches what you provided to us
- [ ] You've implemented proper error handling for all API responses

## Need Help?

If you encounter any issues with the API integration, please contact our development team:

- **Email**: dev@dessertprint.com
- **Support Hours**: Monday-Friday, 9am-5pm EST
- **Emergency Support**: For urgent production issues, call (555) 123-4567

When reporting issues, please include:
1. Your admin dashboard domain
2. The specific API endpoint you're trying to access
3. Any error messages or codes you're receiving
4. Steps to reproduce the issue

## API Versioning

Our API uses versioning to ensure backward compatibility as we add new features.

- Current API version: v1
- API version is specified in the URL path: `/api/v1/admin`
- We maintain backward compatibility for at least 6 months after a new version is released
- You will be notified via email when a new API version is available
- We recommend implementing version-aware code to smoothly transition between API versions