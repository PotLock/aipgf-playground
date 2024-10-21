'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import FooterFrame from '@/assets/svgs/footer-frame.svg';

type MainFooterProps = ComponentBaseProps;

const MainFooter: FC<MainFooterProps> = ({ className }) => {
  return (
    <div className={classNames('relative max-w-[1440px] shrink-0', className)}>
      <Image
        className="min-h-[90px] w-full object-cover lg:min-h-[66px]"
        src={FooterFrame.src}
        alt="Footer Frame"
        width={FooterFrame.width}
        height={FooterFrame.height}
      />
      <div className="absolute left-1/2 top-1/3 flex w-full max-w-[1020px] -translate-x-1/2 flex-col-reverse items-center gap-3 px-4 text-xs lg:top-1/2 lg:flex-row lg:justify-between lg:text-sm">
        <p>© 2023 PromptWallet. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li>
            <a href="#">Terms of Service</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Sercurity</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MainFooter;
