import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@kit/ui/button';
import { cn } from '@kit/ui/utils';

import { withI18n } from '~/lib/i18n/with-i18n';
import { getPaginatedPosts, getPostsCount } from '~/lib/server/blog/service';

const PAGE_SIZE = 5;

async function BlogPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = (await props.searchParams) ?? {};
  const currentPage = parsePageParam(searchParams.page);

  const [{ posts, hasNextPage }, postsCount] = await Promise.all([
    getPaginatedPosts({
      page: currentPage,
      pageSize: PAGE_SIZE,
    }),
    getPostsCount(),
  ]);

  const totalPages = Math.max(1, Math.ceil(postsCount / PAGE_SIZE));

  if (currentPage > totalPages) {
    redirect(buildBlogPageHref(totalPages));
  }

  const hasPrevious = currentPage > 1;
  const hasNext = hasNextPage;

  const { pages, showLeftEllipsis, showRightEllipsis } = buildPagination({
    currentPage,
    totalPages,
  });

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

      {totalPages > 1 ? (
        <nav
          aria-label="Pagination"
          className={'mt-10 flex flex-wrap items-center justify-center gap-2'}
        >
          <Button
            asChild
            variant={'outline'}
            size={'sm'}
            disabled={!hasPrevious}
          >
            <Link
              aria-disabled={!hasPrevious}
              tabIndex={hasPrevious ? 0 : -1}
              className={cn(!hasPrevious && 'pointer-events-none opacity-50')}
              href={buildBlogPageHref(currentPage - 1)}
            >
              Previous
            </Link>
          </Button>

          <div className={'flex items-center gap-1'}>
            <PageNumberLink page={1} activePage={currentPage} />

            {showLeftEllipsis ? (
              <span className={'text-muted-foreground px-2 text-sm'}>…</span>
            ) : null}

            {pages.map((page) => (
              <PageNumberLink key={page} page={page} activePage={currentPage} />
            ))}

            {showRightEllipsis ? (
              <span className={'text-muted-foreground px-2 text-sm'}>…</span>
            ) : null}

            {totalPages > 1 ? (
              <PageNumberLink page={totalPages} activePage={currentPage} />
            ) : null}
          </div>

          <Button asChild variant={'outline'} size={'sm'} disabled={!hasNext}>
            <Link
              aria-disabled={!hasNext}
              tabIndex={hasNext ? 0 : -1}
              className={cn(!hasNext && 'pointer-events-none opacity-50')}
              href={buildBlogPageHref(currentPage + 1)}
            >
              Next
            </Link>
          </Button>

          <span className={'text-muted-foreground w-full pt-2 text-center text-sm'}>
            Page {currentPage} of {totalPages}
          </span>
        </nav>
      ) : null}
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

function PageNumberLink(props: { page: number; activePage: number }) {
  const isActive = props.page === props.activePage;

  return (
    <Link
      href={buildBlogPageHref(props.page)}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm',
        isActive
          ? 'bg-primary text-primary-foreground font-semibold'
          : 'hover:bg-muted text-foreground',
      )}
    >
      {props.page}
    </Link>
  );
}

function buildPagination(params: { currentPage: number; totalPages: number }) {
  const { currentPage, totalPages } = params;

  // Rules:
  // - If there are <= 3 pages, show them all: 1 2 3
  // - If there are more, the "early pages" view should be: 1 2 3 … last
  // - Past page 3, keep a small window around the active page (like typical pagination)
  if (totalPages <= 3) {
    return {
      pages: Array.from({ length: Math.max(0, totalPages - 2) }, (_, idx) => idx + 2),
      showLeftEllipsis: false,
      showRightEllipsis: false,
    };
  }

  // Near the beginning: 1 2 3 … last
  if (currentPage <= 3) {
    return {
      pages: [2, 3].filter((p) => p < totalPages),
      showLeftEllipsis: false,
      showRightEllipsis: totalPages > 4,
    };
  }

  // Near the end: 1 … (last-2) (last-1) last
  if (currentPage >= totalPages - 2) {
    const start = Math.max(2, totalPages - 2);

    return {
      pages: Array.from({ length: totalPages - start }, (_, idx) => start + idx),
      showLeftEllipsis: totalPages > 4,
      showRightEllipsis: false,
    };
  }

  // Middle window: 1 … (current-1) current (current+1) … last
  const start = currentPage - 1;
  const end = currentPage + 1;

  return {
    pages: Array.from({ length: end - start + 1 }, (_, idx) => start + idx),
    showLeftEllipsis: true,
    showRightEllipsis: true,
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
