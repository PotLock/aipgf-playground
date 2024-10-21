
import { PageBaseProps } from '@/common/interfaces';

import ClientOnly from '@/modules/auth-aptos/components/ClientOnly';
import LoginRoot from '@/modules/login/components/login-root';
import DashboardRoot from '@/modules/dashboard/components/dashboard-root';

import { auth } from '@/modules/auth/constants/auth.config';

type PageProps = PageBaseProps;
export default async function HomePage(_pageProps: PageProps) {

  const session: any = (await auth());

  if (session) return <DashboardRoot session={session} />
  return (
    <ClientOnly>
      <LoginRoot />
    </ClientOnly>
  )


}
