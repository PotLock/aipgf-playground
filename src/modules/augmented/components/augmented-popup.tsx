'use client';

import { FC, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import '../style.scss';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import ButtonClose from '@/assets/svgs/popup-close.svg';

type AugmentedPopupProps = ComponentBaseProps & {
  children: React.ReactNode;
  textHeading?: string;
  onClose?: () => void;
};

const AugmentedPopup: FC<AugmentedPopupProps> = ({ children, visible = false, onClose, textHeading, className }) => {
  return (
    <Dialog modal={true} open={visible}>
      <DialogContent
        autoFocus={false}
        data-augmented-ui
        className={classNames(
          'border-none outline-none',
          'aug-tl1-30 aug-clip-tl1',
          'aug-border-bg-secondary aug-border aug-border-8 bg-[#141A20] p-3',
          'aug-round-r1 aug-round-bl1 p-0',
          className
        )}
      >
        <DialogHeader className="flex flex-col-reverse justify-between border-b-[1px] border-[#3F454D] px-8 pb-6 pt-8 text-left text-lg md:flex-row md:items-center">
          <div className="grow">{textHeading}</div>
          <div className="ml-auto shrink-0 cursor-pointer p-1" onClick={onClose}>
            <img src={ButtonClose.src} alt="close" width={ButtonClose.width} height={ButtonClose.height} />
          </div>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AugmentedPopup;
