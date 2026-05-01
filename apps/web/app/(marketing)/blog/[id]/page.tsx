import Link from 'next/link';
import { notFound } from 'next/navigation';

import { withI18n } from '~/lib/i18n/with-i18n';
import { getPostById } from '~/lib/server/blog/service';

async function BlogPostDetailsPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <main className={'container mx-auto max-w-4xl px-4 py-12'}>
      <Link href={'/blog'} className={'text-sm underline'}>
        Back to all posts
      </Link>

      <article className={'mt-6 rounded-lg border p-8'}>
        <h1 className={'text-3xl font-semibold'}>{post.title}</h1>

        <p className={'text-muted-foreground mt-3 text-sm'}>
          {formatDate(post.publishedAt)} by {post.authorName}
        </p>

        <div className={'mt-8 whitespace-pre-wrap leading-8'}>{post.body}</div>
      </article>
    </main>
  );
}

export default withI18n(BlogPostDetailsPage);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
