'use client';

import React, { FC } from 'react';
import classNames from 'classnames';
import useOnlineStatus from '@/common/hooks/use-online-status';
import { ComponentBaseProps } from '@/common/interfaces';

const OnlineStatus: FC<ComponentBaseProps> = ({ className, ...rest }) => {
  const isOnline = useOnlineStatus();

  return (
    <div className={classNames('online-status', className)} data-testid="online-status" {...rest}>
      <p className={classNames('rounded-md p-2 font-bold text-white', isOnline ? 'bg-green-600' : 'bg-red-600')}>
        {isOnline ? 'Online' : 'Offline'}
      </p>
    </div>
  );
};

export default OnlineStatus;
