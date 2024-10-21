'use client';

import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import DashboardProfile from './dashboard-profile';
import DashboardWidget from './dashboard-widget';
import { WidgetSelectionModal } from './widget-selection-modal';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { signOut } from 'next-auth/react';


type DashboardRootProps = ComponentBaseProps;

const DashboardRoot: FC<any> = ({ className, session }) => {
  const { connected, account } = useWallet();
  const [isConnected, setIsConnected] = useState(false);

  const handle = async (account: any) => {
    if (account?.address == session?.user.username) {
      setIsConnected(true);
    } else {
      await signOut()
    }

  }
  useEffect(() => {
    if (connected) {
      handle(account);
    }

  }, [account, connected])
  return (
    <div className={classNames('flex w-full grow items-center justify-center py-4', className)}>
      {isConnected ? (
        <div className="container flex flex-col items-center justify-center gap-6">
          <DashboardProfile />
          <DashboardWidget session={session} />
          <WidgetSelectionModal session={session} />
        </div>
      ) : (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRoot;
