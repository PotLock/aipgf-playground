import { useEffect, useRef } from 'react';

export default function useEventListener(
  eventType: string,
  callback: (event: Event | MouseEvent) => void,
  element?: HTMLElement | Window | Document | null,
  options?: boolean | AddEventListenerOptions
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof window === 'undefined' || !element) return;

    const handler = (e: Event | MouseEvent) => callbackRef.current(e);

    element.addEventListener(eventType, handler, options);

    return () => {
      element.removeEventListener(eventType, handler, options);
    };
  }, [eventType, element]);
}
