import React from 'react';
import classNames from 'classnames';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';
import { ComponentBaseProps } from '@/common/interfaces';

import ButtonActiveFrame from '@/assets/svgs/button-active-frame.svg';
import ButtonFrame from '@/assets/svgs/button-frame.svg';

import BoderImage from '../../../components/common/border-image';

type RadioOption = {
  value: string;
  label: string;
  description?: string;
};

type FormRadioFieldProps<T extends FieldValues> = ComponentBaseProps & {
  name: Path<T>;
  form: UseFormReturn<T>;
  options: RadioOption[];
  label?: string;
};

export default function FormRadioField<T extends FieldValues>({
  name,
  form,
  options,
  label,
  className
}: FormRadioFieldProps<T>) {
  const {
    register,
    formState: { errors }
  } = form;
  const error = errors[name];

  return (
    <div className={classNames('flex w-full flex-col gap-4', className)}>
      {label && <label className="text-xs lg:text-[18px]">{label}</label>}
      <div className="flex flex-col gap-1">
        <div className="flex w-full flex-wrap gap-2">
          {options.map(option => (
            <label key={option.value} className="flex-1 cursor-pointer">
              <BoderImage
                imageBoder={form.getValues(name) === option.value ? ButtonActiveFrame.src : ButtonFrame.src}
                className="flex w-full items-center justify-center px-2"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register(name)}
                  className="hidden"
                  onChange={e => e.target.checked && form.setValue(name, option.value as PathValue<T, Path<T>>)}
                />
                <div className="ml-3 flex flex-col">
                  <span className="text-base font-medium">{option.label}</span>
                  {option.description && <span className="text-xs text-gray-500">{option.description}</span>}
                </div>
              </BoderImage>
            </label>
          ))}
        </div>
        {error ? (
          <p className="text-[8px] text-red-500 sm:text-[10px]">{error.message?.toString()}</p>
        ) : (
          <p className="text-[8px] opacity-0 sm:text-[10px]">{'message'}</p>
        )}
      </div>
    </div>
  );
}
