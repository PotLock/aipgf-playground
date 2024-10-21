'use client';

import { FC } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import '../style.scss';

type AugementedButtonProps = ComponentBaseProps;

const AugementedButton: FC<AugementedButtonProps> = () => {
  return (
    <>
      <div
        data-augmented-ui
        className={classNames('aug-tl1-20 aug-tl2-10 aug-clip-tl', 'aug-clip-br aug-br-40', 'bg-slate-200 p-3')}
      >
        Augmented Button
      </div>
    </>
  );
};

export default AugementedButton;
