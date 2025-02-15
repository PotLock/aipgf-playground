'use client';

import Link from 'next/link';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/custom/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';

import { PlusIcon, GitIcon, BotIcon, BoxIcon ,LogoOpenAI } from './icons';
import { useSidebar } from '../ui/sidebar';

export function ChatHeader() {
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <></>
        // <BetterTooltip content="New Chat">
        //   <Button
        //     variant="outline"
        //     className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
        //     asChild
        //   >
        //     <Link href="/create-agent">
        //       <PlusIcon />
        //       <span className="md:sr-only">New Agent</span>
        //     </Link>
        //   </Button>
        // </BetterTooltip>
      )}
      
      <BetterTooltip content="Agent">
        <Button
          variant="outline"
          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
          asChild
        >
          <Link href="/agent">
            <BotIcon />
            <span className="md:sr-only">Agent</span>
          </Link>
        </Button>
      </BetterTooltip>
      <BetterTooltip content="Tool">
        <Button
          variant="outline"
          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
          asChild
        >
          <Link href="/tool">
            <BoxIcon size={16} />
            <span className="md:sr-only">Tool</span>
          </Link>
        </Button>
      </BetterTooltip>
      <BetterTooltip content="Provider">
        <Button
          variant="outline"
          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
          asChild
        >
          <Link href="/model">
            <LogoOpenAI />
            <span className="md:sr-only">Provider</span>
          </Link>
        </Button>
      </BetterTooltip>
      <Button
        className="hidden md:flex py-1.5 px-2 h-fit md:h-[34px] order-4 md:ml-auto"
        asChild
      >
        <Link
          href="https://github.com/PotLock/aipgf-playground"
          target="_noblank"
        >
          <GitIcon />
          Github
        </Link>
      </Button>
    </header>
  );
}
