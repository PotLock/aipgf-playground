'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateAgentForm } from '@/components/custom/create-agent-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { createAgentAction, CreateAgentActionState } from './actions';
import { ChatHeader } from '@/components/custom/chat-header';



export default function CreateAgent() {
  const router = useRouter();
  const [isSuccessful, setIsSuccessful] = useState(false);

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
      setIsSuccessful(true);
      toast.success('Agent created successfully');
      router.push('/agent')
      router.refresh();
    }
  }, [state, router]);

  
  const handleSubmit = async(formData: FormData) => {
    await formAction(formData);
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <CreateAgentForm action={handleSubmit} >
        <SubmitButton isSuccessful={isSuccessful}>Create</SubmitButton>
      </CreateAgentForm>
    </div>

    
  );
}
