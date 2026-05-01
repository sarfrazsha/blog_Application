import { z } from 'zod';

export const CreatePostSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(150),
  body: z.string().trim().min(1, 'Body is required'),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
