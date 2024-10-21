'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import HeaderFrame from '@/assets/svgs/header-frame.svg';
import HeaderTopLeftElement from '@/assets/svgs/header-top-left-element.svg';
import HeaderTopRightElement from '@/assets/svgs/header-top-right-element.svg';

type MainHeaderProps = ComponentBaseProps & {
  title?: string;
};

const MainHeader: FC<MainHeaderProps> = ({ className, title = 'Prompt Wallet' }) => {
  return (
    <div className={classNames('flex w-full max-w-[1440px] shrink-0 flex-row items-start justify-center', className)}>
      <div className="hidden grow lg:block">
        <Image
          src={HeaderTopLeftElement.src}
          alt="Header Top Left Element"
          width={HeaderTopLeftElement.width}
          height={HeaderTopLeftElement.height}
          className="mr-auto max-w-[100%]"
        />
      </div>
      <div className="relative grow lg:shrink-0 lg:grow-0">
        <Image
          src={HeaderFrame.src}
          className="mx-auto min-h-[66px] object-cover"
          alt="Header Frame"
          width={HeaderFrame.width}
          height={HeaderFrame.height}
        />
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold uppercase">
          {title}
        </p>
      </div>
      <div className="hidden grow lg:block">
        <Image
          className="ml-auto max-w-[100%]"
          src={HeaderTopRightElement.src}
          alt="Header Top Right Element"
          width={HeaderTopRightElement.width}
          height={HeaderTopRightElement.height}
        />
      </div>
    </div>
  );
};

export default MainHeader;
