import { signIn, SignInOptions, signOut, SignOutParams } from 'next-auth/react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { SignInDto } from '../interfaces/auth.interface';

export enum AUTH_PROVIDER {
  CREDENTIALS = 'credentials',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  APPLE = 'apple'
}

type State = {
  isAuthenticated: boolean;
};

type Actions = {
  signIn: (credentials: SignInDto) => void;
  googleSignIn: (options: SignInOptions) => void;
  facebookSignIn: (options: SignInOptions) => void;
  signOut: (options: SignOutParams) => void;
};

export const useAuthState = create<State & Actions>()(
  devtools(
    immer(_set => ({
      isAuthenticated: false,
      signIn: async credentials => {
        await signIn(AUTH_PROVIDER.CREDENTIALS, credentials);
      },
      googleSignIn: async options => {
        await signIn(AUTH_PROVIDER.GOOGLE, options);
      },
      facebookSignIn: async options => {
        await signIn(AUTH_PROVIDER.FACEBOOK, options);
      },
      signOut: options => {
        signOut(options);
      }
    })),
    { enabled: process.env.NODE_ENV === 'development' }
  )
);
