/*
 * -------------------------------------------------------
 * Section: Blog Posts
 * Publicly readable posts, authenticated users can create
 * -------------------------------------------------------
 */
create table if not exists public.blog_posts
(
    id           uuid primary key      default extensions.uuid_generate_v4(),
    title        varchar(150) not null,
    body         text         not null,
    author_id    uuid         not null references auth.users (id) on delete cascade,
    author_name  varchar(255) not null,
    published_at timestamptz  not null default now(),
    created_at   timestamptz  not null default now()
);

comment on table public.blog_posts is 'Blog posts created by authenticated users';
comment on column public.blog_posts.author_id is 'The id of the user who created the post';
comment on column public.blog_posts.author_name is 'Display name of the author at publish time';

create index if not exists idx_blog_posts_published_at_desc
    on public.blog_posts (published_at desc);

alter table public.blog_posts
    enable row level security;

-- Public read access for the blog pages
create policy blog_posts_read on public.blog_posts
    for select
    to anon, authenticated
    using (true);

-- Authenticated users can create only their own posts
create policy blog_posts_insert on public.blog_posts
    for insert
    to authenticated
    with check ((select auth.uid()) = author_id);

revoke all on public.blog_posts
    from
    authenticated,
    service_role,
    anon;

grant select on public.blog_posts to anon, authenticated, service_role;
grant insert on public.blog_posts to authenticated, service_role;
