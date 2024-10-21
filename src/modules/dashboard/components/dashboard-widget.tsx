'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import BoderImage from '@/components/common/border-image';
import line from '@/assets/svgs/line.svg';
import ProfileBottomFrameBorder from '@/assets/svgs/profile-bottom-frame-border.png';

import DashboardAgentList from './dashboard-agent-list';
import DashboardBottomProfileDecor from './dashboard-bottom-profile-decor';
import DashboardNotesBoard from './dashboard-note-board';
import DashboardWidgetTools from './dashboard-widget-tools';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import DashboardAvatar from './dashboard-avatar';
import axios from 'axios';
type DashboardWidgetProps = ComponentBaseProps;

const DashboardWidget: FC<any> = ({ className, session }) => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null) as any;
  const router = useRouter();
  const [toolIds, setToolIds] = useState('');
  const [widgetIds, setWidgetIds] = useState('');
  const [tools, setTools] = useState([]);
  const [isLoadingTools, setIsLoadingTools] = useState(true);
  const [isLoadingWidget, setIsLoadingWidget] = useState(true);

  const createDefaultAgent = useCallback(async () => {
    //@ts-ignore
    const userId = session.user.username;
    const avatars = ['/avatar1.png', '/avatar2.png', '/avatar3.png'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const defaultAgent = {
      name: 'Staking Agent',
      description: 'This is a staking agent.',
      introMessage: 'Hello! I am your staking agent.',
      tool_ids: [toolIds],
      widget_ids: [widgetIds],
      prompt: `create button action stake 0.1 aptos to ${userId}`,
      user_id: userId,
      avatar: '/logo_aptos.png' // Assign a random avatar
    };
    //@ts-ignore
    await createAgentAPI(defaultAgent);
    fetchAgents();
  }, [toolIds, widgetIds]);

  const fetchTools = useCallback(async () => {
    setIsLoadingTools(true);
    try {
      const userId = session.user.username;
      const response = await axios.get(`/api/tools?userId=${userId}`);
      const contractTools = response.data.filter((tool: any) => tool.type === 'contractTool');
      setTools(contractTools);
      //console.log('contractTools', contractTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setIsLoadingTools(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const createAgentAPI = async (agentData: {
    name: string;
    description: string;
    introMessage: string;
    tools: string[];
    widget: string[];
    prompt: string;
    user_id: string;
  }) => {
    try {
      const response = await axios.post('/api/agent', agentData);
      return response.data;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  };

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    //@ts-ignore
    const userId = session.user.username;
    try {
      if (userId) {
        const response = await axios.get(`/api/agent?userId=${userId}`);
        const fetchedAgents = response.data;
        setAgents(fetchedAgents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoading(false);
    }
  }, [createDefaultAgent]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const uploadDataToApi = async (data: any) => {
    try {
      const response = await axios.post('/api/tools', data);
      //console.log('Data uploaded successfully:', response.data);
      return response.data.upsertedId;
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const createToolAPI = useCallback(async () => {
    const toolData = {
      type: 'contractTool',
      name: `0x1::delegation_pool::add_stake`,
      tool: {
        name: `0x1::delegation_pool::add_stake`,
        description:
          "The `add_stake` function allows a delegator to add a specified amount of coins to the delegation pool. This amount is converted into shares, which represent the delegator's stake in the pool. The function ensures that the delegator is allowlisted and synchronizes the delegation pool with the underlying stake pool before executing the addition. The function also calculates and deducts any applicable fees from the added stake, ensuring that the delegator's balance is updated accordingly.",
        params: {
          user: {
            type: 'address',
            description: 'The address of the delegator.'
          },
          amount: {
            type: 'u64',
            description: 'The amount of coins to be added to the delegation pool.'
          }
        },
        generic_type_params: [],
        return: [],
        type: 'entry',
        functions: 'add_stake',
        address: '0x1'
      },
      user_id: session.user.username
    };
    //console.log('Tool data:', toolData);
    try {
      const toolId = await uploadDataToApi(toolData);
      if (toolId) {
        setToolIds(toolId); // Ensure toolIds is set only if toolId is valid
      } else {
        console.error('Failed to create tool, toolId is null');
      }
    } catch (error) {
      console.error('Error creating tool:', error);
    }

  }, []);

  useEffect(() => {
    if (!isLoadingTools && tools.length === 0) {
      createToolAPI();
    }
  }, [isLoadingTools, tools, createToolAPI]);

  const saveWidget = useCallback(async () => {
    setIsLoadingWidget(true);
    if (session.user.username) {
      try {
        const widgetData = {
          type: 'widgetTool',
          tool: {
            name: 'Widget Stake',
            description: `create button action stake 0.1 aptos to ${session.user.username}`,
            prompt: 'create button action stake 0.1 aptos to 0x123123',
            code: `(props) => {\n    return (\n        <a href={\'/widget-chat?prompt=stake 0.1 aptos to ${session.user.username} widgetId=\' + props.widgetId} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">\n            stake 0.1 aptos to ${session.user.username}\n        </a>\n    )\n}`,
            tool_ids: [toolIds]
          },
          user_id: session.user.username,
          name: 'Widget Stake'
        };
        //console.log('Widget data:', widgetData);
        const response = await axios.post('/api/tools', widgetData);
        //console.log('Widget saved successfully:', response.data);
        setWidgetIds(response.data.upsertedId);
      } catch (error) {
        console.error('Error saving widget:', error);
      } finally {
        setIsLoadingWidget(false);
      }
    }
  }, [toolIds]);

  useEffect(() => {
    if (toolIds?.length > 0) {
      saveWidget();
    }
  }, [saveWidget, toolIds]);

  useEffect(() => {
    //console.log('Checking to create default agent:', { toolIds, widgetIds, agents });
    // Check if both toolIds and widgetIds are set and agents are empty
    if (toolIds?.length > 0 && widgetIds?.length > 0 && agents.length === 0) {
      createDefaultAgent();
    }
  }, [createDefaultAgent, widgetIds, agents.length, toolIds]);

  const handleAgentClick = (agent: any) => {
    console.log(agent);
    setSelectedAgent(agent);
    setIsOpenModal(true);
  };

  const startChat = async (agentId: string) => {
    router.push(`/chat?agentId=${agentId}`);
  };
  //console.log(agents);

  return (
    <BoderImage
      imageBoder={ProfileBottomFrameBorder.src}
      className={classNames('relative flex w-full max-w-[483px] justify-center p-0', className)}
    >
      <DashboardBottomProfileDecor />
      <div className="w-full">
        <a href='/agent'>
          <p className="px-8 py-4">Agent Creator ({agents.length})</p>
        </a>
        <div className="flex flex-col gap-6 px-8 py-6">
          {isLoading ? (
            <div className="flex h-20 items-center justify-center">
              <p>Loading agents...</p>
            </div>
          ) : (
            <DashboardAgentList onClick={handleAgentClick} items={agents} />
          )}
        </div>
        <Image src={line.src} alt="line" className="w-full" width={line.width} height={line.height} />
        <DashboardNotesBoard />
        <div className="px-8 py-6">
          <DashboardWidgetTools />
        </div>
      </div>
      <AugmentedPopup
        visible={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setSelectedAgent(null);
        }}
        textHeading={'Profile Agent'}
      >
        {selectedAgent && (
          <div className="flex max-h-[80vh] flex-col items-center gap-4 overflow-y-auto p-8">
            <DashboardAvatar imageUrl={selectedAgent.avatar} altText={selectedAgent.name} />
            <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
            <p className="text-center">Description: {selectedAgent.description}</p>
            <p className="italic">Intro Message: "{selectedAgent.introMessage}"</p>
            <div className="mt-4 flex w-full justify-end">
              <button
                onClick={() => startChat(selectedAgent._id)}
                className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
              >
                Start Chat
              </button>
            </div>
          </div>
        )}
      </AugmentedPopup>
    </BoderImage>
  );
};

export default DashboardWidget;
