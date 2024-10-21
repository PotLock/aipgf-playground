'use client';

import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash-es';
import { ChevronUpIcon } from 'lucide-react';
import useScrollTo from '@/common/hooks/use-scroll-to';

type ScrollToTopProps = {
  offset?: number;
};

export function ScrollToTop({ offset = 100 }: ScrollToTopProps) {
  const scrollTo = useScrollTo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = debounce(() => {
      if (window.scrollY > offset) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 250);

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top fixed bottom-12 right-12">
      {isVisible && (
        <button onClick={() => scrollTo.top()}>
          <ChevronUpIcon />
        </button>
      )}
    </div>
  );
}

export default ScrollToTop;
