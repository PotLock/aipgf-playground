// https://developers.google.com/analytics/devguides/collection/gtagjs/pages

import { ITrackingEventParams } from '../types';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

export const ID = process.env.NEXT_PUBLIC_GOOGLE_TRACKING;

export const page = (url: string) => {
  if (!ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', ID, { page_path: url });
};

export const event = ({ name, properties }: ITrackingEventParams) => {
  if (!ID || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, properties);
};

const tracker = { ID, page, event };

export default tracker;
