import classNames from 'classnames';
import { FieldError, FieldValues, Path, UseFormReturn } from 'react-hook-form';

type FormTextFieldProps<T extends FieldValues> = {
  label: string;
  form: UseFormReturn<T>;
  name: Path<T>;
  error?: FieldError;
  isValid?: boolean;
  value?: string;
  validMessage?: string;
};

export default function FormTextField<T extends FieldValues>({
  label,
  name,
  form,
  error,
  isValid,
  value,
  validMessage = 'Is valid'
}: FormTextFieldProps<T>) {
  return (
    <div className="lg-gap-3 flex flex-col gap-4">
      <label className="text-xs lg:text-[18px]" htmlFor={name}>
        {label}
      </label>
      <div className="flex flex-col gap-1">
        <input
          {...form.register(name)}
          type="text"
          id={name}
          className={classNames(
            'h-8 w-full rounded-lg border border-[#5F5C64] bg-[#2C30351A] px-5 py-3 text-sm placeholder:text-gray-400 sm:h-12',
            'focus:border-white focus:outline-none focus:ring-1 focus:ring-white',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            value && isValid && 'border-green-500 focus:border-green-500 focus:ring-green-500'
          )}
        />
        {error ? (
          <p className="text-[8px] text-red-500 sm:text-[10px]">{error.message}</p>
        ) : value && isValid ? (
          <p className="text-[8px] text-green-500 sm:text-[10px]">{validMessage}</p>
        ) : (
          <p className="text-[8px] opacity-0 sm:text-[10px]">{'message'}</p>
        )}
      </div>
    </div>
  );
}
