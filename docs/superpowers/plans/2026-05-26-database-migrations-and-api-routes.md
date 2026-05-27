# Database Migrations and API Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three SQL migration files and all API route handlers for the Raasbot robotics website, enabling product catalog, orders, rentals, quotes, and full admin CRUD via Next.js 16.2.6 App Router + Supabase + Stripe.

**Architecture:** SQL migrations define the schema, RLS policies, and seed data in three sequential files. A shared auth helper (`lib/auth/server.ts`) is used by every admin route to check role. Public and admin routes are separate trees under `app/api/public/` and `app/api/admin/`; Stripe webhook handling lives at `app/api/shop/webhook/route.ts`.

**Tech Stack:** Next.js 16.2.6 App Router (Web Request/Response APIs, `RouteContext<'/path/[id]'>` for param typing), Supabase (PostgreSQL + Auth + Storage via `@supabase/ssr`), Stripe (`stripe@22`, webhook signature verification), TypeScript 5, Zod 4 for body validation.

---

## Key conventions for this codebase

### Next.js 16.2.6 Route Handler signatures

Route handlers receive `(request: Request)` or `(request: Request, ctx: RouteContext<'/path/[id]'>)`. Params are **async** — always `await ctx.params`.

```ts
import type { NextRequest } from 'next/server'

// no dynamic param
export async function GET(request: Request) { ... }

// with dynamic param
export async function PATCH(request: Request, ctx: RouteContext<'/admin/products/[id]'>) {
  const { id } = await ctx.params
}
```

Always return `Response.json(payload, { status: N })`. Do NOT import `NextResponse` — use native `Response`.

### Supabase clients

- `createClient()` from `@/lib/supabase/server` — respects user session (anon key).
- `createAdminClient()` from `@/lib/supabase/server` — service role, bypasses RLS. Use only in admin routes.

### Auth helper (created in Task 1)

Every admin route calls `requireAdmin()` or `requireAdminOnly()` from `@/lib/auth/server` and returns 401 if null.

### Stripe API version

`stripe@22` uses API version `2025-04-30.basil`. The `stripe` singleton is exported from `@/lib/stripe/index.ts`.

### Webhook raw body

Stripe signature verification requires the **raw** request body. In Next.js App Router route handlers, read it with `await request.text()` then pass to `stripe.webhooks.constructEvent(rawBody, sig, secret)`.

### Zod 4

Zod 4 changed some APIs. Use `.parse()` / `.safeParse()` as before. `z.object({ ... })` is unchanged.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `supabase/migrations/001_initial_schema.sql` | Create | All table definitions |
| `supabase/migrations/002_rls_policies.sql` | Create | RLS + helper functions |
| `supabase/migrations/003_seed_data.sql` | Create | Default categories, milestones, settings, solutions |
| `lib/auth/server.ts` | Create | `requireAdmin()` + `requireAdminOnly()` helpers |
| `app/api/contact/route.ts` | Create | Public POST contact form |
| `app/api/quote/route.ts` | Create | Public POST RFQ (optional Stripe deposit) |
| `app/api/shop/checkout/route.ts` | Create | POST create Stripe purchase session |
| `app/api/shop/rental/route.ts` | Create | POST create Stripe rental session |
| `app/api/shop/webhook/route.ts` | Create | POST Stripe webhook handler |
| `app/api/public/products/route.ts` | Create | Public GET products list |
| `app/api/public/news/route.ts` | Create | Public GET published news |
| `app/api/public/solutions/route.ts` | Create | Public GET published solutions |
| `app/api/admin/products/route.ts` | Create | Admin GET list + POST create product |
| `app/api/admin/products/[id]/route.ts` | Create | Admin GET/PATCH/DELETE single product |
| `app/api/admin/orders/route.ts` | Create | Admin GET orders list |
| `app/api/admin/orders/[id]/route.ts` | Create | Admin PATCH order status/tracking |
| `app/api/admin/rentals/route.ts` | Create | Admin GET rentals list |
| `app/api/admin/rentals/[id]/route.ts` | Create | Admin PATCH rental status |
| `app/api/admin/quotes/route.ts` | Create | Admin GET quotes list |
| `app/api/admin/quotes/[id]/route.ts` | Create | Admin PATCH quote status |
| `app/api/admin/media/upload/route.ts` | Create | Admin POST multipart upload → Supabase Storage |
| `app/api/admin/news/route.ts` | Create | Admin GET list + POST create news post |
| `app/api/admin/news/[id]/route.ts` | Create | Admin PATCH/DELETE news post |
| `app/api/admin/users/route.ts` | Create | Admin GET user profiles list |
| `app/api/admin/users/[id]/route.ts` | Create | Admin PATCH user role (admin only) |
| `app/api/admin/settings/route.ts` | Create | Admin GET all settings + PATCH single key |
| `app/api/admin/banners/route.ts` | Create | Admin GET list + POST create banner |
| `app/api/admin/banners/[id]/route.ts` | Create | Admin PATCH/DELETE banner |
| `app/api/admin/pages/route.ts` | Create | Admin GET list + POST create CMS page |
| `app/api/admin/pages/[id]/route.ts` | Create | Admin GET/PATCH/DELETE CMS page |

---

## Task 1: Auth helper

**Files:**
- Create: `lib/auth/server.ts`

- [ ] **Step 1: Create the file**

```ts
// lib/auth/server.ts
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || !['admin', 'editor'].includes(profile.role)) return null
  return { user, profile }
}

export async function requireAdminOnly() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin') return null
  return { user, profile }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: zero errors related to `lib/auth/server.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/auth/server.ts
