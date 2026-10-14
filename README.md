# Homestone Builders Inc. — website

Marketing and lead-intake site for **Homestone Builders Inc.**, a licensed California
general contractor (CSLB #1142545) serving Orange County.

Built with Next.js 16 (App Router, Cache Components), TypeScript and Tailwind CSS v4.
Every page is prerendered as static HTML. The only server code is the estimate-form
Server Action.

## Content rules

All business facts live in [`src/lib/site.ts`](src/lib/site.ts) and
[`src/lib/services.ts`](src/lib/services.ts). The site deliberately does **not**
include testimonials, ratings, project counts, guarantees, certifications, insurance
or bonding claims, years in business, showroom hours, or project locations. Don't add
any of these unless they are verified.

- The showroom at 13962 Seaboard, Garden Grove is operated by **Hometrade Stone &
  Marble**, a separate business. Homestone Builders performs construction and
  installation. Every mention of the showroom says this.
- Structured data (JSON-LD) contains only the name, phone, license, service list
  and service area. There is **no street address** for Homestone Builders, because
  none was supplied and the showroom address belongs to another business.

## Local preview

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # optional: fill in email settings to test real delivery
npm run dev                  # http://localhost:3000
```

Production-mode preview:

```bash
npm run build && npm start   # http://localhost:3000
```

Run all checks (lint, typecheck, unit tests, production build):

```bash
npm run check
```

## Project photos

Put real photos of completed projects in `public/projects/<category>/`
(`kitchens/`, `bathrooms/`, `shower-doors/`, `adus/`, `new-homes/`,
`windows-doors/`). See [`public/projects/README.md`](public/projects/README.md).

- Photos are listed at build time (`scripts/generate-photo-manifest.mjs` runs
  before `dev` and `build`), so **rebuild or redeploy after adding photos**.
- The homepage hero uses the photo marked `"featured": true` in
  `public/projects/photos.json`, otherwise the first kitchen photo. With no photos,
  pages show a neutral stone background and a "photos coming soon" note. The site
  never falls back to stock imagery.
- Set descriptive alt text in `photos.json` for accessibility and SEO.

## Contact form email setup

The callback form at `/contact` asks for name, phone number and "How can we help?"
(Request an estimate / Discuss a project / General question), plus an optional
message. It validates input on the server, then sends the request as a plain-text
email through one of three providers, using their HTTPS APIs (no SDKs):

| `EMAIL_PROVIDER` | `EMAIL_API_KEY` is…        | Sender requirement                         |
| ---------------- | -------------------------- | ------------------------------------------ |
| `resend`         | API key (`re_…`)           | Verified domain in Resend                  |
| `postmark`       | Server API token           | Verified sender signature or domain        |
| `sendgrid`       | API key with Mail Send     | Verified single sender or domain           |

Set `EMAIL_PROVIDER`, `EMAIL_API_KEY`, `EMAIL_FROM` and `EMAIL_TO` (see
`.env.example`). Every notification includes the visitor's name, phone number,
reason and message (or "(none)"), plus the service page they came from, if any.

Behavior when delivery isn't possible (it never reports a fake success):

- **Credentials missing, development:** `/contact` shows a developer notice listing the
  missing variables. Submissions return "your request was not sent, please call."
- **Credentials missing, production build:** the form is replaced with a "please call
  714-794-8184" panel.
- **Provider error or network failure:** the visitor is told the request was not sent
  and shown the phone number. The error (never the key) is logged on the server.

Secrets are read only in server code and never use the `NEXT_PUBLIC_` prefix, so they
are not bundled into client JavaScript.

### Spam protection

- Hidden honeypot field
- Minimum fill time (3 s), stamped when the form becomes interactive. Because of this,
  the form needs JavaScript; without it, visitors are asked to call.
- Max 2 links in the message
- Per-IP rate limit (5 per 10 minutes). This is in memory and per server instance, so
  it is best-effort on serverless hosting.
- Optional **Cloudflare Turnstile**: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and
  `TURNSTILE_SECRET_KEY`. The privacy policy mentions Cloudflare automatically when
  it's enabled.

## SEO

- Per-page titles, descriptions and canonical URLs (`src/lib/seo.ts`)
- `/sitemap.xml` and `/robots.txt` (Vercel preview deployments are set to `noindex`)
- JSON-LD: `GeneralContractor` (site-wide), `Service` (service pages), `BreadcrumbList`
- Generated Open Graph image (`src/app/opengraph-image.tsx`)
- Set `NEXT_PUBLIC_SITE_URL` to the final domain so canonical URLs and the sitemap use it

## Deploying to Vercel

Nothing has been deployed. These steps are for when you're ready:

1. Push this repository to GitHub, then import it at vercel.com → **Add New → Project**.
   Vercel detects Next.js; keep the default build settings.
2. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` and the
   `EMAIL_*` variables (and Turnstile keys if used) for **Production**.
3. Deploy, then submit a test request on `/contact` and confirm the email arrives.
4. Add your domain under **Settings → Domains** and update DNS as Vercel instructs.
   Redeploy if you changed `NEXT_PUBLIC_SITE_URL`.
5. Submit `https://your-domain/sitemap.xml` in Google Search Console.

On Vercel's Hobby plan, image optimization has monthly limits. A gallery of a few
dozen photos fits comfortably.

## Project structure

```
src/app/                  routes (home, services/[slug], gallery, about, contact, privacy)
src/app/contact/actions.ts  contact form Server Action (spam checks → validation → email)
src/components/           UI components (header, sticky mobile call bar, gallery, form…)
src/lib/site.ts           business facts — single source of truth
src/lib/services.ts       service page content
src/lib/estimate/         validation, spam protection, email providers
public/projects/          your project photos
tests/                    unit tests (Vitest)
```
