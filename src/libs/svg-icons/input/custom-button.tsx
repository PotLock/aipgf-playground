'use client';

import { FC } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import BoderImage from '@/components/common/border-image';

import ProfileBtnFrame from '@/assets/svgs/profile-btn-frame.svg';
import { cn } from '@/components/utils';

type CustomButtonProps = ComponentBaseProps & {
  children?: React.ReactNode;
  onClick?: () => void;
};

const CustomButton: FC<CustomButtonProps> = ({ className, ...rest }) => {
  return (
    <BoderImage
      imageBoder={ProfileBtnFrame.src}
      className={cn(
        'px-11 py-1 uppercase',
        '[border-image-slice:13_fill] [border-image-width:15px]',
        'flex items-center gap-1 justify-center',
        'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {rest.children}
    </BoderImage>
  );
};

export default CustomButton;
