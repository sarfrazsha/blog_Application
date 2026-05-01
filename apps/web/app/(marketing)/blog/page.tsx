import Link from 'next/link';

import { Button } from '@kit/ui/button';

import { withI18n } from '~/lib/i18n/with-i18n';
import { getPaginatedPosts } from '~/lib/server/blog/service';

const PAGE_SIZE = 5;

async function BlogPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const currentPage = parsePageParam(searchParams.page);

  const { posts, hasNextPage } = await getPaginatedPosts({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const hasPrevious = currentPage > 1;
  const hasNext = hasNextPage;

  return (
    <main className={'container mx-auto max-w-4xl px-4 py-12'}>
      <div className={'mb-8 flex items-start justify-between gap-4'}>
        <div>
          <h1 className={'text-3xl font-semibold'}>Blog</h1>
          <p className={'text-muted-foreground mt-2'}>
            Read the latest posts from our writers.
          </p>
        </div>

        <Button asChild>
          <Link href={'/blog/new'}>Create post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className={'text-muted-foreground'}>No posts published yet.</p>
      ) : (
        <div className={'space-y-6'}>
          {posts.map((post) => {
            const excerpt =
              post.body.length > 200
                ? `${post.body.slice(0, 200).trim()}...`
                : post.body;

            return (
              <article key={post.id} className={'rounded-lg border p-6'}>
                <h2 className={'text-2xl font-semibold'}>
                  <Link href={`/blog/${post.id}`} className={'hover:underline'}>
                    {post.title}
                  </Link>
                </h2>

                <p className={'text-muted-foreground mt-2 text-sm'}>
                  {formatDate(post.publishedAt)} by {post.authorName}
                </p>

                <p className={'mt-4 leading-7'}>{excerpt}</p>
              </article>
            );
          })}
        </div>
      )}

      <div className={'mt-10 flex items-center justify-between'}>
        {hasPrevious ? (
          <Link
            href={buildBlogPageHref(currentPage - 1)}
            className={'text-sm underline'}
          >
            Previous
          </Link>
        ) : (
          <span />
        )}

        <span className={'text-muted-foreground text-sm'}>Page {currentPage}</span>

        {hasNext ? (
          <Link
            href={buildBlogPageHref(currentPage + 1)}
            className={'text-sm underline'}
          >
            Next
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}

export default withI18n(BlogPage);

function parsePageParam(value: string | string[] | undefined) {
  if (!value || Array.isArray(value)) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildBlogPageHref(page: number) {
  if (page <= 1) {
    return '/blog';
  }

  return `/blog?page=${page}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
