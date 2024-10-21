'use client';

import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import classNames from 'classnames';
import { ComponentBaseProps } from '@/common/interfaces';
import { formatRelativeDate } from '@/common/utils/date-time.util';
import { kv } from '@vercel/kv';
import { useRouter } from 'next/navigation';

import { AIChat, ChatMessage } from '../interfaces/chat.interface';

import {
  AI_CHAT_LIST,
  BOT_CHAT_MESSAGES,
  USER_CHAT_HISTORY,
  USER_CHAT_MESSAGES,
  USERS
} from '../constants/chat.constant';

import BoderImage from '@/components/common/border-image';
import DropdownSelect from '@/components/common/dropdown-select';

import { combineChatMessages } from '../utils/chat-combie.util';
import { groupChatHistoryByDate } from '../utils/chat-history.util';
import { createChatMessage, simulateBotResponse } from '../utils/chat-promt-bot.util';

import BackIcon from '@/assets/svgs/back-icon.svg';
import ChatBorderFrame from '@/assets/svgs/chat-border-frame.svg';
import EditIcon from '@/assets/svgs/edit-icon.svg';

import ChatArea from './chat-area';
import ChatPromptList from './chat-prompt-list';
import ChatPromptTextarea from './chat-prompt-textarea';

import { nanoid } from '../utils/utils';
import '@/modules/augmented/style.scss';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import FormTextField from '@/modules/form/components/form-text-field';
import { CreateToolFromContactFormSchema } from '@/modules/create-tool/validations/create-tool-from-contact-form';
import { CreateToolFromContactFormData } from '@/modules/create-tool/interfaces/create-tool.dto';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import MultiSelectTools from '@/components/common/multi-select';
import axios from 'axios';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useSession } from 'next-auth/react';
import { ViewFrame } from '@/modules/chat/validation/ViewFarm';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';

type ChatRootProps = ComponentBaseProps;

const COIN_LIST_URL = 'https://raw.githubusercontent.com/AnimeSwap/coin-list/main/aptos/mainnet.js';

