'use client'

import { clearChats, getChats } from '@/libs/chat/chat.actions'
import { ClearHistory } from './clear-history'
import { SidebarItems } from './sidebar-items'
import SelectPage from './select-page'
import { redirect } from 'next/navigation'
import { cache } from 'react'

interface SidebarListProps {
  userId?: string
  children?: React.ReactNode
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)

  if (!chats || 'error' in chats) {
    redirect('/')
  } else {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="scrollbar flex-1 overflow-auto">
          <SelectPage />
          {chats?.length ? (
            <div className="space-y-2 px-2">
              <SidebarItems chats={chats} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No chat history</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
        </div>
      </div>
    )
  }
}
