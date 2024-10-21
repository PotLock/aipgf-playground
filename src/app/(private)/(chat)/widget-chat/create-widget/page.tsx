'use client';

import { PageBaseProps } from '@/common/interfaces';

import CreateWidgetForm from '@/modules/create-widget/components/create-widget-form';

type PageProps = PageBaseProps;
export default function CreateWidgetPage(_pageProps: PageProps) {
  return <CreateWidgetForm />;
}
