/*
 * -------------------------------------------------------
 * Section: Supabase GraphQL
 * Enable pg_graphql and expose graphql_public schema usage
 * -------------------------------------------------------
 */
create extension if not exists pg_graphql with schema graphql;

grant usage on schema graphql_public to anon, authenticated, service_role;

grant execute on function graphql_public.graphql(text, text, jsonb, jsonb) to anon, authenticated, service_role;
