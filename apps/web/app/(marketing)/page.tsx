import { withI18n } from '~/lib/i18n/with-i18n';

function Home() {
  return (
    <main className="container mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="text-muted-foreground mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
        <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full font-semibold">
          ✦
        </span>
        <span>Welcome to the Blog</span>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
        Discover stories & ideas
      </h1>

      <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 sm:text-lg">
        Explore posts written by the community. Write your own articles once
        you’re signed in, and share knowledge with others.
      </p>

      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
        <div className="rounded-xl border p-5">
          <div className="text-sm font-medium">Read</div>
          <div className="text-muted-foreground mt-2 text-sm leading-6">
            Browse the public feed and open any post to read the full content.
          </div>
        </div>

        <div className="rounded-xl border p-5">
          <div className="text-sm font-medium">Write</div>
          <div className="text-muted-foreground mt-2 text-sm leading-6">
            Create a post after signing in. Your author name is stored with each
            post.
          </div>
        </div>

        <div className="rounded-xl border p-5">
          <div className="text-sm font-medium">Publish</div>
          <div className="text-muted-foreground mt-2 text-sm leading-6">
            New posts appear on the blog feed with pagination for easy
            navigation.
          </div>
        </div>
      </div>
    </main>
  );
}

export default withI18n(Home);
