import 'server-only';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

import {
  CREATE_POST_MUTATION,
  CREATE_POST_MUTATION_SNAKE_CASE,
  GET_PAGINATED_POSTS_QUERY,
  GET_PAGINATED_POSTS_QUERY_SNAKE_CASE,
  GET_POST_BY_ID_QUERY,
  GET_POST_BY_ID_QUERY_SNAKE_CASE,
} from './queries';
import { runSupabaseGraphqlQuery } from './graphql-client';
import type { BlogPost, PaginatedBlogPosts } from './types';

type BlogPostsCollectionNode = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorId: string;
  publishedAt: string;
};

type BlogCollectionResponse = {
  blogPostsCollection: {
    edges: Array<{
      node: BlogPostsCollectionNode;
    }>;
  };
};

type PostByIdResponse = {
  blogPostsCollection: {
    edges: Array<{
      node: BlogPostsCollectionNode;
    }>;
  };
};

type CreatePostResponse = {
  insertIntoblogPostsCollection: {
    records: Array<{ id: string }>;
  };
};

function toBlogPost(node: BlogPostsCollectionNode): BlogPost {
  return {
    id: node.id,
    title: node.title,
    body: node.body,
    authorName: node.authorName,
    authorId: node.authorId,
    publishedAt: node.publishedAt,
  };
}

export async function getPaginatedPosts(params: {
  page: number;
  pageSize: number;
}): Promise<PaginatedBlogPosts> {
  const offset = (params.page - 1) * params.pageSize;
  const requestPageSize = params.pageSize + 1;

  const variables = {
    first: requestPageSize,
    offset,
  };

  const response = await runWithCollectionFallback<BlogCollectionResponse>(
    GET_PAGINATED_POSTS_QUERY,
    GET_PAGINATED_POSTS_QUERY_SNAKE_CASE,
    variables,
  );

  const posts = response.blogPostsCollection.edges.map((edge) => toBlogPost(edge.node));
  const hasNextPage = posts.length > params.pageSize;

  return {
    posts: hasNextPage ? posts.slice(0, params.pageSize) : posts,
    hasNextPage,
  };
}

export async function getPostsCount() {
  // The generated Database types in this starter may not include the custom
  // `blog_posts` table. Use a loose schema here to keep typecheck/build green.
  const client = getSupabaseServerClient<any>();

  const { count, error } = await client
    .from('blog_posts')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getPostById(id: string) {
  const response = await runWithCollectionFallback<PostByIdResponse>(
    GET_POST_BY_ID_QUERY,
    GET_POST_BY_ID_QUERY_SNAKE_CASE,
    { id },
  );

  const node = response.blogPostsCollection.edges[0]?.node;

  return node ? toBlogPost(node) : null;
}

export async function createPost(params: {
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  accessToken: string;
}) {
  const variables = {
    title: params.title,
    body: params.body,
    authorId: params.authorId,
    authorName: params.authorName,
  };

  const response = await runWithCollectionFallback<CreatePostResponse>(
    CREATE_POST_MUTATION,
    CREATE_POST_MUTATION_SNAKE_CASE,
    variables,
    params.accessToken,
  );

  const createdPostId = response.insertIntoblogPostsCollection.records[0]?.id;

  if (!createdPostId) {
    throw new Error('Failed to create post');
  }

  return createdPostId;
}

async function runWithCollectionFallback<TResponse>(
  camelCaseQuery: string,
  snakeCaseQuery: string,
  variables: Record<string, unknown>,
  accessToken?: string,
) {
  try {
    return await runSupabaseGraphqlQuery<TResponse>(
      camelCaseQuery,
      variables,
      accessToken,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '';

    if (!message.includes('Unknown field')) {
      throw error;
    }

    return runSupabaseGraphqlQuery<TResponse>(
      snakeCaseQuery,
      variables,
      accessToken,
    );
  }
}
