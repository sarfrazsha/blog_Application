# Blogger

A modern blog application built with **Next.js (App Router)**, **Supabase**, and a customized starter-kit foundation.

## Live Demo
 still we have not deployed this project.

---

## Features

### Core features
- **Landing page** (`/`): simple static homepage (text-only)
- **Blog feed** (`/blog`): paginated list of blog posts (**5 per page**) showing:
  - title
  - excerpt (first ~200 characters)
  - published date
  - author name
- **Post details** (`/blog/[id]`): full blog post view
- **Create post (protected)** (`/home/blog/new`): authenticated users can create new posts
- **Create post gate** (`/blog/new`):
  - if logged in → redirects to `/home/blog/new`
  - if logged out → redirects to `/auth/sign-up?next=/home/blog/new`

### Authentication
- **Email/Password**: sign up and sign in
- **Google OAuth**: sign in with Google account (after enabling in Supabase)
- **Protected routes**: all routes under `/home/*` require authentication

### UX / quality
- **Numbered pagination** with active page highlight + Previous/Next + ellipses for large page counts
- **Branding updates**: custom homepage + custom SVG logo/icon
- **Hydration warning fix**: removed non-deterministic demo values that caused SSR/client mismatch warnings
- **Validation**: create-post form is validated via Zod schema

---

## Tech stack
- **Next.js** (App Router)
- **Supabase** (Auth + Postgres)
- **TypeScript**
- **Tailwind CSS**
- **Zod** (validation)

---

## Getting started

### Prerequisites
- Node.js 18+ (LTS recommended)
- PNPM
- Supabase cloud project (**recommended**)

### Installation

1) **Clone the repository**

```bash
git clone https://github.com/sarfrazsha/blog_Application.git
cd nextjs-saas-starter-kit-lite
```

2) **Install dependencies**

```bash
pnpm install
```

---

## Option A: Using Remote Supabase (Recommended)

### 1) Create a Supabase project
Create a project in the Supabase Dashboard.

### 2) Configure environment variables
Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional auth toggles (UI)
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=false
```

Get keys from Supabase Dashboard → **Project Settings → API**.

### 3) Link to Supabase and push migrations

```bash
pnpm --filter web supabase login
pnpm --filter web supabase link --project-ref YOUR_PROJECT_REF
pnpm --filter web supabase db push
```

---

## Option B: Local Supabase (Docker) (Optional)
This project can run with local Supabase too, but it’s optional. If you use it, you’ll need Docker.

```bash
pnpm run supabase:web:start
pnpm run supabase:web:reset
```

Then set your local Supabase URL/keys in `apps/web/.env.local`.

---

## Run the application

```bash
pnpm run dev
```

Visit:
- `http://localhost:3000/`
- `http://localhost:3000/blog`

---

## Linking to a Supabase project (quick recap)

```bash
pnpm --filter web supabase login
pnpm --filter web supabase link --project-ref YOUR_PROJECT_REF
pnpm --filter web supabase db push
```

---

## Authentication configuration

### Email/Password authentication
Enabled via env toggle:

```env
NEXT_PUBLIC_AUTH_PASSWORD=true
```

### Google OAuth

1) Create OAuth credentials in Google Cloud Console

2) Add authorized redirect URI:
- Production/Cloud Supabase:
  - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

3) Enable Google provider in Supabase Dashboard:
- Authentication → Providers → Google
- Add Client ID and Client Secret

4) Configure Supabase URL settings:
Supabase Dashboard → Authentication → URL Configuration
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

5) App-side provider config (already enabled):
- `apps/web/config/auth.config.ts` → `providers.oAuth: ['google']`

---

## Database schema

### Blog posts migration
Schema + RLS policies live in:
- `apps/web/supabase/migrations/20260501073000_blog_posts.sql`

RLS behavior:
- **SELECT**: public (anon + authenticated)
- **INSERT**: authenticated only, and must match the current user’s `author_id`

---

## Project structure (relevant)

```
apps/web/
├── app/
│   ├── (marketing)/              # public landing (includes "/")
│   ├── (marketing)/blog/         # blog feed + details
│   ├── auth/                     # auth pages
│   └── home/                     # protected area (create post)
├── lib/server/blog/              # blog service layer (GraphQL + count)
└── supabase/migrations/          # database migrations
```

Key files:
- Landing page: `apps/web/app/(marketing)/page.tsx`
- Blog feed: `apps/web/app/(marketing)/blog/page.tsx`
- Post details: `apps/web/app/(marketing)/blog/[id]/page.tsx`
- Create post: `apps/web/app/home/blog/new/page.tsx`
- Gate route: `apps/web/app/(marketing)/blog/new/page.tsx`
- Blog service: `apps/web/lib/server/blog/service.ts`
- Create-post validation: `apps/web/app/home/blog/new/_lib/create-post.schema.ts`

---

## Deployment (example)
Deploy to any platform that supports Next.js (Vercel/Netlify/etc). Ensure you set these env vars in your host:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_AUTH_PASSWORD`
- `NEXT_PUBLIC_AUTH_MAGIC_LINK`

Also update Supabase Authentication → URL Configuration:
- Site URL: your production URL
- Redirect URLs: include your production domain (e.g. `https://your-domain.com/**`)

---

## Scripts

```bash
# Development
pnpm run dev

# Linting
pnpm run lint

# Type checking
pnpm run typecheck
```

