# Make.com scenarios

## Scenario 1 — PRODUCT PIPELINE (one scenario for every product)
Trigger: Custom webhook MAKE_PRODUCT_WEBHOOK_URL

1. Validate X-Lamajammer-Secret.
2. Router:
   - action=publish
   - action=archive
3. For publish:
   - Generate UUID/product slug.
   - Save original images to Dad's Google Drive folder.
   - ONE OpenAI vision/text request returns JSON:
     title, description, category, league, team, seo_title, meta_description, alt_text, social_copy, pinterest_copy, image_rank, warnings.
   - Hard rule: no invented licensing/authenticity/materials/dimensions/condition/packaging.
   - If a required fact is unknown, omit it; do not guess.
   - Write product to Products sheet.
   - Add promotion job metadata.
   - Respond JSON {ok:true,id:"..."}.
4. For archive:
   - set Products.status=archived
   - respond {ok:true}.

NO product gets its own scenario.

## Scenario 2 — SALE FOLLOW-UP
Trigger: optional MAKE_SALE_WEBHOOK_URL called by Stripe webhook.
Use for:
- immediate Dad order email
- promotion suppression for sold-out products
- fulfillment reminder
- optional order row enrichment

Inventory is already decremented by the Stripe webhook/Google backend, so this scenario should not decrement inventory again.

## Scenario 3 — DAILY SUMMARY
Schedule: once daily, e.g. 8:00 AM Dad's time.
1. Search Orders from previous calendar day.
2. Read aggregated Analytics.
3. Read Optimizations.
4. One OpenAI call to summarize only data-supported changes.
5. Gmail Dad:
   subject "Lamajammer Daily — $X yesterday · N orders"
   body includes revenue, orders, visitors, product views, checkout starts, conversion, top product, traffic sources, changes automatically applied, action required.
6. Default final line: "Action required: None."

## Scenario 4 — PROMOTION QUEUE
Schedule: once daily, not constant polling.
1. Find next eligible product(s).
2. Publish only to legitimate automated channels you have connected (Pinterest, Meta business pages, etc.).
3. Record source URL/campaign ID.
4. Never mass-post groups, DMs, Reddit comments or fake engagement.

## Scenario 5 — FAILURE WATCH
Use Make error handlers rather than frequent polling.
Email only for:
- payment/inventory sync failure
- product publish failure
- Google storage failure
- failed promotion connection
- unrecoverable AI JSON output

## Make credit rules
- Webhooks, not 5-minute polling.
- One AI call per product, structured JSON output.
- Batch daily analytics.
- Do sorting, totals, slugs, filters and page rendering in site code, not Make.
- Never create per-product scenarios.
