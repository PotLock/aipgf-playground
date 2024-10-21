import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

export type SelectOption = {
  label: string;
  value: string;
};

interface IFormSelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  form: UseFormReturn<T>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
}

export default function FormSelectField<T extends FieldValues>({
  name,
  form,
  options,
  label,
  placeholder = 'Select an option'
}: IFormSelectFieldProps<T>) {
  const { register, setValue, watch } = form;
  const value = watch(name);
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelect = () => setIsOpen(prev => !prev);

  const handleOptionSelect = (optionValue: string) => {
    setValue(name, optionValue as PathValue<T, Path<T>>, { shouldValidate: true });
    setIsOpen(false);
  };

  const selectedLabel = options.find(option => option.value === value)?.label || placeholder;

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <label htmlFor={name} className="text-xs lg:text-[18px]">
          {label}
        </label>
      )}

      <div className="flex flex-col gap-1">
        <div ref={selectRef} className="relative">
          <button
            type="button"
            className={classNames(
              'flex w-full items-center justify-between rounded-lg border border-[#5F5C64] bg-[#2C30351A] px-5 py-3 text-left text-base text-sm ',
              form.formState.errors[name] ? 'border-rose-500' : 'border-[#5F5C64]'
            )}
            onClick={toggleSelect}
          >
            <span className={value ? 'text-white' : 'text-gray-500'}>{selectedLabel}</span>
            <motion.svg
              className="h-3 w-3 text-gray-400"
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="currentColor"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M4.69774 7.396L0.317854 2.2019C-0.418146 1.3289 0.205789 0 1.35179 0H10.6477C11.7937 0 12.4176 1.3299 11.6816 2.2019L7.30174 7.396C6.62274 8.201 5.37674 8.201 4.69774 7.396Z"
                fill="#FEFEFE"
              />
            </motion.svg>
          </button>
          <input type="hidden" {...register(name)} />
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {options.map(option => (
                  <div
                    key={option.value}
                    className={classNames(
                      'cursor-pointer px-3 py-2 text-sm',
                      option.value === value ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900 hover:bg-gray-100'
                    )}
                    onClick={() => handleOptionSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {form.formState.errors[name] ? (
          <p className="text-[8px] text-red-500 sm:text-[10px]">{form.formState.errors[name]?.message as string}</p>
        ) : (
          <p className="text-[8px] opacity-0 sm:text-[10px]">{'message'}</p>
        )}
      </div>
    </div>
  );
}
