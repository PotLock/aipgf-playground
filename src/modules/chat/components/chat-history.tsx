import * as React from 'react';

import Link from 'next/link';

import { cn } from '../utils/utils';
import { SidebarList } from './sidebar-list';
import { buttonVariants } from '@/components/ui/button';
import { IconPlus } from '@/components/ui/icons';

interface ChatHistoryProps {
  userId?: string;
}

export async function ChatHistory({ userId }: ChatHistoryProps) {
  return (
    <div className="scrollbar flex grow flex-col overflow-auto">
      {/* <div className="flex items-center justify-between p-4">
        <h4 className="text-sm font-medium">Chat History</h4>
      </div> */}
      {/* <div className="mb-2 px-2">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'justify-star h-10 w-full px-4 shadow-none transition-colors hover:bg-zinc-200/90'
          )}
        >
          <IconPlus className="-translate-x-2 stroke-2" />
          New Chat
        </Link>
      </div> */}
      <React.Suspense
        fallback={
          <div className="flex flex-1 flex-col space-y-4 overflow-auto px-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-6 w-full shrink-0 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        }
      >
        {/* @ts-ignore */}
        <SidebarList userId={userId} />
      </React.Suspense>
    </div>
  );
}
