'use client';

import { PageBaseProps } from '@/common/interfaces';

import CreateToolForm from '@/modules/create-tool/components/create-tool-form';

type PageProps = PageBaseProps;
export default function CreateToolPage(_pageProps: PageProps) {
  return <CreateToolForm />;
}
