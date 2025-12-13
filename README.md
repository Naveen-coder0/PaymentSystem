# Vercel External Checkout with Email Confirmation

## What this does
Shopify Buy Now → Redirect to Vercel checkout → UPI/manual payment → Customer confirms → Email sent to customer & admin.

## Email
Uses EmailJS (client-side, no server needed).
You only need:
- emailjs.com account
- Service ID
- Template ID
- Public Key

## Deploy
1. Upload this folder to GitHub
2. Import repo into Vercel
3. Done

## Shopify
Replace Buy Now button with link to:
https://your-vercel-url.vercel.app/?name=Product&price=999
