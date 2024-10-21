
import { PageBaseProps } from '@/common/interfaces';

import AgentRoot from '@/modules/agent/components/agent-root';
import { auth } from '@/modules/auth/constants/auth.config';
type PageProps = PageBaseProps;
export default async function WidgetPage(_pageProps: PageProps) {
  const session: any = await auth();
  return <AgentRoot accountAddress={session.user.username} />;
}
