'use client';


import Form from 'next/form';
import { useRouter } from 'next/navigation';
import React, { useEffect, useCallback, useState, useRef, useActionState } from 'react';
import { useFormStatus } from "react-dom";
import { toast } from 'sonner';

import { authenticate, AuthenticateActionState } from "@/app/(auth)/actions";
import { useWalletSelector } from "@/components/context/wallet-selector-provider"

import { Button } from "../ui/button";
export function WalletSelector() {

  const [state, formAction] = useActionState<AuthenticateActionState, FormData>(
    authenticate,
    {
      status: "idle",
    },
  );
  const router = useRouter();
  const { modal, accountId, selector } = useWalletSelector();

  const [isLoading, setIsLoading] = useState(false);
  const submitForm = useRef<HTMLFormElement>(null)
  const [username, setUsername] = useState('')
  const { pending } = useFormStatus()

  useEffect(() => {
    if (state.status === 'failed') {
      toast.error('Invalid credentials!');
    } else if (state.status === 'invalid_data') {
      toast.error('Failed validating your submission!');
    } else if (state.status === 'success') {
      router.refresh();
    }
  }, [state.status, router]);


  const handleConnect = useCallback(async () => {
    setIsLoading(true);
    if (accountId) {
      setUsername(accountId)

      submitForm.current?.requestSubmit()
    }
  }, [accountId]);

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
      <Button onClick={modal.show} disabled={isLoading}>{isLoading ? 'Loading' : 'Connect a Wallet'}</Button>
    </Form>
  );
}

