import React, { FC, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import { Autoplay, EffectFade, FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import type SwiperClass from 'swiper/types/swiper-class';
import useSwiper from '@/common/hooks/use-swiper';

import Link from 'next/link'

import style from './style.module.scss';

interface IGalleryProps {
  images: StaticImageData[];
  thumbCount?: number;
}

const Gallery: FC<IGalleryProps> = ({ images = [], thumbCount = 2 }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();
  const { isDisableNext, isDisablePrev, handlePrev, handleNext, onSlideChange, setSwiperRef } = useSwiper();
  const swiperRef = React.useRef<SwiperRef>(null);
  const paginationRef = swiperRef.current?.swiper;

  if (!images.length) return null;

  return (
    <div className={style['com-gallery']}>
      <Swiper
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={images.length > 1}
        pagination={{
          el: '.swiper-pagination',
          clickable: true
        }}
        className="swiper-main lg:h-96"
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Thumbs, Autoplay, EffectFade, Navigation, Pagination]}
        onSwiper={setSwiperRef}
        onSlideChange={onSlideChange}
        onNavigationNext={swiper => {
          swiper.animating = true;
        }}
        onNavigationPrev={swiper => {
          swiper.animating = true;
        }}
      >
        {images?.map((item, idx) => {
          return (
            <SwiperSlide key={idx}>
              {item && (
                <Link className="glightbox slideshow" href="/">
                  <Image fill src={item.src} alt="" loading="lazy" quality={50} />
                </Link>
              )}
            </SwiperSlide>
          );
        })}
        {images.length > 1 && (
          <div className="navigation-custom">
            <button className="fake-nav fake-nav-left" onClick={handlePrev}>
              <i className={`ico ico-chevron-left  ${isDisablePrev ? 'cursor-default opacity-30' : ''}`}></i>
            </button>
            <button
              className={`fake-nav fake-nav-right ${isDisableNext ? 'cursor-default opacity-30' : ''}`}
              onClick={handleNext}
            >
              <i className="ico ico-chevron-right"></i>
            </button>
          </div>
        )}
        <div className="swiper-pagination">
          {paginationRef?.slides.map((slide, index: number) => (
            <span
              key={`pagination-${index}`}
              className={`swiper-pagination-bullet ${paginationRef.activeIndex === index ? 'swiper-pagination-bullet-active' : ''
                }`}
              onClick={() => paginationRef.slideTo(index)}
            />
          ))}
        </div>
      </Swiper>
      {images.length >= thumbCount && (
        <Swiper
          breakpoints={{
            1024: {
              slidesPerView: 4,
              spaceBetween: 8
            }
          }}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="swiper swiper-thumb mt-3 hidden h-20 lg:block lg:h-24"
          onSwiper={setThumbsSwiper}
        >
          {images?.map((item, idx) => {
            return (
              <SwiperSlide key={idx}>
                <Image
                  fill
                  src={item.src}
                  alt={'Gallery'}
                  className="h-full cursor-pointer"
                  loading="lazy"
                  quality={50}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Gallery;
