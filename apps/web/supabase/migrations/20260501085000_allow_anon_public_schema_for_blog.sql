/*
 * -------------------------------------------------------
 * Section: Public blog GraphQL read access
 * Makerkit revokes public schema usage from anon by default.
 * Re-enable usage so anon can query public.blog_posts via GraphQL.
 * -------------------------------------------------------
 */
grant usage on schema public to anon;
