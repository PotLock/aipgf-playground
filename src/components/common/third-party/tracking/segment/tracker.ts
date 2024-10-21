//https://segment.com/docs/connections/
import { ITrackingEventParams } from '../types';

declare global {
  interface Window {
    analytics?: {
      page: (url: string) => void;
      track: (name: string, properties: unknown) => void;
    };
  }
}

export const ID = process.env.NEXT_PUBLIC_SEGMENT_TRACKING;

export const page = (url: string) => {
  if (!ID && typeof window === 'undefined') return;

  return window.analytics?.page(url);
};

export const event = ({ name, properties }: ITrackingEventParams) => {
  if (ID && typeof window === 'undefined') return;

  return window.analytics?.track(name, properties);
};

const tracker = { ID, page, event };

export default tracker;
