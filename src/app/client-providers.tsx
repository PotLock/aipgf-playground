'use client';

import { SessionProvider } from 'next-auth/react';
import { WalletProvider } from '@/components/context/WalletProvider';
import { GeoTargetly } from '@/modules/auth-aptos/utils/geo-targetly';
interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <WalletProvider>{children}</WalletProvider>
      <GeoTargetly />
    </SessionProvider>
  );
}