const ChatRoot: FC<ChatRootProps> = ({ className }) => {
  const [selectedOption, setSelectedOption] = useState<AIChat>(AI_CHAT_LIST[0]);
  const [conversationList, setConversationList] = useState<ChatMessage[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [id, setId] = useState<string>(nanoid());
  const [isOpenCreateTool, setIsOpenCreateTool] = useState(false);
  const [moduleData, setModuleData] = useState<any>(null);
  const [functions, setFunctions] = useState<any>(null);
  const [sourceData, setSourceData] = useState<Record<string, any>>({});
  const [isOpenSelectTool, setIsOpenSelectTool] = useState<boolean>(false);
  const [tools, setTools] = useState<any[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [loadingFunctions, setLoadingFunctions] = useState<Record<string, boolean>>({});
  const [coinList, setCoinList] = useState<Array<{ symbol: string; name: string; address: string }>>([]);
  const [isOpenCreateWidget, setIsOpenCreateWidget] = useState(false);
  const [widgetPrompt, setWidgetPrompt] = useState('');
  const [widgetCode, setWidgetCode] = useState('');
  const [selectedWidgetTools, setSelectedWidgetTools] = useState<string[]>([]);
  const [previewWidgetCode, setPreviewWidgetCode] = useState<string>('');
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);

  const { data: session }: any = useSession();
  const { account, connected, disconnect, wallet } = useWallet();

  const { id: chatId } = useParams();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    setIsOpenCreateTool(false);
  };

  const handleCloseSelectTool = () => {
    setIsOpenSelectTool(false);
  };

  const handleSelectAi = useCallback(
    (value: string) => {
      const selectedAi = AI_CHAT_LIST.find(option => option.id === value);

      if (selectedAi) {
        setSelectedOption(selectedAi);
      }
    },
    [AI_CHAT_LIST]
  );

  const aiDropdownOptionList = useMemo(
    () =>
      AI_CHAT_LIST.map(item => ({
        value: item.id,
        label: item.name
      })),
    [AI_CHAT_LIST]
  );

  const handleSend = async (message: string) => {
    setConversationList(prev => [
      ...prev,
      {
        id: chatId ? (chatId as string) : id,
        message: message,
        avatar: '',
        type: 'user',
        creator: account?.address.toString() as string
      }
    ]);

    const botResponse = await simulateBotResponse(message);

    setConversationList(prev => [
      ...prev,
      {
        id: chatId ? (chatId as string) : id,
        message: botResponse,
        avatar: '',
        type: 'bot',
        creator: selectedOption.name
      }
    ]);
  };

  const removeAllDataFromKV = async () => {
    try {
      // Get all keys in the database
      const allKeys = await kv.keys('*');
      // Delete all keys
      const pipeline = kv.pipeline();
      for (const key of allKeys) {
        pipeline.del(key);
      }

      // Execute the pipeline
      await pipeline.exec();

      console.log('All data has been removed from the database');
    } catch (error) {
      console.error('Error removing data from KV:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [conversationList]);

  const getChatFromKV = async (userId: string) => {
    try {
      // Get the chat IDs for the user
      const chatIds = await kv.zrange(`user:chat:${userId}`, 0, -1, { rev: true });

      // Fetch chat details for each chat ID
      const chats = await Promise.all(
        chatIds.map(async chatId => {
          const chatDetails = await kv.hgetall(chatId as string);
          return chatDetails;
        })
      );

      // Filter out any null results
      const validChats = chats.filter(chat => chat !== null);

      return validChats;
    } catch (error) {
      console.error('Error fetching chats from KV:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (account) {
        const userChats = await getChatFromKV(account.address.toString());
        console.log('userChats', userChats);
        setChatHistory(userChats as any);
      }
    };

    fetchChats();
    //removeAllDataFromKV();
  }, [account]);

  const saveChatToKV = async (conversationList: any) => {
    try {
      const pipeline = kv.pipeline();
      pipeline.hmset(`chat:${chatId ? (chatId as string) : id}`, conversationList);
      pipeline.zadd(`user:chat:${account?.address.toString()}`, {
        score: Date.now(),
        member: `chat:${chatId ? (chatId as string) : id}`
      });
      await pipeline.exec();
      console.log(
        'Chat saved successfully with ID:',
        chatId ? (chatId as string) : id,
        'for user:',
        account?.address.toString()
      );
    } catch (error) {
      console.error('Error saving chat to KV:', error);
    }
  };

  useEffect(() => {
    if (conversationList.length > 0) {
      saveChatToKV(conversationList);
      if (!chatId) {
        if (conversationList.length > 1) {
          router.push(`/chat/${id}`);
        }
      }
    }
  }, [conversationList, chatId, id]);

  // Inside your ChatRoot component
  useEffect(() => {
    const fetchChatFromDatabase = async () => {
      if (chatId) {
        try {
          const chat = await kv.hgetall(`chat:${chatId}`);
          // console.log('chatId:', chatId);
          // console.log('chat:', chat);
          if (chat) {
            setConversationList(Object.values(chat as any));
          }
        } catch (error) {
          console.error('Error fetching chat from database:', error);
        }
      }
    };

    fetchChatFromDatabase();
  }, [chatId, account]);

  const HandlePromptItemClick = (itemId: string) => {
    router.push(`/chat/${itemId}`);
  };

  const handleNewChat = () => {
    router.push(`/chat/${id}`);
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const form = useForm<CreateToolFromContactFormData>({
    resolver: zodResolver(CreateToolFromContactFormSchema),
    mode: 'onChange',
    defaultValues: {
      address: '',
      packages: [],
      functions: [],
      modules: []
    }
  });

  const { control, setValue } = form;
  const selectedModules = useWatch({ control, name: 'modules' });

  const {
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = form;

  const loadSourceData = async (account: string, packages: string[], modules: string[], functions: string[]) => {
    const newFunctions = functions.filter(func => !sourceData[func]);
    if (newFunctions.length === 0) return;

    const newLoadingFunctions = newFunctions.reduce((acc, func) => ({ ...acc, [func]: true }), {});
    setLoadingFunctions(prev => ({ ...prev, ...newLoadingFunctions }));

    try {
      const responses = await Promise.all(
        newFunctions.map(async func => {
          const response = await axios.get('/api/source', {
            params: { account, package: packages.join(','), module: modules.join(','), functions: func }
          });
          setLoadingFunctions(prev => ({ ...prev, [func]: false }));
          return { func, data: response.data };
        })
      );

      const newSourceData = responses.reduce((acc: any, { func, data }) => {
        acc[func] = data?.returns.length > 0 ? data?.returns[0] : data;
        return acc;
      }, {});

      setSourceData(prev => ({ ...prev, ...newSourceData }));
    } catch (error) {
      console.error('Error fetching source data:', error);
      setLoadingFunctions(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    }
  };

  //console.log('sourceData', sourceData);

  const fetchModuleData = async (account: string) => {
    setIsLoadingPackages(true);
    try {
      const response = await axios.get(`/api/modules?account=${account}`);
      setModuleData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching module data:', error);
      return null;
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const fetchFunctions = async (account: string) => {
    setIsLoadingModules(true);
    try {
      const response = await axios.get(`/api/abis?account=${account}`);
      setFunctions(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching functions:', error);
      return null;
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleFetchModuleData = async () => {
    const accountAddress = form.getValues('address');
    if (accountAddress) {
      const moduleData = await fetchModuleData(accountAddress);
      const functionsData = await fetchFunctions(accountAddress);
      if (moduleData) {
        setModuleData(moduleData);
      }
      if (functionsData) {
        setFunctions(functionsData);
      }
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'address' && value.address) {
        handleFetchModuleData();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  //console.log('form', form.getValues());

  const handleCheckboxChange = (name: 'packages' | 'modules' | 'functions', value: string) => {
    const currentValues = form.getValues(name);
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    setValue(name, newValues, { shouldValidate: true });

    if (name === 'functions') {
      const { address, packages, modules } = form.getValues();
      loadSourceData(address, packages, modules, [value]); // Load data only for the newly selected function
    }
  };

  const uploadDataToApi = async (data: any) => {
    try {
      const response = await axios.post('/api/tools', data);
      console.log('Data uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  // Function to handle changes in the default value
  const handleDefaultValueChange = (funcName: string, paramName: string, newValue: string) => {
    setSourceData((prevData: any) => {
      const funcData = prevData[funcName] || {};
      const params = funcData.params || {};
      return {
        ...prevData,
        [funcName]: {
          ...funcData,
          params: {
            ...params,
            [paramName]: {
              ...params[paramName],
              default: newValue
            }
          }
        }
      };
    });
  };

  // Function to handle changes in the description
  const handleDescriptionChange = (funcName: string, paramName: string, newDescription: string) => {
    setSourceData((prevData: any) => {
      const funcData = prevData[funcName] || {};
      const params = funcData.params || {};
      return {
        ...prevData,
        [funcName]: {
          ...funcData,
          params: {
            ...params,
            [paramName]: {
              ...params[paramName],
              description: newDescription
            }
          }
        }
      };
    });
  };

  const handleTokenSelection = (funcName: string, paramName: string, tokenAddress: string) => {
    setSourceData((prevData: any) => ({
      ...prevData,
      [funcName]: {
        ...prevData[funcName],
        params: {
          ...prevData[funcName].params,
          [paramName]: {
            ...prevData[funcName].params[paramName],
            tokenAddress: tokenAddress
          }
        }
      }
    }));
  };

  const onSubmit = async () => {
    setIsOpenCreateTool(false);
    const selectedFunctions = form.getValues('functions');

    for (const funcName of selectedFunctions) {
      const toolData = {
        type: 'contractTool',
        name: `${form.getValues('packages')[0]}::${form.getValues('modules')[0]}::${funcName}`,
        tool: {
          name: `${form.getValues('packages')[0]}::${form.getValues('modules')[0]}::${funcName}`,
          description: sourceData[funcName].description,
          params: Object.entries(sourceData[funcName].params).reduce((acc: any, [key, value]: [string, any]) => {
            acc[key] = {
              type: value.type,
              description: value.description
            };
            return acc;
          }, {}),
          generic_type_params: sourceData[funcName].generic_type_params || [],
          return: sourceData[funcName].return || '',
          type: sourceData[funcName].type || '',
          functions: funcName,
          address: form.getValues('address')
        },
        user_id: account?.address.toString()
      };

      console.log('Uploading tool data:', toolData);
      await uploadDataToApi(toolData);
    }

    // Clear form data
    form.reset({
      address: '',
      packages: [],
      modules: [],
      functions: []
    });

    // Clear other state
    setModuleData(null);
    setFunctions(null);
    setSourceData({});
    setLoadingFunctions({});

    // Optionally, show a success message
    console.log('Tool created successfully!');
  };

  const fetchTools = useCallback(async () => {
    try {
      const userId = session?.user?.username || account?.address.toString();
      const response = await axios.get(`/api/tools?userId=${userId}`);
      const contractTools = response.data.filter((tool: any) => tool.type === 'contractTool');
      setTools(contractTools);
      //console.log('contractTools', contractTools);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  }, [account, session]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleToolSelection = (toolId: string) => {
    setSelectedTools(prev => (prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]));
  };

  const fetchCoinList = useCallback(async () => {
    try {
      const response = await axios.get(COIN_LIST_URL, {
        responseType: 'text'
      });
      const jsData = response.data;
      // eslint-disable-next-line no-eval
      const coinListArray = eval(jsData);

      //console.log('Parsed coin list:', coinListArray);
      setCoinList(coinListArray);
    } catch (error) {
      console.error('Error fetching or parsing coin list:', error);
      setCoinList([]);
    }
  }, []);

  useEffect(() => {
    fetchCoinList();
  }, [fetchCoinList]);

  const widgetForm = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const onchangeWidgetPrompt = (e: any) => {
    setWidgetPrompt(e.target.value);
  };

  const onchangeWidgetCode = (e: any) => {
    setWidgetCode(e.target.value);
  };

  const handleSaveWidget = async () => {
    try {
      const widgetData = {
        type: 'widgetTool',
        name: widgetForm.getValues('name'),
        tool: {
          name: widgetForm.getValues('name'),
          description: widgetForm.getValues('description'),
          prompt: widgetPrompt,
          code: widgetCode,
          tool_ids: selectedWidgetTools.join(',')
        },
        user_id: account?.address.toString() || session?.user?.username
      };

      const response = await axios.post('/api/tools', widgetData);
      console.log('Widget saved successfully:', response.data);

      // Clear form and related state
      widgetForm.reset();
      setWidgetPrompt('');
      setWidgetCode('');
      setSelectedWidgetTools([]);
      setPreviewWidgetCode('');

      // Close the modal
      setIsOpenCreateWidget(false);

      // Show success message
      toast({
        title: 'Widget created successfully!',
        description: 'Your widget has been created and saved.'
      });

      // Refresh the tools list
      fetchTools();
    } catch (error) {
      console.error('Error saving widget:', error);
      toast({
        title: 'Error creating widget',
        description: 'Please try again.'
      });
    }
  };

  const handlePreviewWidget = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      toast({
        title: 'Previewing widget...',
        description: 'Please wait while we generate the preview.'
      });
      const data = {
        prompt: widgetPrompt,
        tool_ids: selectedWidgetTools
      };

      const response = await axios.post('/api/create-widget', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const code = response.data.code;
      setPreviewWidgetCode(code);
      setWidgetCode(code);
      toast({
        title: 'Widget previewed successfully!',
        description: 'Your widget has been previewed successfully.'
      });
      console.log('Previewing widget', response.data);
    } catch (error) {
      console.error('Error previewing widget:', error);
      toast({
        title: 'Error previewing widget',
        description: 'Please try again.'
      });
    }
  };

  const isFormValid = useCallback(() => {
    const { address, packages, modules, functions } = form.getValues();
    return isValid && address && packages.length > 0 && modules.length > 0 && functions.length > 0;
  }, [form, isValid]);

  //console.log('tools', selectedWidgetTools);

  return (
    <>
      <div className={classNames('flex w-full grow flex-col overflow-hidden py-4', className)}>
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
              <Link href="/widget" className="flex h-8 items-center justify-center gap-2">
                <Image
                  src={EditIcon.src}
                  alt="Back Icon"
                  className="h-full w-full object-contain"
                  width={EditIcon.width}
                  height={EditIcon.height}
                />
                <span className="text-nowrap">Widget</span>
              </Link>
              <Link href="/tools" className="flex h-8 items-center justify-center gap-2">
                <Image
                  src={EditIcon.src}
                  alt="Back Icon"
                  className="h-full w-full object-contain"
                  width={EditIcon.width}
                  height={EditIcon.height}
                />
                <span className="text-nowrap">Tools</span>
              </Link>
              <Link href="/agent" className="flex h-8 items-center justify-center gap-2">
                <Image
                  src={EditIcon.src}
                  alt="Back Icon"
                  className="h-full w-full object-contain"
                  width={EditIcon.width}
                  height={EditIcon.height}
                />
                <span className="text-nowrap">Agent</span>
              </Link>

              <button className="flex h-8 items-center justify-center gap-2" onClick={handleNewChat}>
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
            <div className="flex grow overflow-hidden rounded-b-3xl">
              <div className="item flex h-full min-w-80 shrink-0 flex-col overflow-hidden border-r-2 border-[#292F36]">
                <div className="flex shrink-0 items-center gap-6 border-b-2 border-[#292F36] px-7 py-6 font-semibold">
                  <p>AI chat</p>
                  <DropdownSelect
                    initialValue={selectedOption.id}
                    options={aiDropdownOptionList}
                    onSelect={handleSelectAi}
                  />
                </div>
                <div className="scrollbar flex grow flex-col overflow-auto">
                  {chatHistory.map((item: any, idx: number) => (
                    <ChatPromptList
                      key={idx}
                      title={item[0].message}
                      items={item}
                      onItemClick={HandlePromptItemClick}
                    />
                  ))}
                </div>
              </div>
              <div className="flex grow flex-col gap-6 overflow-hidden p-8">
                <p className="shrink-0 text-center capitalize text-gray-500">{selectedOption.name}</p>

                <ChatArea
                  conversationList={conversationList}
                  messagesEndRef={messagesEndRef}
                  userAddress={account?.address.toString() as string}
                />

                <div className="gird-cols-2 grid shrink-0 gap-5 md:grid-cols-4">
                  <div
                    data-augmented-ui
                    className={classNames(
                      'border-none outline-none',
                      'aug-tl1-2 aug-clip-tl',
                      'aug-border-bg-secondary aug-border aug-border-2 bg-[#2C3035] p-3',
                      'aug-round-r1 aug-round-bl1 aug-tr1-8 aug-br1-8 aug-bl1-8 p-4',
                      'flex cursor-pointer flex-col gap-2'
                    )}
                    onClick={() => setIsOpenSelectTool(true)}
                  >
                    <p className="text=[#6B7280]">{'Select tool'}</p>
                    <p className="text-[#9CA3AF]">{'For APT'}</p>
                  </div>
                  <div
                    data-augmented-ui
                    className={classNames(
                      'border-none outline-none',
                      'aug-tl1-2 aug-clip-tl',
                      'aug-border-bg-secondary aug-border aug-border-2 bg-[#2C3035] p-3',
                      'aug-round-r1 aug-round-bl1 aug-tr1-8 aug-br1-8 aug-bl1-8 p-4',
                      'flex cursor-pointer flex-col gap-2'
                    )}
                    onClick={() => setIsOpenCreateTool(true)}
                  >
                    <p className="text=[#6B7280]">{'Create tool'}</p>
                    <p className="text-[#9CA3AF]">{'For APT'}</p>
                  </div>
                  <div
                    data-augmented-ui
                    className={classNames(
                      'border-none outline-none',
                      'aug-tl1-2 aug-clip-tl',
                      'aug-border-bg-secondary aug-border aug-border-2 bg-[#2C3035] p-3',
                      'aug-round-r1 aug-round-bl1 aug-tr1-8 aug-br1-8 aug-bl1-8 p-4',
                      'flex cursor-pointer flex-col gap-2'
                    )}
                    onClick={() => setIsOpenCreateWidget(true)}
                  >
                    <p className="text=[#6B7280]">{'Create widget'}</p>
                    <p className="text-[#9CA3AF]">{'For APT'}</p>
                  </div>
                  <div
                    data-augmented-ui
                    className={classNames(
                      'border-none outline-none',
                      'aug-tl1-2 aug-clip-tl',
                      'aug-border-bg-secondary aug-border aug-border-2 bg-[#2C3035] p-3',
                      'aug-round-r1 aug-round-bl1 aug-tr1-8 aug-br1-8 aug-bl1-8 p-4',
                      'flex cursor-pointer flex-col gap-2'
                    )}
                    onClick={() => { }}
                  >
                    <p className="text=[#6B7280]">{'Select widget'}</p>
                    <p className="text-[#9CA3AF]">{'For APT'}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <ChatPromptTextarea placeholder={selectedOption.message} onSend={handleSend} />
                </div>
              </div>
            </div>
          </BoderImage>
        </div>
      </div>
      <AugmentedPopup visible={isOpenCreateTool} onClose={handleClose} textHeading={'Create Tool from contact'}>
        <form className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto p-8">
          <FormTextField error={errors.address} form={form} label="Contract address" name="address" isValid={isValid} />

          <div className="mb-4">
            <p className="mb-2 text-xl text-white">Packages</p>
            <select
              className="max-h-40 w-full overflow-y-auto rounded border border-gray-700 bg-transparent p-2 text-white"
              value={form.getValues('packages')}
              onChange={e => {
                const selectedOption = e.target.value;
                setValue('packages', [selectedOption], { shouldValidate: true });
              }}
            >
              {isLoadingPackages ? (
                <option value="" disabled className="text-[#6B7280]">
                  Loading packages...
                </option>
              ) : moduleData && moduleData.length > 0 ? (
                <>
                  <option value="" disabled className="text-[#6B7280]">
                    Choose package
                  </option>
                  {moduleData.map((item: any, idx: number) => (
                    <option key={idx} value={item.name} className="text-[#6B7280]">
                      {item.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="" disabled className="text-[#6B7280]">
                  No packages available
                </option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xl text-white">Modules</p>
            <select
              className="max-h-40 w-full overflow-y-auto rounded border border-gray-700 bg-transparent p-2 text-white"
              value={form.getValues('modules')}
              onChange={e => {
                const selectedOption = e.target.value;
                setValue('modules', [selectedOption], { shouldValidate: true });
              }}
            >
              {isLoadingModules ? (
                <option value="" disabled className="text-[#6B7280]">
                  Loading modules...
                </option>
              ) : functions && functions.length > 0 ? (
                <>
                  <option value="" disabled className="text-[#6B7280]">
                    Choose module
                  </option>
                  {functions.map((item: any, idx: number) => (
                    <option key={idx} value={item.name} className="text-[#6B7280]">
                      {item.name}
                    </option>
                  ))}
                </>
              ) : (
                <option value="" disabled className="text-[#6B7280]">
                  No modules available
                </option>
              )}
            </select>
          </div>

          {functions && selectedModules && selectedModules?.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xl text-white">Functions</p>
              <div className="flex flex-col gap-3">
                {functions
                  .filter((item: any) => selectedModules.includes(item.name))
                  .flatMap((item: any) =>
                    item.exposed_functions.map((func: any) => (
                      <div key={`${item.name}-${func.name}`}>
                        <label className="mb-2 flex items-center text-[#6B7280]">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={form.getValues('functions').includes(func.name)}
                            onChange={() => handleCheckboxChange('functions', func.name)}
                          />
                          {func.name}
                        </label>
                        {form.getValues('functions').includes(func.name) && (
                          <div className="ml-6 mt-2">
                            {loadingFunctions[func.name] ? (
                              <div className="flex items-center gap-2">
                                <p>Loading source data for {func.name}...</p>
                              </div>
                            ) : sourceData[func.name] ? (
                              <div className="flex flex-col gap-2">
                                {Object.entries(sourceData[func.name].params).map(
                                  ([paramName, paramData]: [string, any]) => (
                                    <div key={paramName} className="flex flex-col gap-2">
                                      <p className="capitalize text-white">{paramName}</p>
                                      <textarea
                                        className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white placeholder:lowercase"
                                        value={paramData.description}
                                        onChange={e => handleDescriptionChange(func.name, paramName, e.target.value)}
                                        rows={2}
                                      />
                                      <input
                                        type="text"
                                        className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white placeholder:lowercase"
                                        value={paramData.default || ''}
                                        onChange={e => handleDefaultValueChange(func.name, paramName, e.target.value)}
                                        placeholder={`Default value`}
                                      />
                                      {func.generic_type_params && func.generic_type_params.length > 0 && (
                                        <div className="mt-2">
                                          <p className="mb-1 text-white">Select Token:</p>
                                          <select
                                            className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
                                            onChange={e => handleTokenSelection(func.name, paramName, e.target.value)}
                                          >
                                            <option value="">Select a token</option>
                                            {coinList.map((coin: any) => (
                                              <option key={coin.address} value={coin.address}>
                                                {coin.symbol}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p>Please select a function {func.name} again</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            disabled={!isFormValid()}
            className={`${!isFormValid() ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Create
          </Button>
        </form>
      </AugmentedPopup>
      <AugmentedPopup
        visible={isOpenSelectTool}
        onClose={handleCloseSelectTool}
        textHeading={'Tools'}
        className="min-w-full md:min-w-[700px]"
      >
        <div className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto p-8">
          <p className="mb-5 text-white">Select what external tools your agents have access to.</p>
          {tools?.map(tool => (
            <div
              key={tool.id}
              className="mb-4 flex items-center justify-between gap-5 rounded-lg border border-gray-100 p-4 text-xs"
            >
              <div className="flex flex-row items-center gap-2">
                <img src="/openai-white.png" alt="OpenAI" className="h-10 w-10" />
                <div className="flex flex-col gap-1">
                  <label className="text-white">{tool.name}</label>
                  <small className="text-[#c5cee2]">{tool.tool.description.slice(0, 100) + '...'}</small>
                </div>
              </div>
              <Switch
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-white"
                checked={selectedTools.includes(tool.name)}
                onCheckedChange={() => handleToolSelection(tool.name)}
              />
            </div>
          ))}
          <Button
            onClick={() => {
              console.log('Selected tools:', selectedTools);
              handleCloseSelectTool();
            }}
          >
            Close
          </Button>
        </div>
      </AugmentedPopup>
      <AugmentedPopup
        visible={isOpenCreateWidget}
        onClose={() => setIsOpenCreateWidget(false)}
        textHeading={'Create Widget'}
      >
        <form className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-8">
          <FormTextField form={widgetForm} name="name" label="Name" />
          <FormTextField form={widgetForm} name="description" label="Description" />
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Select Tools</label>
            <MultiSelectTools
              tools={tools || []}
              selectedTools={selectedWidgetTools}
              onChangeSelectedTools={setSelectedWidgetTools}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Prompt</label>
            <Textarea value={widgetPrompt} onChange={onchangeWidgetPrompt} className="min-h-[100px]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Code</label>
            <Textarea value={widgetCode} onChange={onchangeWidgetCode} className="font-mono min-h-[150px]" />
          </div>
          {previewWidgetCode && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-white">Preview</label>
              <ViewFrame code={previewWidgetCode} />
            </div>
          )}
          <div className="flex justify-end gap-4">
            <Button onClick={handlePreviewWidget} type="button">
              Preview
            </Button>
            <Button onClick={handleSaveWidget} type="button">
              Save
            </Button>
          </div>
        </form>
      </AugmentedPopup>
    </>
  );
};

export default ChatRoot;
