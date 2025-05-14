# Dessert Print Inc

A luxury modern elegant website for custom edible image printing on cookies and chocolate bars.

## Admin Dashboard Access

To access the admin dashboard:

1. Navigate to `/secure-admin` in your browser
2. Use the following credentials:
   - Username: `admin`
   - Password: `dessertprint2024`
3. Once logged in, you'll have access to:
   - Dashboard overview with sales metrics
   - Product management
   - Order tracking
   - Blog post management
   - Media library

## Features

- **Custom Cookie Designer**: Upload your own images or choose from our gallery
- **Product Catalog**: Browse our selection of cookies, chocolate bars, and gift sets
- **Blog**: Read our engaging articles about custom desserts
- **Checkout**: Simple PayPal integration for easy payments
- **Responsive Design**: Mobile-first approach for optimal viewing on all devices

## Development

This project is built with:
- Next.js
- Tailwind CSS
- Supabase (for authentication and storage)
- PayPal API for payments
- MailerLite for email marketing
- Mapbox for location services

## Environment Variables

Make sure to set up the following environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_API_URL`
- `PAYPAL_WEBHOOK_ID`
- `NEXT_PUBLIC_APP_URL`
- `MAILERLITE_API_KEY`
- `MAPBOX_ACCESS_TOKEN` (server-side only)
