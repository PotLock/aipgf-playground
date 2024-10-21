'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import Tracker from './utils/tracker';
import GtagScript from './gtag';
import SegmentScript from './segment';

const Tracking = () => {
  const pathName = usePathname();

  useEffect(() => {
    Tracker.page(window.location.pathname);
  }, [pathName]);

  return (
    <>
      <GtagScript />
      <SegmentScript />
    </>
  );
};

export default Tracking;
