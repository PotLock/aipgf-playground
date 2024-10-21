'use client';

import { PageBaseProps } from '@/common/interfaces';

import ErrorInformation from '@/components/common/404';

type PageProps = PageBaseProps;

export default function NotFoundPage(_pageProps: PageProps) {
  return (
    <div className="grow">
      <ErrorInformation code={404} />
    </div>
  );
}
