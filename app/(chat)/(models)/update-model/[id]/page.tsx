import { auth } from '@/app/(auth)/auth';
import { getModelById, getModelsByUserId } from '@/db/queries';
import UpdateModel from './update-provider-form';

export default async function Page({ params }: any) {
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized!', { status: 401 });
  }

  const { id } = await params;
  console.log(id);
  if (!id) {
    return new Response('Model ID is required!', { status: 400 });
  }

  const models = await getModelsByUserId({ userId: session.user.id! });
  const model = await getModelById(id);

  return <UpdateModel models={models as any} model={model} />;
}
