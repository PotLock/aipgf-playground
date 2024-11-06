'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { User } from '@/app/(auth)/auth';
import { useWalletSelector } from "@/components/context/wallet-selector-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';


export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme();
  const { accountId, selector,getBalance,callMethod,sendToken } = useWalletSelector();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={`https://avatar.vercel.sh/${user.username}`}
                alt={user.username ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{user?.username}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                className="w-full cursor-pointer"
                onClick={async () => {
                  signOut({
                    redirectTo: '/',
                  });
                  const wallet = await selector.wallet();
                  await wallet.signOut();
                }}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
