# Blog App Interview Walkthrough (5-10 minutes)

## 1) Problem and goals (30-45 seconds)
- I built a blog app on top of Makerkit using Next.js App Router, Supabase auth/database, and strict Supabase GraphQL for blog data access.
- Core requirements implemented: public post list with pagination, post detail page, and authenticated create-post flow.
- Authentication supports email/password and Google OAuth through existing Makerkit + Supabase configuration.

## 2) Architecture overview (1-2 minutes)
- **Frontend framework:** Next.js App Router in `apps/web/app`.
- **Auth and route protection:** Makerkit conventions under `/home` with middleware and server-side user checks.
- **Backend/data:** Supabase PostgreSQL with RLS policies.
- **Data API contract:** all blog reads/writes go through Supabase GraphQL (`/graphql/v1`).

## 3) Data model + security (1 minute)
- Added `public.blog_posts` table with:
  - `id`, `title`, `body`, `author_id`, `author_name`, `published_at`, `created_at`.
- RLS policies:
  - public read access for blog listing/details,
  - authenticated insert only when `author_id = auth.uid()`.
- This prevents spoofing ownership while keeping the blog publicly visible.

## 4) Feature demo flow (3-4 minutes)

### Public pages
1. Open `/blog`.
2. Show paginated list (5 per page): title, excerpt (first 200 chars), date, author.
3. Click a post title to open `/blog/[id]` and show full post content.

### Auth + create
1. Sign in via email/password or Google.
2. Open `/home/blog/new`.
3. Show required validation on `title` and `body`.
4. Submit new post; server action runs GraphQL mutation and redirects to the post detail page.
5. Return to `/blog` and confirm it appears in list order.

## 5) Implementation highlights (1-2 minutes)
- GraphQL access is centralized in:
  - `apps/web/lib/server/blog/graphql-client.ts`
  - `apps/web/lib/server/blog/queries.ts`
  - `apps/web/lib/server/blog/service.ts`
- Create-post is handled with Makerkit `enhanceAction` and zod schema in:
  - `apps/web/app/home/blog/new/_lib/server-actions.ts`
  - `apps/web/app/home/blog/new/_lib/create-post.schema.ts`
- UI pages:
  - `apps/web/app/(marketing)/blog/page.tsx`
  - `apps/web/app/(marketing)/blog/[id]/page.tsx`
  - `apps/web/app/home/blog/new/page.tsx`

## 6) Testing/verification summary (45-60 seconds)
- Verified route behavior:
  - public users can access `/blog` and `/blog/[id]`,
  - unauthenticated users cannot use `/home/blog/new`.
- Verified successful create mutation and post visibility.
- Ran lint/typecheck/build checks before submission.

## 7) Close (15-20 seconds)
- This structure keeps auth and security aligned with Makerkit patterns while strictly meeting the Supabase GraphQL assignment requirement.
- If extended further, I would add ISR, optimistic UI, and profile dropdown enhancements next.
