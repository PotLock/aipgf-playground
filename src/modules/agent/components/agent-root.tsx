'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';
import { Button } from '@/components/ui/button';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import FormTextField from '@/modules/form/components/form-text-field';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import MultiSelectWidgets from '@/components/common/multi-select-widget';
import axios from 'axios';
import MultiSelectTools from '@/components/common/multi-select';

const AgentRoot: FC<any> = ({ className, accountAddress }) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [isOpenCreateAgent, setIsOpenCreateAgent] = useState<boolean>(false);
  const { toast } = useToast();
  const [isLoadingWidget, setIsLoadingWidget] = useState(false);
  const [widgetPrompt, setWidgetPrompt] = useState('');

  const [tools, setTools] = useState<any[]>([]);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { account } = useWallet();
  const agentForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      introMessage: '',
      tools: [],
      widget: [],
      prompt: ''
    }
  });

  const fetchTools = useCallback(async () => {
    try {
      const userId: any = accountAddress;
      const response = await axios.get(`/api/tools?userId=${userId}`);
      const contractTools = response.data.filter((tool: any) => tool.type === 'contractTool');
      setTools(contractTools);
      //console.log('contractTools', contractTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  }, [account]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const fetchWidgetTools = useCallback(async () => {
    setIsLoading(true);
    try {
      const userId = accountAddress;
      const response = await fetch(`/api/tools?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      const filteredTools = data.filter((tool: any) => tool.type === 'widgetTool');
      setWidgets(filteredTools);
    } catch (error) {
      console.error('Error fetching widget tools:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWidgetTools();
  }, [fetchWidgetTools]);

  const createAgentAPI = async (agentData: {
    name: string;
    description: string;
    introMessage: string;
    tools: string[];
    widget: string[];
    prompt: string;
  }) => {
    try {
      const response = await axios.post('/api/agent', agentData);
      return response.data;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  };

  const handleCreateAgent = async (data: {
    name: string;
    description: string;
    introMessage: string;
    tools: string[];
    widget: string[];
    prompt: string;
  }) => {
    try {
      const userId = accountAddress
      const agentData = {
        name: data.name,
        description: data.description,
        introMessage: data.introMessage,
        tool_ids: data.tools,
        widget_ids: data.widget,
        prompt: data.prompt,
        user_id: userId
      };
      //@ts-ignore
      const createdAgent = await createAgentAPI(agentData);
      setAgents([...agents, createdAgent]);
      setIsOpenCreateAgent(false);
      agentForm.reset();
      fetchAgents();
      toast({
        title: 'Agent created successfully!',
        description: 'Your agent has been created and saved.'
      });
    } catch (error) {
      toast({
        title: 'Error creating agent',
        description: 'There was a problem creating the agent. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleCloseCreateAgent = useCallback(() => {
    setIsOpenCreateAgent(false);
    agentForm.reset();
    setWidgetPrompt('');
  }, [agentForm]);

  const isValid = useCallback(() => {
    const { name, description, introMessage, tools, widget, prompt } = agentForm.getValues();
    return name.trim() !== '' && description.trim() !== '' && introMessage.trim() !== '';
  }, [agentForm]);

  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  const fetchAgents = useCallback(async () => {
    setIsLoadingAgents(true);
    try {
      const userId = accountAddress
      if (userId) {
        const response = await axios.get(`/api/agent?userId=${userId}`);
        setAgents(response.data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoadingAgents(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className={classNames('flex w-full grow py-4', className)}>
      <div className="container flex flex-col items-center gap-6">
        <h1 className="mt-5 text-h5 font-bold">Agents</h1>
        <div className="flex w-full justify-end">
          <Button onClick={() => setIsOpenCreateAgent(true)}>Create Agent</Button>
        </div>
        {isLoadingAgents ? (
          <div className="text-center">Loading agents...</div>
        ) : agents.length > 0 ? (
          <div className="grid w-full grid-cols-3 gap-4">
            {agents.map((agent: any) => (
              <a href={`/chat?agentId=${agent._id.toString()}`}>
                <div
                  key={agent._id}
                  className="flex flex-col items-start justify-between gap-2 rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h2 className="text-lg font-semibold">{agent.name}</h2>
                  <p className="text-sm text-white">{agent.description}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center">No agents found. Create your first agent!</div>
        )}
        <AugmentedPopup visible={isOpenCreateAgent} onClose={handleCloseCreateAgent} textHeading={'Create Agent'}>
          <form className="flex max-h-[80vh] flex-col gap-2 overflow-y-auto p-8">
            <FormTextField form={agentForm} name="name" label="Name" />
            <FormTextField form={agentForm} name="description" label="Description" />
            <FormTextField form={agentForm} name="introMessage" label="Intro Message" />
            <div className="mb-4 flex flex-col gap-3">
              <label htmlFor="tools" className="text-xs text-white lg:text-[18px]">
                Select tools
              </label>
              <MultiSelectTools
                tools={tools || []}
                selectedTools={agentForm.watch('tools') || []}
                onChangeSelectedTools={(selectedTools: any) => {
                  agentForm.setValue('tools', selectedTools);
                }}
                isLoading={isLoading}
              />
            </div>
            <div className="mb-4 flex flex-col gap-3">
              <label htmlFor="widget" className="text-xs text-white lg:text-[18px]">
                Select widget
              </label>
              <MultiSelectWidgets
                widgets={widgets || []}
                selectedWidgets={agentForm.watch('widget') || []}
                onChangeSelectedWidgets={(selectedWidgets: any) => {
                  agentForm.setValue('widget', selectedWidgets);
                }}
                isLoading={isLoadingWidget}
              />
            </div>
            <div className="mb-4 flex flex-col gap-3">
              <label htmlFor="prompt" className="text-xs text-white lg:text-[18px]">
                Prompt
              </label>
              <Textarea
                value={agentForm.watch('prompt')}
                onChange={e => agentForm.setValue('prompt', e.target.value)}
                placeholder={'Enter prompt'}
                rows={4}
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={agentForm.handleSubmit(handleCreateAgent)} type="submit" disabled={!isValid()}>
              Create Agent
            </Button>
          </form>
        </AugmentedPopup>
      </div>
    </div>
  );
};

export default AgentRoot;
