import { auth } from '@/app/(auth)/auth';
import { getToolById } from '@/db/queries';
import {UpdateToolForm} from './update-tool-form';


export default async function Page({ params }: any) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return new Response('Tool ID is required!', { status: 400 });
  }

  const tool = await getToolById(id);

  return <UpdateToolForm tool={tool} />;
}
