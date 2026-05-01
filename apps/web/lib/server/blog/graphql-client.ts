import 'server-only';

import { z } from 'zod';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function runSupabaseGraphqlQuery<TData>(
  query: string,
  variables: Record<string, unknown>,
  accessToken?: string,
) {
  const { url, anonKey } = z
    .object({
      url: z.string().url(),
      anonKey: z.string().min(1),
    })
    .parse({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

  const endpoint = new URL('/graphql/v1', url).toString();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      authorization: `Bearer ${accessToken ?? anonKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Supabase GraphQL request failed');
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).join(', ');

    if (message.includes('pg_graphql extension is not enabled')) {
      throw new Error(
        'Supabase GraphQL is disabled. Enable the pg_graphql extension and run migrations.',
      );
    }

    throw new Error(message);
  }

  if (!payload.data) {
    throw new Error('No data returned from Supabase GraphQL');
  }

  return payload.data;
}
