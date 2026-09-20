# Lamajammer Collectibles — V1 build

This repo is intentionally plain HTML/CSS/JS plus a few Vercel API functions.

## Important architecture decision
There is ONE Make scenario for all product publishing. Product ID is data. Never create one scenario per product.
There is ONE Stripe webhook for all purchases.

## Upload to GitHub
Upload the entire folder exactly as-is. Connect the repository to Vercel.

## Required Vercel environment variables
ADMIN_EMAIL = Dad's Gmail
GOOGLE_CLIENT_ID = Google OAuth web client ID
GOOGLE_BACKEND_URL = deployed Google Apps Script web-app URL
GOOGLE_BACKEND_SECRET = long random secret
MAKE_PRODUCT_WEBHOOK_URL = Make custom webhook for product workflow
MAKE_SHARED_SECRET = another long random secret
STRIPE_SECRET_KEY = sk_live_... (use test key first)
STRIPE_WEBHOOK_SECRET = whsec_...
MAKE_SALE_WEBHOOK_URL = optional Make sale webhook
PUBLIC_BASE_URL = your Vercel URL, e.g. https://project.vercel.app

## Admin Google sign-in
Replace REPLACE_WITH_GOOGLE_CLIENT_ID in /admin/index.html with the same GOOGLE_CLIENT_ID.

## Product data
/data/products.json contains ONLY products we could safely identify from the prior build/public indexing. It is not a guaranteed complete Etsy export.
For a complete migration:
1. Etsy Shop Manager -> Settings -> Options -> Download Data.
2. Export active listings CSV.
3. Open /tools/etsy-csv-to-products.html locally.
4. Convert the CSV.
5. Review all imported products before making them live.
6. Replace /data/products.json for initial migration OR import rows into Google Sheet.

## Google Sheet headers
Products:
id,title,description,price,quantity,shipping,category,league,team,status,featured,images,source,created_at,updated_at

Orders:
order_id,payment_intent,product_id,quantity,amount,customer_email,customer_name,shipping,created_at

Analytics:
date,event,product_id,source,session_id,value

Optimizations:
date,product_id,change,reason,old_value,new_value

## Recommended Gmail names (availability must be checked)
lamajammercollectibles@gmail.com
shoplamajammer@gmail.com
lamajammerstore@gmail.com
lamajammerhq@gmail.com

Best first choice: lamajammercollectibles@gmail.com
