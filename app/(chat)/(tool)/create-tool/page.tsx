'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateToolForm } from '@/components/custom/create-tool-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { createToolAction, CreateToolActionState } from './actions';


export default function Page() {
  const router = useRouter();

  const [state, formAction] = useActionState<CreateToolActionState, FormData>(
    createToolAction,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'tool_exists') {
      toast.error('Tool already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create Tool');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      toast.success('Tool created successfully');
      router.push('/tool')
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
     formAction(formData);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <CreateToolForm action={handleSubmit} >
        <SubmitButton >Create</SubmitButton>
      </CreateToolForm>
    </div>
  );
}
