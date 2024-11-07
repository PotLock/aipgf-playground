'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateAgentForm } from '@/components/custom/create-agent-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { createAgentAction, CreateAgentActionState } from './actions';

export default function Page() {
  const router = useRouter();

  const [state, formAction] = useActionState<CreateAgentActionState, FormData>(
    createAgentAction,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'agent_exists') {
      toast.error('Agent already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to create agent');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      toast.success('Agent created successfully');
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Create Agent</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create Your Super Agent
          </p>
        </div>
        <CreateAgentForm action={handleSubmit} >
          <SubmitButton>Create</SubmitButton>
        </CreateAgentForm>
      </div>
    </div>
  );
}
