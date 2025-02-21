'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ChatHeader } from '@/components/custom/chat-header';
import { CreateToolForm } from '@/components/custom/create-tool-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { updateToolAction, UpdateToolActionState } from './actions';



export function UpdateToolForm({ tool }: { tool: any }) {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<UpdateToolActionState, FormData>(
    updateToolAction,
    {
      status: 'idle',
    }
  );

  useEffect(() => {
    if (state.status === 'tool_exists') {
      toast.error('Tool already exists');
    } else if (state.status === 'failed') {
      toast.error('Failed to update Tool');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      setIsSuccessful(true);
      toast.success('Tool updated successfully');
      router.push('/tool')
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <CreateToolForm action={handleSubmit} tool={tool} >
        <div className='pb-4'></div>
        <SubmitButton isSuccessful={isSuccessful} >Update</SubmitButton>
      </CreateToolForm>
    </div>
  );
}
