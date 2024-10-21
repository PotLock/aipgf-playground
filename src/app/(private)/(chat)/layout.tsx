
import { LayoutProps } from '@/common/interfaces';
import { SidebarDesktop } from '@/modules/chat/components/sidebar-desktop';
import BoderImage from '@/components/common/border-image';
import ChatBorderFrame from '@/assets/svgs/chat-border-frame.svg';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import BackIcon from '@/assets/svgs/back-icon.svg';
import EditIcon from '@/assets/svgs/edit-icon.svg';
import Link from 'next/link';
export default async function PublicLayout({ children }: LayoutProps) {
  return (
    <div className="container flex grow flex-col items-center justify-center gap-6 overflow-hidden">
      <BoderImage imageBoder={ChatBorderFrame.src} className="flex w-full grow flex-col overflow-hidden border-0">
        <div className="flex h-14 w-full shrink-0 items-center justify-between border-b-2 border-[#292F36] px-7">
          <Link href="/" >
            <button className="h-10 w-10">
              <Image
                src={BackIcon.src}
                alt="Back Icon"
                className="h-full w-full translate-y-1 object-contain"
                width={BackIcon.width}
                height={BackIcon.height}
              />
            </button>
          </Link>

          <button className="flex h-8 items-center justify-center gap-2">
            <Image
              src={EditIcon.src}
              alt="Back Icon"
              className="h-full w-full object-contain"
              width={EditIcon.width}
              height={EditIcon.height}
            />
            <span className="text-nowrap">New Chat</span>
          </button>
        </div>
        <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden rounded-b-3xl">
          <div className="relative lg:w-[300px] xl:w-[380px]">
            <SidebarDesktop />
          </div>
          <div className="relative flex w-full">{children}</div>
        </div>
      </BoderImage>
      <Toaster />
    </div>


  );
}
