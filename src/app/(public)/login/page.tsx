'use client';

import { PageBaseProps } from '@/common/interfaces';

import LoginRoot from '@/modules/login/components/login-root';

type PageProps = PageBaseProps;
export default function LoginPage(_pageProps: PageProps) {
  return <LoginRoot />;
}
