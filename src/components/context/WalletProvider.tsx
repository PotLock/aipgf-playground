'use client';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { ReactNode } from 'react';
import { type Network } from '@aptos-labs/ts-sdk';

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: process.env.APTOS_NETWORK as Network }}
      optInWallets={['Continue with Google', 'Petra', 'Nightly', 'Pontem Wallet', 'Mizu Wallet']}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
