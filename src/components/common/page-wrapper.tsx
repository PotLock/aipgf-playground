import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

type PageWrapperProps = {
  children?: ReactNode;
} & ComponentBaseProps;

const PageWrapper: FC<PageWrapperProps> = ({ className, children }) => {
  return (
    <div className={classNames('nap-page flex grow flex-col', className)}>
      <div className="nap-content-bg flex grow flex-col bg-card p-4">{children}</div>
    </div>
  );
};

export default PageWrapper;