git commit -m "feat: add requireAdmin/requireAdminOnly auth helpers"
```

---

## Task 2: Migration 001 — initial schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- supabase/migrations/001_initial_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles (extends Supabase auth.users)
create table user_profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'customer' check (role in ('admin', 'editor', 'customer')),
  name text,
  company text,
  phone text,
  created_at timestamptz default now()
);

-- Product categories
create table product_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_en text not null,
  name_fr text not null,
  parent_id uuid references product_categories(id),
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Products (with rental support)
create table products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  category_id uuid references product_categories(id),
  name_en text not null,
  name_fr text not null,
  description_en text,
  description_fr text,
  price decimal(10,2),
  images text[] default '{}',
  video_url text,
  specs jsonb default '{}',
  in_stock boolean default true,
  featured boolean default false,
  rental_available boolean default false,
  rental_price_daily decimal(10,2),
  rental_price_weekly decimal(10,2),
  rental_price_monthly decimal(10,2),
  rental_deposit decimal(10,2),
  stripe_product_id text,
  stripe_price_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Solutions pages
create table solutions (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  section text not null,
  title_en text not null,
  title_fr text not null,
  body_en text,
  body_fr text,
  hero_image text,
  hero_video text,
  meta jsonb default '{}',
  published boolean default true,
  created_at timestamptz default now()
);

-- CMS Pages
create table pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_en text not null,
  title_fr text not null,
  content_en text,
  content_fr text,
  hero_image text,
  hero_video text,
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- News posts
create table news_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title_en text not null,
  title_fr text not null,
  body_en text,
  body_fr text,
  excerpt_en text,
  excerpt_fr text,
  cover_image text,
  author_id uuid references auth.users,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Banners
create table banners (
  id uuid primary key default uuid_generate_v4(),
  page_slug text not null,
  image_en text,
  image_fr text,
  video_url text,
  cta_text_en text,
  cta_text_fr text,
  cta_link text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Media
create table media (
  id uuid primary key default uuid_generate_v4(),
  filename text not null,
  url text not null,
  type text not null,
  size bigint,
  uploaded_by uuid references auth.users,
  created_at timestamptz default now()
);

-- Milestones
create table milestones (
  id uuid primary key default uuid_generate_v4(),
  year int not null,
  title_en text not null,
  title_fr text not null,
  description_en text,
  description_fr text,
  image text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  stripe_session_id text unique,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled', 'refunded')),
  items jsonb not null default '[]',
  subtotal decimal(10,2),
  total decimal(10,2),
  currency text default 'usd',
  shipping_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null,
  unit_price decimal(10,2) not null,
  created_at timestamptz default now()
);

-- Rentals
create table rentals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  product_id uuid references products(id),
  stripe_session_id text,
  period text not null check (period in ('daily', 'weekly', 'monthly')),
  start_date date not null,
  end_date date not null,
  status text default 'pending' check (status in ('pending', 'active', 'completed', 'cancelled')),
  deposit_paid boolean default false,
  deposit_amount decimal(10,2),
  total_amount decimal(10,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quotes / RFQ
create table quotes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  product_interest text,
  message text,
  status text default 'new' check (status in ('new', 'in_progress', 'quoted', 'closed')),
  deposit_paid boolean default false,
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Contact messages
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Investor docs
create table investor_docs (
  id uuid primary key default uuid_generate_v4(),
  title_en text not null,
  title_fr text not null,
  file_url text not null,
  category text,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Support downloads
create table support_downloads (
  id uuid primary key default uuid_generate_v4(),
  title_en text not null,
  title_fr text not null,
  file_url text not null,
  product_id uuid references products(id),
  type text,
  created_at timestamptz default now()
);

-- Site settings
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql
git commit -m "feat: add initial database schema migration"
```

---

## Task 3: Migration 002 — RLS policies

**Files:**
- Create: `supabase/migrations/002_rls_policies.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- supabase/migrations/002_rls_policies.sql

-- Enable RLS on all tables
alter table user_profiles enable row level security;
alter table products enable row level security;
alter table product_categories enable row level security;
alter table solutions enable row level security;
alter table pages enable row level security;
alter table news_posts enable row level security;
alter table banners enable row level security;
alter table media enable row level security;
alter table milestones enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table rentals enable row level security;
alter table quotes enable row level security;
alter table contact_messages enable row level security;
alter table investor_docs enable row level security;
alter table support_downloads enable row level security;
alter table site_settings enable row level security;

-- Helper function to check admin/editor role
create or replace function is_admin_or_editor()
returns boolean as $$
  select exists (
    select 1 from user_profiles
    where id = auth.uid()
    and role in ('admin', 'editor')
  );
$$ language sql security definer;

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from user_profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$ language sql security definer;

-- Public read on published content
create policy "public_read_products" on products for select using (true);
create policy "public_read_categories" on product_categories for select using (true);
create policy "public_read_solutions" on solutions for select using (published = true);
create policy "public_read_pages" on pages for select using (published = true);
create policy "public_read_news" on news_posts for select using (published_at is not null);
create policy "public_read_banners" on banners for select using (active = true);
create policy "public_read_milestones" on milestones for select using (true);
create policy "public_read_investor_docs" on investor_docs for select using (true);
create policy "public_read_support_downloads" on support_downloads for select using (true);
create policy "public_read_site_settings" on site_settings for select using (true);

-- Admin/editor write on content
create policy "admin_write_products" on products for all using (is_admin_or_editor());
create policy "admin_write_categories" on product_categories for all using (is_admin_or_editor());
create policy "admin_write_solutions" on solutions for all using (is_admin_or_editor());
create policy "admin_write_pages" on pages for all using (is_admin_or_editor());
create policy "admin_write_news" on news_posts for all using (is_admin_or_editor());
create policy "admin_write_banners" on banners for all using (is_admin_or_editor());
create policy "admin_write_media" on media for all using (is_admin_or_editor());
create policy "admin_write_milestones" on milestones for all using (is_admin_or_editor());
create policy "admin_write_investor_docs" on investor_docs for all using (is_admin_or_editor());
create policy "admin_write_support_downloads" on support_downloads for all using (is_admin_or_editor());
create policy "admin_write_site_settings" on site_settings for all using (is_admin());

-- Orders: users see own, admins see all
create policy "users_read_own_orders" on orders for select using (user_id = auth.uid() or is_admin_or_editor());
create policy "admin_write_orders" on orders for all using (is_admin_or_editor());
create policy "insert_order" on orders for insert with check (true);

-- Rentals: users see own, admins see all
create policy "users_read_own_rentals" on rentals for select using (user_id = auth.uid() or is_admin_or_editor());
create policy "admin_write_rentals" on rentals for all using (is_admin_or_editor());
create policy "insert_rental" on rentals for insert with check (true);

-- Quotes/contact: insert public, read admin
create policy "public_insert_quotes" on quotes for insert with check (true);
create policy "admin_read_quotes" on quotes for select using (is_admin_or_editor());
create policy "admin_write_quotes" on quotes for update using (is_admin_or_editor());

create policy "public_insert_contact" on contact_messages for insert with check (true);
create policy "admin_read_contact" on contact_messages for select using (is_admin_or_editor());
create policy "admin_write_contact" on contact_messages for update using (is_admin_or_editor());

-- User profiles: users see own, admins see all
create policy "users_read_own_profile" on user_profiles for select using (id = auth.uid() or is_admin());
create policy "users_update_own_profile" on user_profiles for update using (id = auth.uid());
create policy "admin_write_users" on user_profiles for all using (is_admin());
create policy "insert_profile" on user_profiles for insert with check (id = auth.uid());
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/002_rls_policies.sql
git commit -m "feat: add RLS policies and role helper functions"
```

