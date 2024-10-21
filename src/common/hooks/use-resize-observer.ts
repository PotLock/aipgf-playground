import { RefObject, useEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

function useResizeObserver<T extends HTMLElement>(): [RefObject<T>, Size] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const targetRef = useRef<T>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];

      if (!entry) return;
      const { width, height } = entry.contentRect;

      setSize({ width, height });
    });

    resizeObserver.observe(targetRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [targetRef, size];
}

export default useResizeObserver;
