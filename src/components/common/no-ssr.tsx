import React, { FC, ReactNode } from 'react';
import dynamic from 'next/dynamic';

interface INoSSRProps {
  children: ReactNode;
}

const NoSSR: FC<INoSSRProps> = props => <>{props.children}</>;

export default dynamic(() => Promise.resolve(NoSSR), { ssr: false });