---

## Task 4: Migration 003 — seed data

**Files:**
- Create: `supabase/migrations/003_seed_data.sql`

- [ ] **Step 1: Write the migration file**

```sql
-- supabase/migrations/003_seed_data.sql

-- Product categories
insert into product_categories (slug, name_en, name_fr, sort_order) values
  ('humanoid',   'Humanoid Robots',    'Robots Humanoïdes',  1),
  ('education',  'Education Robots',   'Robots Éducatifs',   2),
  ('commercial', 'Commercial Robots',  'Robots Commerciaux', 3),
  ('healthcare', 'Healthcare Robots',  'Robots Médicaux',    4),
  ('logistics',  'Logistics Robots',   'Robots Logistiques', 5),
  ('consumer',   'Consumer Robots',    'Robots Grand Public',6)
on conflict (slug) do nothing;

-- Milestones
insert into milestones (year, title_en, title_fr, description_en, description_fr, sort_order) values
  (2015, 'Company Founded',         'Fondation de l''entreprise',
   '13698491 Canada Inc. was incorporated in Milton, Ontario.',
   '13698491 Canada Inc. a été incorporée à Milton, Ontario.', 1),
  (2017, 'First Prototype',         'Premier Prototype',
   'Raasbot completed its first working robotics prototype.',
   'Raasbot a terminé son premier prototype robotique fonctionnel.', 2),
  (2019, 'Commercial Launch',       'Lancement Commercial',
   'Raasbot launched its first commercial robotics product line.',
   'Raasbot a lancé sa première gamme de produits robotiques commerciaux.', 3),
  (2021, 'Healthcare Partnership',  'Partenariat Santé',
   'Raasbot partnered with healthcare providers to deploy assistive robots.',
   'Raasbot s''est associé à des prestataires de soins de santé pour déployer des robots d''assistance.', 4),
  (2023, 'Education Program',       'Programme Éducatif',
   'Launched the Raasbot Education Program for schools across Canada.',
   'Lancement du programme éducatif Raasbot pour les écoles à travers le Canada.', 5),
  (2025, 'Humanoid Division',       'Division Humanoïde',
   'Raasbot established its dedicated humanoid robotics research division.',
   'Raasbot a créé sa division de recherche en robotique humanoïde.', 6)
on conflict do nothing;

-- Site settings
insert into site_settings (key, value) values
  ('company_name',    '"13698491 Canada Inc."'),
  ('brand_name',      '"Raasbot"'),
  ('address',         '"1202 Stirling Todd Terrace, Milton, Ontario, Canada"'),
  ('phone',           '"+1 (905) 555-0100"'),
  ('email',           '"info@raasbot.com"'),
  ('social_links',    '{"twitter": "", "linkedin": "", "youtube": ""}'),
  ('currency',        '"usd"'),
  ('stripe_enabled',  'true')
on conflict (key) do nothing;

-- Sample solutions
insert into solutions (slug, section, title_en, title_fr, body_en, body_fr, published) values
  ('manufacturing-automation', 'industry',
   'Manufacturing Automation',     'Automatisation de la fabrication',
   'Raasbot robots integrate seamlessly into manufacturing lines, increasing throughput and reducing error rates.',
   'Les robots Raasbot s''intègrent parfaitement dans les lignes de fabrication, augmentant le débit et réduisant les taux d''erreur.',
   true),
  ('elder-care-assistance',    'healthcare',
   'Elder Care Assistance',        'Assistance aux personnes âgées',
   'Our healthcare robots provide companionship and daily living assistance for elderly patients.',
   'Nos robots de santé offrent compagnie et assistance pour les activités quotidiennes des patients âgés.',
   true),
  ('warehouse-logistics',      'logistics',
   'Warehouse Logistics',          'Logistique d''entrepôt',
   'Autonomous mobile robots optimise warehouse picking, packing, and inventory management.',
   'Les robots mobiles autonomes optimisent la cueillette, l''emballage et la gestion des stocks en entrepôt.',
   true),
  ('stem-education',           'education',
   'STEM Education',               'Éducation STEM',
   'Interactive robots make coding and engineering accessible for students from grade 4 through university.',
   'Les robots interactifs rendent la programmation et l''ingénierie accessibles aux étudiants du primaire à l''université.',
   true)
on conflict (slug) do nothing;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/003_seed_data.sql
git commit -m "feat: add seed data for categories, milestones, settings, and solutions"
```

---

## Task 5: Public contact route

**Files:**
- Create: `app/api/contact/route.ts`

