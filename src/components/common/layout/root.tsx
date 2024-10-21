'use client';

import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces/component.interface';

import Backdrop from '@/assets/images/bg.png';

type RootProps = {
  children?: ReactNode;
} & ComponentBaseProps;

const Root: FC<RootProps> = ({ className, children }) => {
  return (
    <div
      className={classNames(
        'nap-root relative flex grow flex-col items-center bg-cover bg-center bg-no-repeat',
        className
      )}
      style={{ backgroundImage: `url(${Backdrop.src})` }}
    >
      {children}
    </div>
  );
};

export default Root;
