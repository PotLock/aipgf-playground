'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import classNames from 'classnames';
import { Copy, LogOut, SettingsIcon, User, Share2 } from 'lucide-react';
import { ComponentBaseProps } from '@/common/interfaces';
import CustomButton from '@/libs/svg-icons/input/custom-button';

import BoderImage from '@/components/common/border-image';

import { collapseAddress } from '@/modules/auth-aptos/utils/address';

import AvatarImage from '@/assets/images/avatar/avatar-1.jpeg';
import ProfileElementDecor1 from '@/assets/svgs/profile-element-decor-1.svg';

import DashboardAvatar from './dashboard-avatar';
import DashboardTopProfileDecor from './dashboard-top-profile-decor';
import {
  APTOS_CONNECT_ACCOUNT_URL,
  isAptosConnectWallet,
  truncateAddress,
  useWallet
} from '@aptos-labs/wallet-adapter-react';
import { signOut } from 'next-auth/react';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import { Button } from '@/components/ui/button';
import { getAptosClient } from '@/modules/auth-aptos/utils/aptos-client';
import { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk';
import { useToast } from '@/hooks/use-toast';
import AptosReceiveModal from './aptos-receive-modal';
import { useSearchParams } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { getAptosBalance } from '../hooks/utils';

type DashboardProfileProps = ComponentBaseProps;

const DashboardProfile: FC<DashboardProfileProps> = ({ className }) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [isOpenSend, setIsOpenSend] = useState<boolean>(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [receive, setReceive] = useState<string | null>(null);
  const [isOpenReceive, setIsOpenReceive] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const address = searchParams.get('address');


  const { account, signAndSubmitTransaction, wallet, disconnect } = useWallet();
  const aptosClient = getAptosClient();

  useEffect(() => {
    if (address) {
      setIsOpenSend(true);
    }
  }, []);

  const loadBalance = useCallback(async () => {
    try {
      const options = {
        method: 'GET',
        headers: { accept: 'application/json' }
      };
      const respo = await axios.get(
        `https://aptos-${process.env.APTOS_NETWORK}.nodit.io/${process.env.NEXT_PUBLIC_API_KEY_NODIT}/v1/accounts/${account?.address.toString() || address}/resources`,
        options
      );
      //console.log(respo);
      const datas = respo?.data[1];
      const resBalance = datas?.data?.coin.value;
      const formatBalance = Number(resBalance ? resBalance : 0) * Math.pow(10, -8);

      setBalance(formatBalance.toFixed(2));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }, [address]);

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);


  const toggleOpenSend = () => {
    setIsOpenSend(!isOpenSend);
  };

  const toggleOpenReceive = () => {
    setIsOpenReceive(!isOpenReceive);
  };

  const handleCloseSend = () => {
    setIsOpenSend(false);
  };

  const onTransfer = async () => {
    setPending(true);
    if (!account) return;
    if (parseFloat(amount as string) > parseFloat(balance || '0')) {
      toast({
        title: 'Not enough balance',
        description: 'Please check your balance and try again.',
        duration: 3000 // Auto-close after 3 seconds
      });
      setPending(false);
      return;
    }

    try {
      const data: InputGenerateTransactionPayloadData = {
        function: '0x1::coin::transfer',
        typeArguments: ['0x1::aptos_coin::AptosCoin'],
        functionArguments: [address || receive, (parseFloat(amount as string) * 1e8).toString()]
      };
      const committedTxn = await signAndSubmitTransaction({
        sender: account.address,
        data
      });
      await aptosClient.waitForTransaction({
        transactionHash: committedTxn.hash
      });

      console.log('committedTxn', committedTxn);
      setAmount(null);
      setReceive(null);
      toast({
        title: 'Send Successful!',
        description: 'Your transaction has been processed.',
        duration: 5000, // Auto-close after 5 seconds
        action: (
          <Button
            onClick={() =>
              window.open(
                `https://explorer.aptoslabs.com/txn/${committedTxn.hash}?network=${process.env.APTOS_NETWORK}`,
                '_blank'
              )
            }
          >
            View on Explorer
          </Button>
        )
      });
      setPending(false);
      handleCloseSend();
      loadBalance();
    } catch (err) {
      console.error('Error', err);
      toast({
        title: 'Failed to transfer token',
        description: 'Please try again.',
        duration: 3000 // Auto-close after 3 seconds
      });
      setPending(false);
    }
  };

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

  const copyProfileLink = useCallback(async () => {
    const profileUrl = `${window.location.origin}/profile/${account?.address.toString()}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Success',
        description: 'Copied profile link to clipboard.'
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to copy profile link.'
      });
    }
  }, [account?.address, toast]);

  const handleDisconnect = useCallback(async () => {
    if (account) {
      await disconnect();
    }
    await signOut();
  }, [disconnect]);

  return (
    <BoderImage className={classNames('relative flex w-full max-w-[483px] justify-center', className)}>
      <DashboardTopProfileDecor />
      <div className="relative flex flex-col gap-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex grow flex-wrap items-center gap-2 md:flex-nowrap">
            <DashboardAvatar className="shrink-0" imageUrl={'/avatar1.png'} altText="Avatar" />
            <div className="flex w-full flex-col items-start gap-3">
              <p className="text-wrap break-words text-xl font-bold">
                {collapseAddress(account?.address.toString() || "")}
              </p>
              <p className="text-sm">Welcome back</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SettingsIcon className="h-6 w-6 shrink-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={copyAddress} className="gap-2">
                <Copy className="h-4 w-4" /> Copy address
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`${window.location.origin}/profile/${account?.address.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2"
                >
                  <User className="h-4 w-4" /> Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={copyProfileLink} className="gap-2">
                <Share2 className="h-4 w-4" /> Share Profile
              </DropdownMenuItem>
              {wallet && isAptosConnectWallet(wallet) && (
                <DropdownMenuItem asChild>
                  <a href={APTOS_CONNECT_ACCOUNT_URL} target="_blank" rel="noopener noreferrer" className="flex gap-2">
                    <User className="h-4 w-4" /> Account
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onSelect={handleDisconnect} className="gap-2">
                <LogOut className="h-4 w-4" /> Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative flex flex-wrap justify-between gap-2">
          <div className="flex grow flex-col gap-2">
            <p className="text-base text-[#636363]">Total balance</p>
            <p className="text-h2">{balance ? balance : '0'}</p>
          </div>
          <div
            className="flex shrink-0 flex-col justify-end font-semibold underline"
            style={{
              textUnderlineOffset: '4px'
            }}
          >
            <p>TOKENS (3)</p>
          </div>
          <Image
            src={ProfileElementDecor1.src}
            alt="Profile Top Right Element Decor"
            width={ProfileElementDecor1.width}
            height={ProfileElementDecor1.height}
            className="absolute right-0 top-0 z-0 -translate-y-1/2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <CustomButton className="w-full md:w-auto" onClick={toggleOpenSend}>
            <i className="ico-send-right-icon" /> Send
          </CustomButton>
          <CustomButton className="w-full md:w-auto" onClick={toggleOpenReceive}>
            <i className="ico-wallet-icon" /> Receive
          </CustomButton>
        </div>
        <AugmentedPopup visible={isOpenSend} onClose={handleCloseSend} textHeading={'Send'}>
          <div className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-8">
            <p className="mb-5 text-white">Send APT to another address</p>
            <input
              type="text"
              placeholder="Receiver Address"
              value={address || receive || ''}
              onChange={e => setReceive(e.target.value)}
              className="w-full rounded border p-2 text-black"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount || ''}
              onChange={e => setAmount(e.target.value)}
              className="w-full rounded border p-2 text-black"
            />
            <Button onClick={onTransfer} disabled={pending || !amount || !receive}>
              {pending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </AugmentedPopup>
        <AptosReceiveModal
          isOpen={isOpenReceive}
          onClose={() => setIsOpenReceive(false)}
          address={account?.address.toString() as string}
        />
      </div>
    </BoderImage>
  );
};

export default DashboardProfile;