- [ ] **Step 1: Write the file**

```ts
// app/api/contact/route.ts
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const ContactSchema = z.object({
  name:    z.string().min(1),
  email:   z.email(),
  subject: z.string().optional(),
  message: z.string().min(1),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      name:    parsed.data.name,
      email:   parsed.data.email,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
    })

  if (error) {
    console.error('contact insert error', error)
    return Response.json({ error: 'Failed to save message' }, { status: 500 })
  }

  return Response.json({ success: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors from `app/api/contact/route.ts`

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: add public contact form POST endpoint"
```

---

## Task 6: Public quote / RFQ route

**Files:**
- Create: `app/api/quote/route.ts`

- [ ] **Step 1: Write the file**

```ts
// app/api/quote/route.ts
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/index'

const QuoteSchema = z.object({
  name:            z.string().min(1),
  email:           z.email(),
  company:         z.string().optional(),
  productInterest: z.string().optional(),
  message:         z.string().min(1),
  depositOptional: z.boolean().optional().default(false),
  depositAmount:   z.number().positive().optional(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = QuoteSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const { name, email, company, productInterest, message, depositOptional, depositAmount } = parsed.data

  const supabase = await createClient()
  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      name,
      email,
      company:          company ?? null,
      product_interest: productInterest ?? null,
      message,
    })
    .select('id')
    .single()

  if (error || !quote) {
    console.error('quote insert error', error)
    return Response.json({ error: 'Failed to save quote' }, { status: 500 })
  }

  if (depositOptional && depositAmount && depositAmount > 0) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:                 'payment',
      line_items: [
        {
          price_data: {
            currency:     'usd',
            product_data: { name: `Quote Deposit — ${name}` },
            unit_amount:  Math.round(depositAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type:     'quote_deposit',
        quote_id: quote.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/quote/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/quote`,
    })

    return Response.json({ sessionUrl: session.url })
  }

  return Response.json({ success: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors from `app/api/quote/route.ts`

- [ ] **Step 3: Commit**

```bash
git add app/api/quote/route.ts
git commit -m "feat: add public quote/RFQ POST endpoint with optional Stripe deposit"
```

---

## Task 7: Shop checkout route

**Files:**
- Create: `app/api/shop/checkout/route.ts`

- [ ] **Step 1: Write the file**

```ts
// app/api/shop/checkout/route.ts
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/index'

const CheckoutSchema = z.object({
  items:  z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive() })).min(1),
  locale: z.string().optional().default('en'),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = CheckoutSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const { items, locale } = parsed.data
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const productIds = items.map(i => i.productId)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name_en, name_fr, price, stripe_product_id, stripe_price_id')
    .in('id', productIds)
    .eq('in_stock', true)

  if (error || !products || products.length !== items.length) {
    return Response.json({ error: 'One or more products not found or out of stock' }, { status: 400 })
  }

  const lineItems = items.map(item => {
    const product = products.find(p => p.id === item.productId)!
    const name    = locale === 'fr' ? product.name_fr : product.name_en
    return {
      price_data: {
        currency:     'usd',
        product_data: { name },
        unit_amount:  Math.round(Number(product.price) * 100),
      },
      quantity: item.quantity,
    }
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode:                 'payment',
    line_items:           lineItems,
    metadata: {
      type:    'purchase',
      user_id: user?.id ?? '',
      items:   JSON.stringify(items),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
  })

  return Response.json({ sessionUrl: session.url })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors from `app/api/shop/checkout/route.ts`

- [ ] **Step 3: Commit**

```bash
git add app/api/shop/checkout/route.ts
git commit -m "feat: add shop checkout Stripe session endpoint"
```

---

## Task 8: Shop rental route

**Files:**
- Create: `app/api/shop/rental/route.ts`

Note: `app/api/shop/rental/` directory does not exist yet — create it.

- [ ] **Step 1: Write the file**

```ts
// app/api/shop/rental/route.ts
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/index'

const RentalSchema = z.object({
  productId: z.string().uuid(),
  period:    z.enum(['daily', 'weekly', 'monthly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  locale:    z.string().optional().default('en'),
})

function calcTotal(
  period: 'daily' | 'weekly' | 'monthly',
  start: string,
  end: string,
  daily: number | null,
  weekly: number | null,
  monthly: number | null,
  deposit: number | null,
): number {
  const msPerDay = 86400_000
  const days = Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / msPerDay))
  let base = 0
  if (period === 'daily'   && daily   != null) base = daily   * days
  if (period === 'weekly'  && weekly  != null) base = weekly  * Math.ceil(days / 7)
  if (period === 'monthly' && monthly != null) base = monthly * Math.ceil(days / 30)
  return base + (deposit ?? 0)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = RentalSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const { productId, period, startDate, endDate, locale } = parsed.data
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('id, name_en, name_fr, rental_available, rental_price_daily, rental_price_weekly, rental_price_monthly, rental_deposit')
    .eq('id', productId)
    .single()

  if (error || !product || !product.rental_available) {
    return Response.json({ error: 'Product not available for rental' }, { status: 400 })
  }

  const total = calcTotal(
    period, startDate, endDate,
    Number(product.rental_price_daily)   || null,
    Number(product.rental_price_weekly)  || null,
    Number(product.rental_price_monthly) || null,
    Number(product.rental_deposit)       || null,
  )

  const name = locale === 'fr' ? product.name_fr : product.name_en

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode:                 'payment',
    line_items: [
      {
        price_data: {
          currency:     'usd',
          product_data: { name: `Rental: ${name} (${period})` },
          unit_amount:  Math.round(total * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      type:       'rental',
      product_id: productId,
      period,
      start_date: startDate,
      end_date:   endDate,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/rental/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/shop`,
  })

  return Response.json({ sessionUrl: session.url, total })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors from `app/api/shop/rental/route.ts`

- [ ] **Step 3: Commit**

```bash
git add app/api/shop/rental/route.ts
git commit -m "feat: add shop rental Stripe session endpoint"
```

---

## Task 9: Stripe webhook handler

**Files:**
- Create: `app/api/shop/webhook/route.ts`

Important: Stripe signature verification requires the raw request body as a string. Use `await request.text()` — do NOT call `request.json()`.

- [ ] **Step 1: Write the file**

```ts
// app/api/shop/webhook/route.ts
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe/index'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const rawBody = await request.text()
  const sig     = request.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed', err)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta    = session.metadata ?? {}

    if (meta.type === 'purchase') {
      const items = JSON.parse(meta.items ?? '[]') as { productId: string; quantity: number }[]
      const { data: order } = await supabase
        .from('orders')
        .insert({
          user_id:          meta.user_id || null,
          stripe_session_id: session.id,
          status:           'paid',
          items:            items,
          total:            (session.amount_total ?? 0) / 100,
          currency:         session.currency ?? 'usd',
        })
        .select('id')
        .single()

      if (order && items.length > 0) {
        const productIds = items.map(i => i.productId)
        const { data: products } = await supabase
          .from('products')
          .select('id, price')
          .in('id', productIds)

        const orderItems = items.map(item => {
          const product = (products ?? []).find(p => p.id === item.productId)
          return {
            order_id:   order.id,
            product_id: item.productId,
            quantity:   item.quantity,
            unit_price: Number(product?.price ?? 0),
          }
        })
        await supabase.from('order_items').insert(orderItems)
      }
    }

    if (meta.type === 'rental') {
      await supabase.from('rentals').insert({
        user_id:          meta.user_id || null,
        product_id:       meta.product_id,
        stripe_session_id: session.id,
        period:           meta.period,
        start_date:       meta.start_date,
        end_date:         meta.end_date,
        status:           'active',
        deposit_paid:     true,
        total_amount:     (session.amount_total ?? 0) / 100,
      })
    }

    if (meta.type === 'quote_deposit') {
      await supabase
        .from('quotes')
        .update({ deposit_paid: true, stripe_session_id: session.id, status: 'in_progress' })
        .eq('id', meta.quote_id)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('stripe_session_id', pi.id)
    await supabase
      .from('rentals')
      .update({ status: 'cancelled' })
      .eq('stripe_session_id', pi.id)
  }

  return Response.json({ received: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors from `app/api/shop/webhook/route.ts`

- [ ] **Step 3: Commit**

```bash
git add app/api/shop/webhook/route.ts
git commit -m "feat: add Stripe webhook handler for orders, rentals, and quote deposits"
```

---

## Task 10: Public products + news + solutions routes

**Files:**
- Create: `app/api/public/products/route.ts`
- Create: `app/api/public/news/route.ts`
- Create: `app/api/public/solutions/route.ts`

- [ ] **Step 1: Write public products route**

```ts
// app/api/public/products/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('id, slug, category_id, name_en, name_fr, description_en, description_fr, price, images, video_url, specs, in_stock, featured, rental_available, rental_price_daily, rental_price_weekly, rental_price_monthly, rental_deposit, stripe_price_id')
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  if (category) {
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', category)
      .single()
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (featured === 'true') query = query.eq('featured', true)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch products' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 2: Write public news route**

```ts
// app/api/public/news/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') ?? '20', 10)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title_en, title_fr, excerpt_en, excerpt_fr, cover_image, author_id, published_at')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return Response.json({ error: 'Failed to fetch news' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 3: Write public solutions route**

```ts
// app/api/public/solutions/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get('section')

  const supabase = await createClient()
  let query = supabase
    .from('solutions')
    .select('id, slug, section, title_en, title_fr, body_en, body_fr, hero_image, hero_video, meta')
    .eq('published', true)
    .order('created_at', { ascending: true })

  if (section) query = query.eq('section', section)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch solutions' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add app/api/public/products/route.ts app/api/public/news/route.ts app/api/public/solutions/route.ts
git commit -m "feat: add public products, news, and solutions GET endpoints"
```

---

## Task 11: Admin products routes

**Files:**
- Create: `app/api/admin/products/route.ts`
- Create: `app/api/admin/products/[id]/route.ts`

- [ ] **Step 1: Write products list + create route**

```ts
// app/api/admin/products/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const ProductCreateSchema = z.object({
  slug:                  z.string().min(1),
  category_id:           z.string().uuid().optional(),
  name_en:               z.string().min(1),
  name_fr:               z.string().min(1),
  description_en:        z.string().optional(),
  description_fr:        z.string().optional(),
  price:                 z.number().nonnegative().optional(),
  images:                z.array(z.string()).optional(),
  video_url:             z.string().optional(),
  specs:                 z.record(z.unknown()).optional(),
  in_stock:              z.boolean().optional(),
  featured:              z.boolean().optional(),
  rental_available:      z.boolean().optional(),
  rental_price_daily:    z.number().nonnegative().optional(),
  rental_price_weekly:   z.number().nonnegative().optional(),
  rental_price_monthly:  z.number().nonnegative().optional(),
  rental_deposit:        z.number().nonnegative().optional(),
  stripe_product_id:     z.string().optional(),
  stripe_price_id:       z.string().optional(),
})

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const supabase = await createAdminClient()
  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category_id', category)
  if (featured === 'true') query = query.eq('featured', true)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch products' }, { status: 500 })

  return Response.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ProductCreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ data }, { status: 201 })
}
```

- [ ] **Step 2: Write product single-item route**

```ts
// app/api/admin/products/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const ProductUpdateSchema = z.object({
  slug:                  z.string().min(1).optional(),
  category_id:           z.string().uuid().nullable().optional(),
  name_en:               z.string().min(1).optional(),
  name_fr:               z.string().min(1).optional(),
  description_en:        z.string().nullable().optional(),
  description_fr:        z.string().nullable().optional(),
  price:                 z.number().nonnegative().nullable().optional(),
  images:                z.array(z.string()).optional(),
  video_url:             z.string().nullable().optional(),
  specs:                 z.record(z.unknown()).optional(),
  in_stock:              z.boolean().optional(),
  featured:              z.boolean().optional(),
  rental_available:      z.boolean().optional(),
  rental_price_daily:    z.number().nonnegative().nullable().optional(),
  rental_price_weekly:   z.number().nonnegative().nullable().optional(),
  rental_price_monthly:  z.number().nonnegative().nullable().optional(),
  rental_deposit:        z.number().nonnegative().nullable().optional(),
  stripe_product_id:     z.string().nullable().optional(),
  stripe_price_id:       z.string().nullable().optional(),
}).strict()

export async function GET(_request: Request, ctx: RouteContext<'/admin/products/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return Response.json({ error: 'Product not found' }, { status: 404 })
  return Response.json({ data })
}

export async function PATCH(request: Request, ctx: RouteContext<'/admin/products/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ProductUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Product not found or update failed' }, { status: 404 })
  return Response.json({ data })
}

export async function DELETE(_request: Request, ctx: RouteContext<'/admin/products/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/products/route.ts app/api/admin/products/[id]/route.ts
git commit -m "feat: add admin product CRUD endpoints"
```

---

## Task 12: Admin orders routes

**Files:**
- Create: `app/api/admin/orders/route.ts`
- Create: `app/api/admin/orders/[id]/route.ts`

- [ ] **Step 1: Write orders list route**

```ts
// app/api/admin/orders/route.ts
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status    = searchParams.get('status')
  const dateFrom  = searchParams.get('from')
  const dateTo    = searchParams.get('to')

  const supabase = await createAdminClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (dateFrom) query = query.gte('created_at', dateFrom)
  if (dateTo)   query = query.lte('created_at', dateTo)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch orders' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 2: Write order single-item route**

```ts
// app/api/admin/orders/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const OrderUpdateSchema = z.object({
  status:          z.enum(['pending', 'paid', 'shipped', 'cancelled', 'refunded']).optional(),
  tracking_number: z.string().nullable().optional(),
  notes:           z.string().nullable().optional(),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/orders/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = OrderUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Order not found or update failed' }, { status: 404 })
  return Response.json({ data })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/orders/route.ts app/api/admin/orders/[id]/route.ts
git commit -m "feat: add admin orders list and status/tracking update endpoints"
```

---

## Task 13: Admin rentals routes

**Files:**
- Create: `app/api/admin/rentals/route.ts`
- Create: `app/api/admin/rentals/[id]/route.ts`

- [ ] **Step 1: Write rentals list route**

```ts
// app/api/admin/rentals/route.ts
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const period = searchParams.get('period')

  const supabase = await createAdminClient()
  let query = supabase
    .from('rentals')
    .select('*, products(id, name_en, name_fr)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (period) query = query.eq('period', period)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch rentals' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 2: Write rental single-item route**

```ts
// app/api/admin/rentals/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const RentalUpdateSchema = z.object({
  status: z.enum(['pending', 'active', 'completed', 'cancelled']).optional(),
  notes:  z.string().nullable().optional(),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/rentals/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = RentalUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('rentals')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Rental not found or update failed' }, { status: 404 })
  return Response.json({ data })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/rentals/route.ts app/api/admin/rentals/[id]/route.ts
git commit -m "feat: add admin rentals list and status update endpoints"
```

---

## Task 14: Admin quotes routes

**Files:**
- Create: `app/api/admin/quotes/route.ts`
- Create: `app/api/admin/quotes/[id]/route.ts`

- [ ] **Step 1: Write quotes list route**

```ts
// app/api/admin/quotes/route.ts
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const supabase = await createAdminClient()
  let query = supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch quotes' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 2: Write quotes single-item route**

```ts
// app/api/admin/quotes/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const QuoteUpdateSchema = z.object({
  status: z.enum(['new', 'in_progress', 'quoted', 'closed']).optional(),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/quotes/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = QuoteUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('quotes')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Quote not found or update failed' }, { status: 404 })
  return Response.json({ data })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/quotes/route.ts app/api/admin/quotes/[id]/route.ts
git commit -m "feat: add admin quotes list and status update endpoints"
```

---

## Task 15: Admin media upload route

**Files:**
- Create: `app/api/admin/media/upload/route.ts`

Note: The directory `app/api/admin/media/upload/` does not exist — create it inside `app/api/admin/media/`.

Supabase Storage: upload files to the bucket named `media`. The path convention is `<timestamp>-<filename>`. After upload, insert a record into the `media` table.

- [ ] **Step 1: Write the file**

```ts
// app/api/admin/media/upload/route.ts
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof Blob)) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  const filename = (file as File).name ?? `upload-${Date.now()}`
  const storagePath = `${Date.now()}-${filename}`
  const buffer     = await file.arrayBuffer()

  const supabase = await createAdminClient()

  const { error: uploadError } = await supabase
    .storage
    .from('media')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert:      false,
    })

  if (uploadError) {
    console.error('Storage upload error', uploadError)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase
    .storage
    .from('media')
    .getPublicUrl(storagePath)

  const { data: record, error: dbError } = await supabase
    .from('media')
    .insert({
      filename:    filename,
      url:         publicUrl,
      type:        file.type,
      size:        file.size,
      uploaded_by: auth.user.id,
    })
    .select()
    .single()

  if (dbError) {
    console.error('Media record insert error', dbError)
    return Response.json({ error: 'Failed to save media record' }, { status: 500 })
  }

  return Response.json({ data: record, url: publicUrl }, { status: 201 })
}
```

- [ ] **Step 2: Create the upload directory and verify TypeScript compiles**

Run:
```bash
mkdir -p /Users/bilawalmuzaffar/raasbot/app/api/admin/media/upload
cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/media/upload/route.ts
git commit -m "feat: add admin media multipart upload endpoint"
```

---

## Task 16: Admin news routes

**Files:**
- Create: `app/api/admin/news/route.ts`
- Create: `app/api/admin/news/[id]/route.ts`

- [ ] **Step 1: Write news list + create route**

```ts
// app/api/admin/news/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const NewsCreateSchema = z.object({
  slug:        z.string().min(1),
  title_en:    z.string().min(1),
  title_fr:    z.string().min(1),
  body_en:     z.string().optional(),
  body_fr:     z.string().optional(),
  excerpt_en:  z.string().optional(),
  excerpt_fr:  z.string().optional(),
  cover_image: z.string().optional(),
  published_at: z.string().datetime().nullable().optional(),
})

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const published = searchParams.get('published')

  const supabase = await createAdminClient()
  let query = supabase
    .from('news_posts')
    .select('id, slug, title_en, title_fr, excerpt_en, excerpt_fr, cover_image, author_id, published_at, created_at')
    .order('created_at', { ascending: false })

  if (published === 'true')  query = query.not('published_at', 'is', null)
  if (published === 'false') query = query.is('published_at', null)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch news' }, { status: 500 })

  return Response.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = NewsCreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('news_posts')
    .insert({ ...parsed.data, author_id: auth.user.id })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data }, { status: 201 })
}
```

- [ ] **Step 2: Write news single-item route**

```ts
// app/api/admin/news/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const NewsUpdateSchema = z.object({
  slug:         z.string().min(1).optional(),
  title_en:     z.string().min(1).optional(),
  title_fr:     z.string().min(1).optional(),
  body_en:      z.string().nullable().optional(),
  body_fr:      z.string().nullable().optional(),
  excerpt_en:   z.string().nullable().optional(),
  excerpt_fr:   z.string().nullable().optional(),
  cover_image:  z.string().nullable().optional(),
  published_at: z.string().datetime().nullable().optional(),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/news/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = NewsUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('news_posts')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'News post not found or update failed' }, { status: 404 })
  return Response.json({ data })
}

