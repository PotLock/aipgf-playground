'use client';

import { WalletSelectorContextProvider } from "@/components/context/wallet-selector-provider"
import { ReactNode } from 'react';
import "@near-wallet-selector/modal-ui/styles.css";


export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletSelectorContextProvider>
      {children}
    </WalletSelectorContextProvider>
  );
}
