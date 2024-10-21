import React, { FC } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';
import { CountdownTimerIcon } from '@radix-ui/react-icons';

type CountDownProps = ComponentBaseProps & {
  value: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
};

const CountDown: FC<CountDownProps> = ({ className, value = 0, max = 100, size = 'sm', ...rest }) => {
  const percent = (value / max) * 100;
  let boxClassName = '';

  if (size === 'sm') {
    boxClassName += 'h-6';
  } else if (size === 'md') {
    boxClassName += 'h-8';
  } else if (size === 'lg') {
    boxClassName += 'h-10';
  }

  return (
    <div
      className={classNames('countdown relative overflow-hidden rounded-lg bg-gray-100', className)}
      data-testid="countdown"
      {...rest}
    >
      <CountdownInfo className="z-1 text-black" value={value} />
      <div
        className={classNames('countdown__bar relative z-2 overflow-hidden bg-primary', boxClassName)}
        style={{ width: percent + '%' }}
      >
        <CountdownInfo className="z-3 text-white" value={value} />
      </div>
    </div>
  );
};

type CountdownInfoProps = {
  className?: string;
  value: number;
};

const CountdownInfo: FC<CountdownInfoProps> = ({ className, value }) => {
  return (
    <div className={classNames('countdown_info absolute left-2 top-1/2 flex -translate-y-1/2 items-center', className)}>
      <CountdownTimerIcon />
      <span className="countdown__text whitespace-nowrap">{value} seconds</span>
    </div>
  );
};

export default CountDown;
