'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { SignInDto } from '../interfaces/auth.interface';

import Logo from '@/components/icons/logo';

import { useAuthState } from '@/modules/auth/states/auth.state';

import OAuthFacebookSignInButton from './oauth-facebook-sign-in-button';
import OAuthGoogleSignInButton from './oauth-google-sign-in-button';

import { signInValidator } from '../validators/sign-in.validator';
import { Form } from '@/components/ui/form';

const FormSignIn = () => {
  const authState = useAuthState();

  const defaultValues: SignInDto = {
    email: 'ammodesk@gmail.com',
    password: 'Ammodesk123@'
  };

  const form = useForm<SignInDto>({ resolver: zodResolver(signInValidator), defaultValues });

  const onSubmit: SubmitHandler<SignInDto> = async formData => {
    authState.signIn({ ...formData, redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="flex h-full grow items-center justify-center" data-testid="frm-login">
      <Form {...form}>
        <form
          className="relative w-full max-w-sm self-center overflow-hidden rounded-xl p-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="absolute left-0 top-0 -z-10 h-full w-full bg-slate-400 opacity-30"></div>
          {/* OAuth */}
          <div className="flex items-center justify-center space-x-3">
            <OAuthGoogleSignInButton />
            <OAuthFacebookSignInButton />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormSignIn;
