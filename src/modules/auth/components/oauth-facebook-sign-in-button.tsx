'use client';

import { FC } from 'react';

import { useAuthState } from '@/modules/auth/states/auth.state';
import { ComponentBaseProps } from '@/common/interfaces';
import { Button } from '@/components/ui/button';

const OAuthFacebookSignInButton: FC<ComponentBaseProps> = ({ ...rest }) => {
  const authState = useAuthState();

  return (
    <Button
      data-testid="btn-signin-facebook"
      onClick={e => {
        e.preventDefault();
        authState.facebookSignIn({ redirect: true, callbackUrl: '/' });
      }}
      {...rest}
    >
      Facebook
    </Button>
  );
};

export default OAuthFacebookSignInButton;
