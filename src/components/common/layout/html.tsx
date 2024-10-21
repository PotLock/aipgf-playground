import React, { FC, ReactNode } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

type HtmlProps = {
  children?: ReactNode;
  locale?: string;
} & ComponentBaseProps;

const Html: FC<HtmlProps> = ({ className, children }) => {
  return <html className={classNames('h-full', className)}>{children}</html>;
};

export default Html;