export async function DELETE(_request: Request, ctx: RouteContext<'/admin/news/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from('news_posts').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/news/route.ts app/api/admin/news/[id]/route.ts
git commit -m "feat: add admin news CRUD endpoints"
```

---

## Task 17: Admin users routes

**Files:**
- Create: `app/api/admin/users/route.ts`
- Create: `app/api/admin/users/[id]/route.ts`

Both routes require `requireAdminOnly()` — only the `admin` role, not editors.

- [ ] **Step 1: Write users list route**

```ts
// app/api/admin/users/route.ts
import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdminOnly()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, role, name, company, phone, created_at')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: 'Failed to fetch users' }, { status: 500 })

  return Response.json({ data })
}
```

- [ ] **Step 2: Write user role update route**

```ts
// app/api/admin/users/[id]/route.ts
import { z } from 'zod'
import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const UserUpdateSchema = z.object({
  role: z.enum(['admin', 'editor', 'customer']),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/users/[id]'>) {
  const auth = await requireAdminOnly()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = UserUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ role: parsed.data.role })
    .eq('id', id)
    .select('id, role, name, company, phone, created_at')
    .single()

  if (error || !data) return Response.json({ error: 'User not found or update failed' }, { status: 404 })
  return Response.json({ data })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/users/route.ts app/api/admin/users/[id]/route.ts
