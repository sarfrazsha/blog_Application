import { PageBody, PageHeader } from '@kit/ui/page';

import { requireUserInServerComponent } from '~/lib/server/require-user-in-server-component';

import { CreatePostForm } from './_components/create-post-form';

export default async function CreatePostPage() {
  await requireUserInServerComponent();

  return (
    <>
      <PageHeader
        title={'Create post'}
        description={'Publish a new blog post to the public blog feed.'}
      />

      <PageBody>
        <div className={'max-w-3xl'}>
          <CreatePostForm />
        </div>
      </PageBody>
    </>
  );
}
