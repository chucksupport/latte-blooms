# Latte Blooms

Marketing site + gift request form for Latte Blooms: fresh flowers and a favorite coffee, delivered together in one kraft carrier.

Built with Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, and Resend for the request-form email. Deploys to Render via the included `render.yaml` blueprint.

## Local development

```bash
npm install
cp .env.example .env.local   # optional: add RESEND_API_KEY to actually send email
npm run dev
```

Without `RESEND_API_KEY`, submitted gift requests are logged to the server console instead of emailed, so the whole flow still works locally.

## Deploying to Render

1. Push this repo to GitHub.
2. In Render: **New > Blueprint**, connect the repo. Render reads `render.yaml`.
3. Set the env vars it prompts for:
   - `RESEND_API_KEY` - from https://resend.com/api-keys
   - `REQUEST_FORM_TO` - the owner's inbox that receives gift requests
   - `REQUEST_FORM_FROM` - a verified-domain sender like `Latte Blooms <hello@yourdomain.com>` (optional; defaults to Resend's test sender, which can only email the owner, not customers)

## Where things live

- `lib/site.ts` - name, phone, email, base pricing (flowers, delivery fee and radius, max drinks per order), bouquet collections, occasions. Edit content here first.
- `lib/menu.ts` - one drink menu per coffee shop (Starbucks, Dunkin'; a local shop borrows the Starbucks menu) with per-size prices, milks, flavors, extras, and the price/validation helpers shared by the form and the API. Prices are estimates from each chain's menu; edit the numbers here.
- `app/page.tsx` - the single landing page (hero, collections, how it works, request form).
- `components/gift-request-form.tsx` - the form with its review dialog.
- `app/api/request/route.ts` - validates the request and hands it to `lib/email.ts`.
- `app/app/page.tsx` - "Save to your phone" instructions; `app/manifest.ts` makes the site installable.

## TODO before launch

- Point latteblooms.com DNS at the Render service (custom domain in the Render dashboard).
- Owner inbox (`REQUEST_FORM_TO`) and a verified Resend sender.
- Replace the hero mockup photo (`public/gift.jpg`) with a real product photo. The current mockup shows a third-party coffee cup brand.
