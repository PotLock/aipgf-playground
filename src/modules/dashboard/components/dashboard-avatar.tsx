import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import BoderImage from '@/components/common/border-image';

import AvatarFrame from '@/assets/svgs/avatar-frame.svg';

type IDashboardAvatarProps = ComponentBaseProps & {
  imageUrl?: string;
  altText?: string;
};

const DashboardAvatar: FC<IDashboardAvatarProps> = ({ imageUrl, altText, className }) => {
  return (
    <div className={classNames('relative h-20 w-20', className)}>
      <BoderImage
        imageBoder={AvatarFrame.src}
        className="absolute left-1/2 top-1/2 z-1 h-full w-full -translate-x-1/2 -translate-y-1/2 p-0 [border-image-slice:5_fill] [border-image-width:6.5px]"
      ></BoderImage>
      <div
        className={classNames(
          'absolute left-1/2 top-1/2 z-0 h-[77px] w-[77px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl',
          className
        )}
      >
        <Image
          src={imageUrl || '/api/placeholder/96/96'}
          alt={altText || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          width={80}
          height={80}
        />
      </div>
    </div>
  );
};

export default DashboardAvatar;
