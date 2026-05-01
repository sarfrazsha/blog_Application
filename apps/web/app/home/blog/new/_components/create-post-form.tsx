'use client';

import { useState, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';

import { createPostAction } from '../_lib/server-actions';
import { CreatePostInput, CreatePostSchema } from '../_lib/create-post.schema';

export function CreatePostForm() {
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const onSubmit = (values: CreatePostInput) => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        await createPostAction(values);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Failed to create post',
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form className={'space-y-6'} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'title'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder={'Post title'} maxLength={150} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={'body'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={'Write your blog post...'}
                  className={'min-h-52'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <Alert variant={'destructive'}>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        ) : null}

        <Button type={'submit'} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create post'}
        </Button>
      </form>
    </Form>
  );
}
