'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useActionState } from 'react';
import { toast } from 'sonner';

import { CreateProviderForm } from '@/components/custom/create-provider-form';
import { SubmitButton } from '@/components/custom/submit-button';
import { createProviderAction, CreateProviderActionState } from './actions';
import { ChatHeader } from '@/components/custom/chat-header';

export default function CreateProvider() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<CreateProviderActionState, FormData>(
    createProviderAction,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Failed to create provider');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      toast.success('Provider created successfully');
      router.push('/model');
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <CreateProviderForm action={handleSubmit}>
        <SubmitButton isSuccessful={isSuccessful}>Create</SubmitButton>
      </CreateProviderForm>
    </div>
  );
}