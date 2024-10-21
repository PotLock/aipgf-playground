'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { ComponentBaseProps } from '@/common/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateToolFormData } from '../interfaces/create-tool.dto';

import { CREATE_TOOL_FORM_DEFAULT_VALUE } from '../constants/create-tool.constant';

import BoderImage from '@/components/common/border-image';

import DashboardBottomProfileDecor from '@/modules/dashboard/components/dashboard-bottom-profile-decor';
import FormTextField from '@/modules/form/components/form-text-field';
import FormTextAreaField from '@/modules/form/components/form-textarea-field';

import CreateToolFrame from '@/assets/svgs/create-agent-frame.svg';
import CreateButton from '@/assets/svgs/create-button.svg';

import { CreateToolFormSchema } from '../validations/create-tool-form';

type CreateToolFormProps = ComponentBaseProps;

const CreateToolForm: FC<CreateToolFormProps> = ({ className }) => {
  const form = useForm<CreateToolFormData>({
    resolver: zodResolver(CreateToolFormSchema),
    mode: 'onChange',
    defaultValues: CREATE_TOOL_FORM_DEFAULT_VALUE
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = form;

  const onSubmit = (_data: CreateToolFormData) => {
    // Handle form submission
  };
  const name = watch('name');
  const description = watch('description');
  const tag = watch('tag');
  const jsonParameter = watch('jsonParameter');

  return (
    <div className={classNames('flex w-full grow items-center justify-center py-4', className)}>
      <div className="container flex flex-col items-center justify-center gap-6">
        <BoderImage
          imageBoder={CreateToolFrame.src}
          className={classNames('relative flex w-full max-w-[483px] flex-col items-center p-0', className)}
        >
          <DashboardBottomProfileDecor />
          <div className="flex w-full flex-col gap-8 px-4 py-4">
            <h1 className="text-center text-h5 font-bold">Create Tool</h1>
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
              <FormTextAreaField
                error={errors.jsonParameter}
                form={form}
                label="Json parameter"
                name="jsonParameter"
                isValid={isValid}
                value={jsonParameter}
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

export default CreateToolForm;
