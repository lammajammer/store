# Stress test and launch checklist

## Authentication
[ ] Dad Google account succeeds
[ ] unrelated Google account cannot list products
[ ] unrelated Google account cannot publish/archive products
[ ] expired Google token forces sign-in
[ ] /admin is noindex

## Product publishing
[ ] one image
[ ] eight images
[ ] large image rejected/handled gracefully
[ ] weird title does not invent facts
[ ] blank optional description works
[ ] quantity 1 works
[ ] duplicate publish does not duplicate unexpectedly
[ ] Make failure returns visible error
[ ] original photo still exists after optimization

## Inventory
[ ] quantity decreases exactly once per paid order
[ ] duplicate Stripe webhook is idempotent before production
[ ] quantity 1 becomes sold out
[ ] sold-out item cannot create checkout
[ ] restock returns product to live
[ ] canceled checkout does not decrease quantity
[ ] failed payment does not decrease quantity

## Stripe
[ ] test card success
[ ] declined card
[ ] 3DS/authentication case
[ ] shipping address captured
[ ] receipt/confirmation sent
[ ] webhook signature validated
[ ] refund workflow tested
[ ] Stripe keys only in Vercel env vars

## Storefront
[ ] iPhone Safari
[ ] Android Chrome
[ ] desktop Chrome/Safari
[ ] slow network
[ ] broken image
[ ] no inventory
[ ] all category filters
[ ] product title overflow
[ ] $0 shipping
[ ] large price
[ ] sold item

## Data
[ ] Google Sheet backup copy
[ ] Drive images accessible only as intended
[ ] no secrets committed to GitHub
[ ] daily summary totals match Stripe
[ ] order totals reconcile with Stripe dashboard

## Legal/business
[ ] seller/business identity accurately configured in Stripe
[ ] bank account verified
[ ] sales tax responsibility reviewed
[ ] shipping policy final
[ ] returns/refunds policy final
[ ] privacy policy final
[ ] terms final
[ ] support email works
[ ] replica/licensing language reviewed product-by-product
[ ] no counterfeit/unauthorized trademark claims
[ ] no AI image materially changes the item
[ ] copyright permission for every product photo
[ ] records retained for orders/refunds/shipping

## Promotion
[ ] no spam automation
[ ] source tracking tags
[ ] sold-out products excluded
[ ] posts link to correct product
[ ] daily budget = $0 unless deliberately changed
[ ] performance changes require enough data, not 2–3 clicks
