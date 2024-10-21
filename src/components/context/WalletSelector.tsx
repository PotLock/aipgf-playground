'use client';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { authenticate, signup, getUser } from '@/modules/auth/constants/auth.actions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';

import { useToast } from '@/components/ui/use-toast';
import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  type AboutAptosConnectEducationScreen,
  type AnyAptosWallet,
  AptosPrivacyPolicy,
  WalletItem,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
  useWallet
} from '@aptos-labs/wallet-adapter-react';
import { ArrowLeft, ArrowRight, ChevronDown, Copy, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function WalletSelector() {
  const router = useRouter();
  const { account, connected, disconnect, wallet } = useWallet();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);

      toast({
        title: 'Success',
        description: 'Copied wallet address to clipboard.'
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy wallet address.'
      });
    }
  }, [account?.address, toast]);


  const handleConnect = async () => {
    setIsLoading(true)
    if (connected && account?.address) {
      // Try to register the user first
      toast({
        title: 'Connecting wallet...',
        description: 'Please wait while we connect your wallet.'
      });


      const user = await getUser(account.address);

      if (user) {
        // If registration is successful, sign in
        await authenticate({ username: account.address, password: account.address });
        router.push(window.location.href);
        router.refresh();

      } else {
        // If registration fails (user already exists), just try to sign in
        await signup({ username: account.address, password: account.address });
        router.push(window.location.href);
        router.refresh();
      }
    }
  };

  useEffect(() => {
    if (account?.address) {
      handleConnect();
    }
  }, [account]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>{isLoading ? 'Loading' : 'Connect a Wallet'}</Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
}

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets = [] } = useWallet();
  const { aptosConnectWallets, availableWallets, installableWallets } = groupAndSortWallets(wallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <div className="flex flex-col text-center leading-snug">
            <DialogTitle>
              {hasAptosConnectWallets ? (
                <>
                  <span>Log in or sign up</span>
                  <span>with Social + Aptos Connect</span>
                </>
              ) : (
                'Connect Wallet'
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        {hasAptosConnectWallets && (
          <div className="flex flex-col gap-2 pt-3">
            {aptosConnectWallets.map((wallet: any) => (
              <AptosConnectWalletRow key={wallet.name} wallet={wallet} onConnect={close} />
            ))}
            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              Learn more about{' '}
              <AboutAptosConnect.Trigger className="flex items-center gap-1 py-3 text-foreground">
                Aptos Connect <ArrowRight size={16} />
              </AboutAptosConnect.Trigger>
            </p>
            <AptosPrivacyPolicy className="flex flex-col items-center py-1">
              <p className="text-xs leading-5">
                <AptosPrivacyPolicy.Disclaimer />{' '}
                <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
                <span className="text-muted-foreground">.</span>
              </p>
              <AptosPrivacyPolicy.PoweredBy className="flex items-center gap-1.5 text-xs leading-5 text-muted-foreground" />
            </AptosPrivacyPolicy>
            <div className="flex items-center gap-3 pt-4 text-muted-foreground">
              <div className="h-px w-full bg-secondary" />
              Or
              <div className="h-px w-full bg-secondary" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-3">
          {availableWallets.map((wallet: any) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  More wallets <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {installableWallets.map((wallet: any) => (
                  <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
      <Toaster />
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AnyAptosWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between gap-4 rounded-md border px-4 py-3"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="text-center text-base leading-snug">About Aptos Connect</DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] items-end justify-center pb-3">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 pb-4 text-center">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:text-foreground [&>a]:underline [&>a]:underline-offset-4" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button size="sm" variant="ghost" onClick={screen.back} className="justify-self-start">
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator: any, i: number) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 bg-muted transition-colors [[data-active]>&]:bg-foreground" />
            </ScreenIndicator>
          ))}
        </div>
        <Button size="sm" variant="ghost" onClick={screen.next} className="gap-2 justify-self-end">
          {screen.screenIndex === screen.totalScreens - 1 ? 'Finish' : 'Next'}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
