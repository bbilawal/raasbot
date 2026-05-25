# Raasbot — Full Design Spec
**Date:** 2026-05-25  
**Stack:** Next.js 14 + Supabase + Stripe + Hostinger  
**Languages:** English + French  

---

## 1. Architecture & Stack

**Approach:** Next.js 14 App Router monorepo — public site + admin panel + API routes in single codebase.

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Storage | Supabase Storage (media, downloads, investor docs) |
| Payments | Stripe (Checkout + Payment Intents + Webhooks) |
| i18n | next-intl (EN/FR, locale in URL) |
| Hosting | Hostinger VPS (Ubuntu 22.04, Nginx, PM2) |
| Domain | GoDaddy DNS → Hostinger VPS IP |
| Repo | github.com/bbilawal/raasbot |

### Directory Structure

```
raasbot/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Homepage
│   │   ├── about/
│   │   │   ├── company-profile/
│   │   │   ├── news/
│   │   │   ├── culture/
│   │   │   ├── milestones/
│   │   │   ├── contact/
│   │   │   └── compliance/
│   │   ├── technology/
│   │   │   ├── core-technology/
│   │   │   └── research-development/
│   │   ├── investor-relations/
│   │   ├── solutions/
│   │   │   ├── humanoid/               # Walker S2/S1/S, C/X, Cruzr S2, Panda, Industrial
│   │   │   ├── education/              # K12 + Vocational/Higher Ed
│   │   │   ├── commercial/
│   │   │   ├── healthcare/
│   │   │   ├── logistics/
│   │   │   └── consumer/              # Alpha series, smart pets, cleaning
│   │   ├── shop/
│   │   ├── checkout/
│   │   └── support/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── quotes/
│   │   ├── pages/
│   │   ├── banners/
│   │   ├── news/
│   │   ├── media/
│   │   ├── users/
│   │   └── settings/
│   └── api/
│       ├── auth/[...supabase]/
│       ├── admin/
│       │   ├── products/
│       │   ├── pages/
│       │   ├── banners/
│       │   ├── news/
│       │   ├── media/upload/
│       │   ├── orders/
│       │   ├── quotes/
│       │   ├── users/
│       │   └── settings/
│       ├── shop/
│       │   ├── checkout/
│       │   └── webhook/
│       ├── contact/
│       ├── quote/
│       └── public/
│           ├── products/
│           ├── news/
│           └── solutions/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── LocaleSwitcher.tsx
│   ├── home/
│   │   ├── HeroVideo.tsx
│   │   ├── SolutionGrid.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── StatsBar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   └── SpecsTable.tsx
│   ├── shop/
│   │   ├── Cart.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── OrderConfirmation.tsx
│   ├── about/
│   │   ├── CompanyProfile.tsx
│   │   ├── CulturePage.tsx
│   │   ├── MilestonesTimeline.tsx
│   │   ├── CompliancePage.tsx
│   │   └── ContactPage.tsx
│   ├── technology/
│   │   ├── CoreTechnology.tsx
│   │   └── RnDPage.tsx
│   ├── investor/
│   │   ├── InvestorHero.tsx
│   │   ├── FinancialDocs.tsx
│   │   └── GovernancePage.tsx
│   ├── solutions/
│   │   ├── SolutionHero.tsx
│   │   ├── SolutionFeatures.tsx
│   │   ├── EducationPage.tsx
│   │   └── ConsumerPage.tsx
│   ├── support/
│   │   ├── DownloadCenter.tsx
│   │   └── DeveloperPortal.tsx
│   ├── news/
│   │   ├── NewsList.tsx
│   │   └── NewsDetail.tsx
│   ├── legal/
│   │   ├── PrivacyPolicy.tsx
│   │   └── CookiePolicy.tsx
│   ├── shared/
│   │   ├── VideoPlayer.tsx
│   │   ├── AnimatedSection.tsx
│   │   ├── MediaGrid.tsx
│   │   └── QuoteForm.tsx
│   └── admin/
│       ├── DataTable.tsx
│       ├── MediaUploader.tsx
│       ├── RichEditor.tsx
│       └── PageBuilder.tsx
├── lib/
│   ├── supabase/
│   ├── stripe/
│   └── i18n/
├── messages/
│   ├── en.json
│   └── fr.json
└── public/
```

---

## 2. Database Schema (Supabase/PostgreSQL)

