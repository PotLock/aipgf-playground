'use client';

import { FC } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { ComponentBaseProps } from '@/common/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';

import { AgentCreateFormData } from '../interfaces/agent-create.dto';

import { AGENT_CREATE_FORM_DEFAULT_VALUE, PROMPT_OPTIONS } from '../constants/agent-create.constant';

import BoderImage from '@/components/common/border-image';

import DashboardBottomProfileDecor from '@/modules/dashboard/components/dashboard-bottom-profile-decor';
import FormRadioField from '@/modules/form/components/form-radio-field';
import FormSelectField from '@/modules/form/components/form-select-field';
import FormTextField from '@/modules/form/components/form-text-field';

import CreateAgentFrame from '@/assets/svgs/create-agent-frame.svg';
import CreateButton from '@/assets/svgs/create-button.svg';

import { CreateAgentFormSchema } from '../validations/agent-create-form';

type AgentCreateFormProps = ComponentBaseProps;

const AgentCreateForm: FC<AgentCreateFormProps> = ({ className }) => {
  const form = useForm<AgentCreateFormData>({
    resolver: zodResolver(CreateAgentFormSchema),
    mode: 'onChange',
    defaultValues: AGENT_CREATE_FORM_DEFAULT_VALUE
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = form;

  const onSubmit = (_data: AgentCreateFormData) => {
    // Handle form submission
  };
  const name = watch('name');
  const description = watch('description');
  const tag = watch('tag');
  const introMessage = watch('introMessage');
  const prompt = watch('prompt');

  return (
    <div className={classNames('flex w-full grow items-center justify-center py-4', className)}>
      <div className="container flex flex-col items-center justify-center gap-6">
        <BoderImage
          imageBoder={CreateAgentFrame.src}
          className={classNames('relative flex w-full max-w-[483px] flex-col items-center p-0', className)}
        >
          <DashboardBottomProfileDecor />
          <div className="flex w-full flex-col gap-8 px-4 py-4">
            <h1 className="text-center text-h5 font-bold">Create Agent</h1>
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
              <div className="grid grid-cols-2 gap-4">
                <FormTextField error={errors.tag} form={form} label="Tag" name="tag" isValid={isValid} value={tag} />
                <FormTextField
                  error={errors.introMessage}
                  form={form}
                  label="Intro Message"
                  name="introMessage"
                  isValid={isValid}
                  value={introMessage}
                />
              </div>
              <FormRadioField name="promtType" form={form} options={PROMPT_OPTIONS} label="Prompt" />
              <FormTextField
                error={errors.prompt}
                form={form}
                label="Prompt"
                name="prompt"
                isValid={isValid}
                value={prompt}
              />
              <FormSelectField form={form} name="widget" options={PROMPT_OPTIONS} label="Select Widget" />
              <FormSelectField form={form} name="tool" options={PROMPT_OPTIONS} label="Select Tool" />
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

export default AgentCreateForm;
