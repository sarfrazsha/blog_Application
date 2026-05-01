'use server';

import { redirect } from 'next/navigation';

import { enhanceAction } from '@kit/next/actions';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { createPost } from '~/lib/server/blog/service';

import { CreatePostSchema } from './create-post.schema';

export const createPostAction = enhanceAction(
  async (data, user) => {
    const client = getSupabaseServerClient();
    const { data: sessionData } = await client.auth.getSession();

    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      throw new Error('Authentication session not found');
    }

    const authorName =
      (user.user_metadata?.name as string | undefined) ??
      user.email ??
      'Anonymous';

    const postId = await createPost({
      title: data.title,
      body: data.body,
      authorId: user.sub,
      authorName,
      accessToken,
    });

    redirect(`/blog/${postId}`);
  },
  {
    schema: CreatePostSchema,
  },
);
