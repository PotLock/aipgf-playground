import React, { FC, ReactNode } from 'react';

import HeadInjector from './head-injector';

type HeadProps = {
  children?: ReactNode;
};

const Head: FC<HeadProps> = ({ children }) => {
  return (
    // eslint-disable-next-line @next/next/no-head-element
    <head>
      <meta name="google-site-verification" content="Rnm3DL87HNmPncIFwBLXPhy-WGFDXIyplSL4fRtnFsA" />
      {children}
      <HeadInjector />
    </head>
  );
};

export default Head;
