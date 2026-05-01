import { redirect } from 'next/navigation';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';

export default async function BlogNewPostRedirectPage() {
  const client = getSupabaseServerClient();
  const { data } = await client.auth.getClaims();

  if (data?.claims) {
    redirect(pathsConfig.app.createPost);
  }

  const next = encodeURIComponent(pathsConfig.app.createPost);
  redirect(`${pathsConfig.auth.signUp}?next=${next}`);
}