git commit -m "feat: add admin user list and role update endpoints"
```

---

## Task 18: Admin settings route

**Files:**
- Create: `app/api/admin/settings/route.ts`

Only the `admin` role (not editor) may write settings. Reads are also admin-only here (admins manage settings, public reads hit the database directly via RLS for public keys).

- [ ] **Step 1: Write the file**

```ts
// app/api/admin/settings/route.ts
import { z } from 'zod'
import { requireAdminOnly } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const SettingsPatchSchema = z.object({
  key:   z.string().min(1),
  value: z.unknown(),
})

export async function GET() {
  const auth = await requireAdminOnly()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('key')

  if (error) return Response.json({ error: 'Failed to fetch settings' }, { status: 500 })

  return Response.json({ data })
}

export async function PATCH(request: Request) {
  const auth = await requireAdminOnly()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = SettingsPatchSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key: parsed.data.key, value: parsed.data.value, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/settings/route.ts
git commit -m "feat: add admin site settings GET and PATCH endpoints"
```

---

## Task 19: Admin banners routes

**Files:**
- Create: `app/api/admin/banners/route.ts`
- Create: `app/api/admin/banners/[id]/route.ts`

- [ ] **Step 1: Write banners list + create route**

```ts
// app/api/admin/banners/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const BannerCreateSchema = z.object({
  page_slug:    z.string().min(1),
  image_en:     z.string().optional(),
  image_fr:     z.string().optional(),
  video_url:    z.string().optional(),
  cta_text_en:  z.string().optional(),
  cta_text_fr:  z.string().optional(),
  cta_link:     z.string().optional(),
  sort_order:   z.number().int().optional(),
  active:       z.boolean().optional(),
})

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const pageSlug = searchParams.get('page_slug')

  const supabase = await createAdminClient()
  let query = supabase
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true })

  if (pageSlug) query = query.eq('page_slug', pageSlug)

  const { data, error } = await query
  if (error) return Response.json({ error: 'Failed to fetch banners' }, { status: 500 })

  return Response.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BannerCreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('banners')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data }, { status: 201 })
}
```

- [ ] **Step 2: Write banner single-item route**

```ts
// app/api/admin/banners/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const BannerUpdateSchema = z.object({
  page_slug:   z.string().min(1).optional(),
  image_en:    z.string().nullable().optional(),
  image_fr:    z.string().nullable().optional(),
  video_url:   z.string().nullable().optional(),
  cta_text_en: z.string().nullable().optional(),
  cta_text_fr: z.string().nullable().optional(),
  cta_link:    z.string().nullable().optional(),
  sort_order:  z.number().int().optional(),
  active:      z.boolean().optional(),
})

