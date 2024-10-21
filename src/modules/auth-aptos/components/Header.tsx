'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { collapseAddress } from '../utils/address';

const Header = () => {
  const { account, connected, disconnect, wallet } = useWallet();

  return (
    <div className="h-20 w-full border-b border-gray-200 shadow-sm">
      <div className="h-full p-2 px-5">
        <div className="flex h-full w-full flex-row items-center justify-between">
          <span className="text-3xl font-semibold">AptosKeyless</span>
          <div className="">
            <span className="rounded-md bg-blue-300 bg-opacity-30 px-3 py-2">
              {connected ? collapseAddress(account?.address.toString() as string) : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
