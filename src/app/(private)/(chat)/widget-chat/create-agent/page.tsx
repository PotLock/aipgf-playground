'use client';

import { PageBaseProps } from '@/common/interfaces';

import AgentCreateForm from '@/modules/agent/components/agent-create-form';

type PageProps = PageBaseProps;
export default function CreateAgentPage(_pageProps: PageProps) {
  return <AgentCreateForm />;
}
