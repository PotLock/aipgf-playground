import { Nunito } from 'next/font/google';
import classNames from 'classnames';
import { LayoutProps } from '@/common/interfaces';

import Body from '@/components/common/layout/body';
import Head from '@/components/common/layout/head';
import Html from '@/components/common/layout/html';
import Root from '@/components/common/layout/root';

const fontNunito = Nunito({
  subsets: ['vietnamese'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['300', '400', '500', '700']
});

export default async function ErrorLayout({ children, params }: LayoutProps) {
  return (
    <Html locale={params.locale}>
      <Head />
      <Body className={classNames(fontNunito.variable, 'font-nunito')}>
        <Root>{children}</Root>
      </Body>
    </Html>
  );
}
