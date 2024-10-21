
'use server'
import { Sidebar } from './sidebar'

import { auth } from '@/modules/auth/constants/auth.config';
import { ChatHistory } from './chat-history'

export async function SidebarDesktop() {
  const session: any = await auth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full  duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px] h-full flex-col border-r-2 border-[#292F36]">
      {/* @ts-ignore */}
      <ChatHistory userId={session.user.id} />
    </Sidebar>
  )
}
