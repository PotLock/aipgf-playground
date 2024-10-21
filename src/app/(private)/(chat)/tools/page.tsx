
import { PageBaseProps } from '@/common/interfaces';

import ToolRoot from '@/modules/tools/components/tool-root';
import { auth } from '@/modules/auth/constants/auth.config';
type PageProps = PageBaseProps;
export default async function ToolsPage(_pageProps: PageProps) {
  const session: any = await auth();
  return <ToolRoot accountAddress={session.user.username} />;
}
