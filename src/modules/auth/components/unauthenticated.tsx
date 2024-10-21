'use client';

import React, { FC } from 'react';

import { useRouter } from 'next/navigation';
import { ComponentBaseProps } from '@/common/interfaces';
import { Button } from '@/components/ui/button';

const Unauthenticated: FC<ComponentBaseProps> = ({ visible = false, ...rest }) => {
  const router = useRouter();
  if (!visible) return null;

  return (
    <div className="flex items-center gap-x-3" data-testid="unauthenticated" {...rest}>
      <Button className="rounded-full" data-testid="btn-signin" onClick={() => router.push('/login')}>
        Sign In
      </Button>
    </div>
  );
};

export default Unauthenticated;
