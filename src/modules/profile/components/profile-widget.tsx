'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';

import { DASH_BOARD_AGENT_LIST } from '@/modules/dashboard/constants/dashboard-data.constant';

import BoderImage from '@/components/common/border-image';

import line from '@/assets/svgs/line.svg';
import ProfileBottomFrameBorder from '@/assets/svgs/profile-bottom-frame-border.png';

import DashboardAgentList from '@/modules/dashboard/components/dashboard-agent-list';
import DashboardBottomProfileDecor from '@/modules/dashboard/components/dashboard-bottom-profile-decor';
import DashboardNotesBoard from '@/modules/dashboard/components/dashboard-note-board';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import DashboardAvatar from '@/modules/dashboard/components/dashboard-avatar';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
type ProfileWidgetProps = ComponentBaseProps & {
  address: string;
};

const ProfileWidget: FC<ProfileWidgetProps> = ({ className, address }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const fetchAgentByUsername = useCallback(async () => {
    setIsLoading(true);
    try {
      if (address) {
        const response = await fetch(`/api/agent?userId=${address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agent');
        }
        const agents = await response.json();

        setAgents(agents);
      }
    } catch (error) {
      console.error('Error fetching agent:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchAgentByUsername();
  }, [fetchAgentByUsername]);

  const handleAgentClick = (agent: any) => {
    console.log(agent);
    setSelectedAgent(agent);
    setIsOpenModal(true);
  };

  const startChat = async (agentId: string) => {
    try {
      const response = await fetch('/api/newChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ agentId })
      });

      if (!response.ok) {
        throw new Error('Failed to start new chat');
      }

      const data = await response.json();
      console.log('New chat started:', data);

      if (data && data.chat_id) {
        router.push(`/chat/${data.chat_id}`);
      } else {
        console.error('No chat_id received from the server');
      }
    } catch (error) {
      console.error('Error starting new chat:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while starting the chat.',
        variant: 'destructive'
      });
    }
  };

  return (
    <BoderImage
      imageBoder={ProfileBottomFrameBorder.src}
      className={classNames('relative flex w-full max-w-[483px] justify-center p-0', className)}
    >
      <DashboardBottomProfileDecor />
      <div className="w-full">
        <p className="px-8 py-4">Agent Creator ({agents.length})</p>
        <div className="flex flex-col gap-6 px-8 py-6">
          <DashboardAgentList items={agents} onClick={() => {}} />
        </div>
        <Image src={line.src} alt="line" className="w-full" width={line.width} height={line.height} />
        <DashboardNotesBoard address={address} />
      </div>
    </BoderImage>
  );
};

export default ProfileWidget;
