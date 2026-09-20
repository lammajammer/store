# Dad's Guide — Lamajammer OS

## Your normal routine
You only need the private /admin page and your email.

### Add a product
1. Open /admin.
2. Sign in with your Lamajammer Google account.
3. Tap Add Product.
4. Upload 1–8 real photos of the exact item.
5. Enter a rough title. It does not have to be perfect.
6. Enter anything you know in Description. Never guess.
7. Enter selling price.
8. Enter how many you physically have.
9. Enter shipping price, or 0 if shipping is included in the product price.
10. Tap Optimize + Publish.
11. Wait for “Published successfully.”

The system cleans the wording and categorizes the item automatically. It should never invent physical details.

### Photos
Good: front, back, sides, packaging, flaws, label/size tag.
Avoid: blurry photos, heavy glare, hands covering details.
AI may crop/brighten/straighten but must not change the item itself.

### New order
You receive an email after successful payment.
Open the admin Orders area / daily email for:
- buyer name
- shipping address
- item
- quantity
- amount paid

Pack the exact product shown in the listing.

### Shipping
V1 workflow:
1. Buy the shipping label with the carrier/tool you prefer.
2. Keep the tracking number.
3. Mark the order shipped in the fulfillment workflow once that button is enabled.
4. Customer receives tracking email.

Do not mark shipped before the parcel is accepted by the carrier.

### Sold-out products
When quantity reaches zero after a Stripe payment, the system marks the item SOLD OUT automatically.
Do not delete sold products just to clean the dashboard. Archive them if you do not plan to restock.

### Restock
Edit Quantity to the number physically on hand.
The item can return to LIVE automatically.

### Change price
You may edit the price. Price changes are never made silently by AI.

### Returns/refunds
Follow the posted return policy.
Refund from Stripe, then confirm that inventory should or should not be added back depending on whether the item is physically returned in sellable condition.

### Daily email
Read the one morning summary.
It includes:
- revenue
- orders
- visitors
- product views
- checkout activity
- best product
- traffic sources
- optimizations already made
- anything that requires you

Most days should end with:
Action required: None.

### If something looks wrong
Do not keep clicking Publish.
Take a screenshot and send it to the maintainer.
Payment, quantity and physical product facts always override automation.

## Rules that protect the business
- Never call an item authentic/licensed unless you can prove it.
- Never hide damage.
- Never use an AI image that changes the physical product.
- Quantity means physical units actually available.
- Ship to the address attached to the paid Stripe order unless the payment workflow explicitly supports an approved change.
- Keep receipts/proof of shipping for disputes.
