# Start-to-finish setup

## Phase 0 — Accounts (30–60 min)
1. Create Dad's dedicated Google account. Suggested first choice: lamajammercollectibles@gmail.com if available.
2. Turn on 2-step verification and recovery methods.
3. Create the Google Sheet and Drive folder while signed into Dad's account.
4. Create Stripe using the same business email. Complete identity/bank/tax setup truthfully.
5. Keep GitHub/Vercel/Make under the accounts you plan to maintain, but give Dad only the store/admin interface.

## Phase 1 — GitHub/Vercel (20–40 min)
1. New GitHub repo: lamajammer-store.
2. Upload all files.
3. Import repo into Vercel.
4. Deploy.
5. Use the temporary *.vercel.app URL. No domain needed yet.

## Phase 2 — Google data backend (30–60 min)
1. Create Sheet tabs and headers from README.
2. Extensions -> Apps Script.
3. Paste google-apps-script/Code.gs.
4. Script Properties: BACKEND_SECRET, IMAGE_FOLDER_ID.
5. Deploy web app, run as Dad.
6. Put URL + secret in Vercel env vars.

## Phase 3 — Dad-only auth (30–60 min)
1. Google Cloud Console under Dad's account.
2. Create OAuth Web Client.
3. Add the Vercel URL as authorized JavaScript origin.
4. Add GOOGLE_CLIENT_ID and ADMIN_EMAIL to Vercel.
5. Replace placeholder client ID in /admin/index.html.
6. Test that another Google account cannot use admin APIs.

## Phase 4 — Make (60–120 min)
Build the 5 scenarios in MAKE-SCENARIOS.md.
Product Pipeline is the only scenario that handles product creation/update/archive.

## Phase 5 — Stripe test mode (60–90 min)
1. Use Stripe test keys in Vercel.
2. Add webhook endpoint: https://YOUR-VERCEL-URL/api/stripe-webhook
3. Listen for checkout.session.completed.
4. Copy signing secret to STRIPE_WEBHOOK_SECRET.
5. Test normal sale, quantity=1 sale, duplicate webhook, cancel, failed card.
6. Only then switch to live keys.

## Phase 6 — Etsy migration (30–90 min + review)
The public web index cannot guarantee every current Etsy listing, so do not trust search scraping.
Export Dad's active-listings CSV directly from Etsy.
Use tools/etsy-csv-to-products.html to convert it.
Review every product before going LIVE.
Do not import stale quantity, licensing or condition claims blindly.

## Phase 7 — policies and launch check (1–3 hr)
Replace policy placeholders.
Confirm shipping prices.
Confirm returns/refunds.
Confirm customer support email.
Confirm Stripe receipts.
Confirm sales tax configuration.
Confirm every trademark/licensing claim.
Confirm privacy disclosures for Stripe/Google/Vercel/Make/OpenAI.
Confirm mobile checkout and shipping address.

## Expected hands-on build time
Bare working store: 6–10 hours.
Dad-ready admin + Stripe: 10–16 total.
AI + automation + testing: 14–22 total.
Policy/product migration review may add 2–4 hours depending on inventory.
