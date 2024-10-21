'use client';

import { FC } from 'react';
import classNames from 'classnames';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  User,
  CreditCard,
  Settings,
  Keyboard,
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  PlusCircle,
  Plus,
  Github,
  LifeBuoy,
  Cloud,
  LogOut,
  DeleteIcon,
  RecycleIcon,
  BeerIcon,
  Trash2Icon,
  Share2Icon,
  SaveIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IChatPromptItemProps {
  title: string;
  onClick: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  className?: string;
}

const ChatPromptItem: FC<IChatPromptItemProps> = ({ title, onClick, onDelete, onSave, onShare, className }) => {
  return (
    <li className={classNames('flex items-center justify-between', className)} onClick={onClick}>
      <span className="line-clamp-1 max-w-44 grow">{title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="ico-more-vertical shrink-0 px-3 text-xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="rounded-lg border-[#5F5C64] bg-[#141A20] text-white ">
          <ul>
            <li>
              <Button
                variant={'link'}
                onClick={onDelete}
                className="flex items-center gap-3 text-white hover:no-underline"
              >
                <Trash2Icon /> Delete
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                onClick={onSave}
                className="flex items-center gap-3 text-white hover:no-underline"
              >
                <SaveIcon /> Save
              </Button>
            </li>
            <li>
              <Button
                variant={'link'}
                onClick={onShare}
                className="flex items-center gap-3 text-white hover:no-underline"
              >
                <Share2Icon /> Share
              </Button>
            </li>
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};

export default ChatPromptItem;