```sql
-- Content
products (id, slug, category, name_en, name_fr, desc_en, desc_fr, price, images[], video_url, specs jsonb, in_stock, featured, created_at)
product_categories (id, slug, name_en, name_fr, parent_id, sort_order)
solutions (id, slug, section, title_en, title_fr, body_en, body_fr, hero_image, hero_video, meta jsonb)
pages (id, slug, title_en, title_fr, content_en, content_fr, hero_image, hero_video, published)
news_posts (id, slug, title_en, title_fr, body_en, body_fr, cover_image, published_at, author_id)
banners (id, page_slug, image_en, image_fr, video_url, cta_text_en, cta_text_fr, cta_link, sort_order, active)
media (id, filename, url, type, size, uploaded_by, created_at)
milestones (id, year, title_en, title_fr, description_en, description_fr, image)

-- E-commerce
orders (id, user_id, stripe_session_id, status, items jsonb, total, currency, shipping_address jsonb, created_at)
order_items (id, order_id, product_id, qty, unit_price)
quotes (id, name, email, company, product_interest, message, status, created_at)
contact_messages (id, name, email, subject, message, read, created_at)

-- Users
user_profiles (id, role[admin|editor|customer], name, company, phone, created_at)
investor_docs (id, title_en, title_fr, file_url, category, published_at)
support_downloads (id, title_en, title_fr, file_url, product_id, type, created_at)
```

**Key decisions:**
- `_en` / `_fr` columns per table — no join overhead for 2 languages
- `specs jsonb` — flexible robot specs vary per product
- Supabase Storage buckets: `media`, `downloads`, `investor-docs`
- RLS: public read on published rows, admin write on all

---

## 3. API Routes & Auth

### Endpoints
- `POST /api/auth/[...supabase]` — Supabase auth callbacks
- `GET/POST/PATCH/DELETE /api/admin/*` — protected CRUD (admin/editor roles)
- `POST /api/shop/checkout` — create Stripe Checkout Session
- `POST /api/shop/webhook` — Stripe webhook handler
- `POST /api/contact` — save contact message
- `POST /api/quote` — save RFQ + optional Stripe deposit
- `GET /api/public/*` — public content endpoints

### Auth & Roles
- Supabase Auth: email/password + Google OAuth
- Roles: `admin` (full), `editor` (content only), `customer` (shop only)
- Next.js middleware enforces role on every `/admin/*` route
- Stripe webhook validates `stripe-signature` header

### i18n
- next-intl middleware reads locale from URL (`/en/`, `/fr/`)
- API returns both `_en` + `_fr` fields; frontend selects by active locale

---

## 4. Frontend UI & Visual Design

**Design system:**
- Background: `#0A0A0A`, Text: `#FFFFFF`, Accent: `#0066FF`, Light sections: `#F5F5F5`
- Font: Inter (black/bold headings, regular body)
- Animations: Framer Motion — scroll-triggered fade-ins, hero parallax, card hovers
- Full-bleed hero sections with autoplay muted video
- Sticky navbar: transparent → solid on scroll
- Admin: dark sidebar, shadcn/ui components, Recharts analytics

---

## 5. E-commerce & Stripe Flow

### Purchase
```
Shop → Product → Cart → Checkout
→ POST /api/shop/checkout → Stripe Checkout Session
→ Redirect to Stripe → Payment
→ /checkout/success?session_id=xxx
→ Webhook → order status update → email confirmation
```

### Quote/RFQ
```
Product/Solution page → "Get Quote"
→ QuoteForm → optional 10% Stripe deposit
→ Save to quotes table → email admin + customer
→ Admin reviews in /admin/quotes
```

### Stripe events handled
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Currencies:** USD + EUR  
**Payment methods:** Card, Apple Pay, Google Pay (via Stripe Checkout)

---

## 6. Deployment & DevOps

### Hostinger VPS
```
Ubuntu 22.04
├── Nginx (reverse proxy → port 3000)
├── PM2 (process manager)
├── Node.js 20 LTS
└── Certbot (Let's Encrypt SSL)
```

### CI/CD (GitHub Actions)
```
git push main → build → SSH deploy → pm2 restart
```

### DNS
```
GoDaddy → A record → Hostinger VPS IP
Nginx → handle domain.com + www.domain.com
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXTAUTH_SECRET=
```

---

## 7. Multi-Agent QA Plan

| Agent | Responsibility |
|-------|---------------|
| UX Researcher | User testing, behavior analysis, full app research |
| Backend Architect | API design review, database optimization |
| Rapid Prototyper | Fast iteration cycles, quick fixes |
| UI Designer | Visual design, component libraries, design systems |
| Software Architect | System design, DDD, architectural patterns, trade-offs |
| Agents Orchestrator | Multi-agent coordination, workflow management |
| Reality Checker | Quality gate before launch |

---

## 8. Out of Scope (v1)

- Mobile app
- Third language beyond EN/FR
- Live chat
- Marketplace (multi-vendor)
- Custom payment gateway (Stripe only)
