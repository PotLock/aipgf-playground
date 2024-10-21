import { useState } from 'react';

import useEventListener from './use-event-listener';

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);

  useEventListener('online', () => setIsOnline(navigator.onLine));
  useEventListener('offline', () => setIsOnline(navigator.onLine));

  return isOnline;
}
