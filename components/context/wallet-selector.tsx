'use client';

import { useWalletSelector } from "@/components/context/wallet-selector-provider"

import Form from 'next/form';
import { useRouter } from 'next/navigation';
import React, { useEffect, useCallback, useState, useRef, useActionState } from 'react';

import { authenticate, AuthenticateActionState } from "@/app/(auth)/actions";
import CustomButton from '@/components/custom/custom-button'
import { useToast } from '@/components/ui/use-toast';
import { useFormStatus } from "react-dom";

export function WalletSelector() {

  const [state, formAction] = useActionState<AuthenticateActionState, FormData>(
    authenticate,
    {
      status: "idle",
    },
  );
  const router = useRouter();
  const { modal, accountId, selector } = useWalletSelector();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const submitForm = useRef<HTMLFormElement>(null)
  const [username, setUsername] = useState('')
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state) {
      if (state.status === "failed") {
        toast({
          title: 'Invalid credentials!',
          description: ''
        });
      } else if (state.status === "invalid_data") {
        toast({
          title: 'Failed validating your submission!',
          description: ''
        });
      } else if (state.status === "success") {
        router.refresh();
      }
    }

  }, [state, router, toast]);


  const handleConnect = useCallback(async () => {
    setIsLoading(true);
    if (accountId) {
      setUsername(accountId)
      toast({
        title: 'Connecting wallet...',
        description: 'Please wait while we connect your wallet.'
      });
      submitForm.current?.requestSubmit()
    }
  }, [accountId, toast]);

  useEffect(() => {
    if (accountId) {
      handleConnect();
    }
  }, [accountId, handleConnect]);

  useEffect(() => {
    if (username) {
      submitForm.current?.requestSubmit()
    }
  }, [username]);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
  };

  return (
    <Form action={handleSubmit} ref={submitForm} disabled={isLoading} className=''>
      <input
        id="username"
        name="username"
        className="bg-muted text-md md:text-sm hidden"
        type="text"
        defaultValue={username}
        required
      />
      <input
        id="password"
        name="password"
        className="bg-muted text-md md:text-sm hidden"
        type="text"
        defaultValue={username}
        required
      />
      <CustomButton onClick={modal.show} disabled={pending}>{isLoading ? 'Loading' : 'Connect a Wallet'}</CustomButton>
    </Form>
  );
}

