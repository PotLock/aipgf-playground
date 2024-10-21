'use client';

import React from 'react';

import { mediaStyles } from '@/components/common/media';

const HeadInjector = () => {
  return (
    <>
      <meta httpEquiv="cleartype" content="on" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <style type="text/css" dangerouslySetInnerHTML={{ __html: mediaStyles }} />
    </>
  );
};

export default HeadInjector;
