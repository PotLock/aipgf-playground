import gtagTracker from '../gtag/tracker';
import segmentTracker from '../segment/tracker';
import { ITrackingEventParams } from '../types';

export const page = (url: string) => {
  gtagTracker.page(url);
  segmentTracker.page(url);
};

export const event = (params: ITrackingEventParams) => {
  gtagTracker.event(params);
  segmentTracker.event(params);
};

const tracker = { page, event };

export default tracker;
