import { useCallback, useState } from 'react';
import type { SwiperClass } from 'swiper/react';

export default function useSwiper() {
  const [swiperRef, setSwiperRef] = useState<SwiperClass>();
  const [isDisablePrev, setIsDisablePrev] = useState(true);
  const [isDisableNext, setIsDisableNext] = useState(false);

  const onSlideChange = (swiper: SwiperClass) => {
    setIsDisablePrev(swiper.isBeginning);
    setIsDisableNext(swiper.isEnd);
  };

  const handlePrev = useCallback(() => {
    if (!swiperRef) return;

    swiperRef.slidePrev();
  }, [swiperRef]);

  const handleNext = useCallback(() => {
    if (!swiperRef) return;

    swiperRef.slideNext();
  }, [swiperRef]);

  return { setSwiperRef, isDisableNext, isDisablePrev, onSlideChange, handlePrev, handleNext };
}