export async function PATCH(request: Request, ctx: RouteContext<'/admin/banners/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = BannerUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('banners')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Banner not found or update failed' }, { status: 404 })
  return Response.json({ data })
}

export async function DELETE(_request: Request, ctx: RouteContext<'/admin/banners/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from('banners').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/banners/route.ts app/api/admin/banners/[id]/route.ts
git commit -m "feat: add admin banners CRUD endpoints"
```

---

## Task 20: Admin pages routes

**Files:**
- Create: `app/api/admin/pages/route.ts`
- Create: `app/api/admin/pages/[id]/route.ts`

- [ ] **Step 1: Write pages list + create route**

```ts
// app/api/admin/pages/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const PageCreateSchema = z.object({
  slug:        z.string().min(1),
  title_en:    z.string().min(1),
  title_fr:    z.string().min(1),
  content_en:  z.string().optional(),
  content_fr:  z.string().optional(),
  hero_image:  z.string().optional(),
  hero_video:  z.string().optional(),
  published:   z.boolean().optional(),
})

export async function GET() {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .select('id, slug, title_en, title_fr, published, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: 'Failed to fetch pages' }, { status: 500 })
  return Response.json({ data })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PageCreateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data }, { status: 201 })
}
```

- [ ] **Step 2: Write page single-item route**

```ts
// app/api/admin/pages/[id]/route.ts
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/server'
import { createAdminClient } from '@/lib/supabase/server'

