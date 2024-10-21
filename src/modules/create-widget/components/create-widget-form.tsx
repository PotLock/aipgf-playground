'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { ComponentBaseProps } from '@/common/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateWidgetFormData } from '../interfaces/create-widget.dto';

import { CREATE_WIDGET_FORM_DEFAULT_VALUE, PROMPT_OPTIONS } from '../constants/create-widget.constant';

import BoderImage from '@/components/common/border-image';

import DashboardBottomProfileDecor from '@/modules/dashboard/components/dashboard-bottom-profile-decor';
import FormSelectField from '@/modules/form/components/form-select-field';
import FormTextField from '@/modules/form/components/form-text-field';
import FormTextAreaField from '@/modules/form/components/form-textarea-field';

import CreateWidgetFrame from '@/assets/svgs/create-agent-frame.svg';
import CreateButton from '@/assets/svgs/create-button.svg';

import { CreateWidgetFormSchema } from '../validations/create-widget-form';

type CreateWidgetFormProps = ComponentBaseProps;

const CreateWidgetForm: FC<CreateWidgetFormProps> = ({ className }) => {
  const form = useForm<CreateWidgetFormData>({
    resolver: zodResolver(CreateWidgetFormSchema),
    mode: 'onChange',
    defaultValues: CREATE_WIDGET_FORM_DEFAULT_VALUE
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = form;

  const onSubmit = (_data: CreateWidgetFormData) => {
    // Handle form submission
  };
  const name = watch('name');
  const description = watch('description');
  const tag = watch('tag');
  const prompt = watch('prompt');

  return (
    <div className={classNames('flex w-full grow items-center justify-center py-4', className)}>
      <div className="container flex flex-col items-center justify-center gap-6">
        <BoderImage
          imageBoder={CreateWidgetFrame.src}
          className={classNames('relative flex w-full max-w-[483px] flex-col items-center p-0', className)}
        >
          <DashboardBottomProfileDecor />
          <div className="flex w-full flex-col gap-8 px-4 py-4">
            <h1 className="text-center text-h5 font-bold">Create Widget</h1>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
              <FormTextField error={errors.name} form={form} label="Name" name="name" isValid={isValid} value={name} />
              <FormTextField
                error={errors.description}
                form={form}
                label="Description"
                name="description"
                isValid={isValid}
                value={description}
              />
              <FormTextField error={errors.tag} form={form} label="Tag" name="tag" isValid={isValid} value={tag} />
              <FormSelectField form={form} name="tool" options={PROMPT_OPTIONS} label="Select Tool" />
              <FormTextAreaField
                error={errors.prompt}
                form={form}
                label="Prompt"
                name="prompt"
                isValid={isValid}
                value={prompt}
              />
              <button type="submit">
                <Image src={CreateButton.src} alt="create" width={CreateButton.width} height={CreateButton.height} />
              </button>
            </form>
          </div>
        </BoderImage>
      </div>
    </div>
  );
};

export default CreateWidgetForm;
