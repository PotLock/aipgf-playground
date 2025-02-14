'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useActionState } from 'react';
import { toast } from 'sonner';

import { CreateProviderForm } from '@/components/custom/create-provider-form';
import { SubmitButton } from '@/components/custom/submit-button';

import { updateModelAction, UpdateModelActionState } from './actions';
import { ChatHeader } from '@/components/custom/chat-header';

export default function UpdateModel({ model }: any) {
    const router = useRouter();
    const [isSuccessful, setIsSuccessful] = useState(false);

    const [state, formAction] = useActionState<UpdateModelActionState, FormData>(
        updateModelAction,
        {
            status: 'idle',
        }
    );

    useEffect(() => {
        if (state.status === 'model_exists') {
            toast.error('Model already exists');
        } else if (state.status === 'failed') {
            toast.error('Failed to update model');
        } else if (state.status === 'invalid_data') {
            toast.error('Failed validating your submission!');
        } else if (state.status === 'success') {
            toast.success('Model updated successfully');
            setIsSuccessful(true);
            router.push('/model');
            router.refresh();
        }
    }, [state, router]);
    const handleSubmit = (formData: FormData) => {
        formAction(formData);
    };

    return (
        <div>
            <ChatHeader />
            <CreateProviderForm action={handleSubmit} model={model}>
                <SubmitButton isSuccessful={isSuccessful}>Update Model</SubmitButton>
            </CreateProviderForm>
        </div>
    );
}