const PageUpdateSchema = z.object({
  slug:       z.string().min(1).optional(),
  title_en:   z.string().min(1).optional(),
  title_fr:   z.string().min(1).optional(),
  content_en: z.string().nullable().optional(),
  content_fr: z.string().nullable().optional(),
  hero_image: z.string().nullable().optional(),
  hero_video: z.string().nullable().optional(),
  published:  z.boolean().optional(),
})

export async function GET(_request: Request, ctx: RouteContext<'/admin/pages/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return Response.json({ error: 'Page not found' }, { status: 404 })
  return Response.json({ data })
}

export async function PATCH(request: Request, ctx: RouteContext<'/admin/pages/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = PageUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 400 })
  }

  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('pages')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) return Response.json({ error: 'Page not found or update failed' }, { status: 404 })
  return Response.json({ data })
}

export async function DELETE(_request: Request, ctx: RouteContext<'/admin/pages/[id]'>) {
  const auth = await requireAdmin()
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createAdminClient()
  const { error } = await supabase.from('pages').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `cd /Users/bilawalmuzaffar/raasbot && npx tsc --noEmit 2>&1 | head -30`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/pages/route.ts app/api/admin/pages/[id]/route.ts
git commit -m "feat: add admin CMS pages CRUD endpoints"
```

---

## Self-Review Checklist

**Spec coverage:**

| Spec requirement | Task |
|---|---|
| `001_initial_schema.sql` | Task 2 |
| `002_rls_policies.sql` | Task 3 |
| `003_seed_data.sql` (categories, milestones, settings, solutions) | Task 4 |
| `lib/auth/server.ts` (requireAdmin, requireAdminOnly) | Task 1 |
| `app/api/contact/route.ts` POST | Task 5 |
| `app/api/quote/route.ts` POST (with optional Stripe deposit) | Task 6 |
| `app/api/shop/checkout/route.ts` POST | Task 7 |
| `app/api/shop/rental/route.ts` POST | Task 8 |
| `app/api/shop/webhook/route.ts` POST (purchase, rental, quote_deposit, payment_failed) | Task 9 |
| `app/api/public/products/route.ts` GET | Task 10 |
| `app/api/public/news/route.ts` GET | Task 10 |
| `app/api/admin/products/route.ts` GET+POST | Task 11 |
| `app/api/admin/products/[id]/route.ts` GET+PATCH+DELETE | Task 11 |
| `app/api/admin/orders/route.ts` GET | Task 12 |
| `app/api/admin/orders/[id]/route.ts` PATCH | Task 12 |
| `app/api/admin/rentals/route.ts` GET | Task 13 |
| `app/api/admin/rentals/[id]/route.ts` PATCH | Task 13 |
| `app/api/admin/quotes/route.ts` GET | Task 14 |
| `app/api/admin/quotes/[id]/route.ts` PATCH | Task 14 |
| `app/api/admin/media/upload/route.ts` POST multipart | Task 15 |
| `app/api/admin/news/route.ts` GET+POST | Task 16 |
| `app/api/admin/news/[id]/route.ts` PATCH+DELETE | Task 16 |
| `app/api/admin/users/route.ts` GET (admin only) | Task 17 |
| `app/api/admin/users/[id]/route.ts` PATCH role (admin only) | Task 17 |
| `app/api/admin/settings/route.ts` GET+PATCH | Task 18 |
| `app/api/admin/banners/route.ts` GET+POST | Task 19 |
| `app/api/admin/banners/[id]/route.ts` PATCH+DELETE | Task 19 |
| `app/api/admin/pages/route.ts` GET+POST | Task 20 |
| `app/api/admin/pages/[id]/route.ts` GET+PATCH+DELETE | Task 20 |
| `app/api/public/solutions/route.ts` GET | Task 10 |

All spec requirements covered. No gaps found.

**Placeholder scan:** No TBD, TODO, or vague instructions found.

**Type consistency:**
- `requireAdmin()` defined in Task 1, used in Tasks 11-16, 18-20.
- `requireAdminOnly()` defined in Task 1, used in Tasks 17 and 18.
- `createAdminClient()` from `@/lib/supabase/server` — consistent throughout.
- `RouteContext<'/admin/products/[id]'>` pattern used consistently per Next.js 16.2.6 docs.
- `stripe` singleton from `@/lib/stripe/index` — consistent in Tasks 6, 7, 8, 9.
- `STRIPE_WEBHOOK_SECRET` from `@/lib/stripe/index` — used in Task 9 only.
- Zod `.safeParse()` used throughout, no `.parse()` (avoids unhandled throws).
