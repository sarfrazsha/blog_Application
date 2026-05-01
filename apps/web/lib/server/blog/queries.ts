export const GET_PAGINATED_POSTS_QUERY = `
  query GetPaginatedPosts($first: Int!, $offset: Int!) {
    blogPostsCollection(first: $first, offset: $offset, orderBy: [{ publishedAt: DescNullsLast }]) {
      edges {
        node {
          id
          title
          body
          authorName
          authorId
          publishedAt
        }
      }
    }
  }
`;

export const GET_PAGINATED_POSTS_QUERY_SNAKE_CASE = `
  query GetPaginatedPosts($first: Int!, $offset: Int!) {
    blogPostsCollection: blog_postsCollection(first: $first, offset: $offset, orderBy: [{ published_at: DescNullsLast }]) {
      edges {
        node {
          id
          title
          body
          authorName: author_name
          authorId: author_id
          publishedAt: published_at
        }
      }
    }
  }
`;

export const GET_POST_BY_ID_QUERY = `
  query GetPostById($id: UUID!) {
    blogPostsCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          title
          body
          authorName
          authorId
          publishedAt
        }
      }
    }
  }
`;

export const GET_POST_BY_ID_QUERY_SNAKE_CASE = `
  query GetPostById($id: UUID!) {
    blogPostsCollection: blog_postsCollection(filter: { id: { eq: $id } }, first: 1) {
      edges {
        node {
          id
          title
          body
          authorName: author_name
          authorId: author_id
          publishedAt: published_at
        }
      }
    }
  }
`;

export const CREATE_POST_MUTATION = `
  mutation CreatePost($title: String!, $body: String!, $authorId: UUID!, $authorName: String!) {
    insertIntoblogPostsCollection(
      objects: [{ title: $title, body: $body, authorId: $authorId, authorName: $authorName }]
    ) {
      records {
        id
      }
    }
  }
`;

export const CREATE_POST_MUTATION_SNAKE_CASE = `
  mutation CreatePost($title: String!, $body: String!, $authorId: UUID!, $authorName: String!) {
    insertIntoblogPostsCollection: insertIntoblog_postsCollection(
      objects: [{ title: $title, body: $body, author_id: $authorId, author_name: $authorName }]
    ) {
      records {
        id
      }
    }
  }
`;
