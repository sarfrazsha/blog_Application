export type BlogPost = {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorId: string;
  publishedAt: string;
};

export type PaginatedBlogPosts = {
  posts: BlogPost[];
  hasNextPage: boolean;
};
