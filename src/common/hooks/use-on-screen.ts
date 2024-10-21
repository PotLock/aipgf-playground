import { MutableRefObject, useEffect, useState } from 'react';

export default function useOnScreen<T extends HTMLElement>(
  ref: MutableRefObject<T | null>,
  rootMargin = '0px'
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current === null) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin });

    observer.observe(ref.current);

    return () => {
      if (ref.current === null) return;
      observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);

  return isVisible;
}
