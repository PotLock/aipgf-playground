'use client';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CreateAgentForm } from '@/components/custom/create-agent-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { updateAgentAction, UpdateAgentActionState } from './actions';
import { ChatHeader } from '@/components/custom/chat-header';

export default function UpdateAgent({ agent }: any) {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState(false);

    const [state, formAction] = useActionState<UpdateAgentActionState, FormData>(
        updateAgentAction,
        {
            status: 'idle',
        }
    );

    useEffect(() => {
        if (state.status === 'agent_exists') {
            toast.error('Agent already exists');
        } else if (state.status === 'failed') {
            toast.error('Failed to update agent');
        } else if (state.status === 'invalid_data') {
            toast.error('Failed validating your submission!');
        } else if (state.status === 'success') {
            toast.success('Agent updated successfully');
            setIsSuccessful(true);
            router.push('/agent')
            router.refresh();
        }
    }, [state, router]);

    const handleSubmit = (formData: FormData) => {
        formAction(formData);
    };

    return (
        <div className="flex flex-col min-w-0 h-dvh bg-background">
             <ChatHeader />
            <CreateAgentForm action={handleSubmit} agent={agent}>
                <SubmitButton isSuccessful={isSuccessful}>Update</SubmitButton>
            </CreateAgentForm>
        </div>
    );
}
