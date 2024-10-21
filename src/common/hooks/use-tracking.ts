import tracker from '@/components/common/third-party/tracking/utils/tracker';

const useTracking = () => {
  return {
    event: tracker.event,
    page: tracker.page
  };
};

export default useTracking;
