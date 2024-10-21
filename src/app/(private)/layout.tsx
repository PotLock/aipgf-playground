
import { LayoutProps } from '@/common/interfaces';

export default async function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="flex w-full grow flex-col overflow-hidden">{children}</div>
  );
}
