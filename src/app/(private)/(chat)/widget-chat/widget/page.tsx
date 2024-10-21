
import { PageBaseProps } from '@/common/interfaces';

import WidgetRoot from '@/modules/widget/components/widget-root';
import { auth } from '@/modules/auth/constants/auth.config';
type PageProps = PageBaseProps;
export default async function WidgetPage(_pageProps: PageProps) {
  const session: any = await auth();
  return <WidgetRoot accountAddress={session.user.username} />;
}
