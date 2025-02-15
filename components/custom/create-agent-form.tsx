import { Check, List, Plus, PlusCircle, Server, Trash2, Upload, X, ChevronsUpDown } from "lucide-react";
import Form from "next/form"
import { useEffect, useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import ActionCard from "./suggest-action/action-card";
import CreateActionModal from "./suggest-action/create-action-modal";
import { ToolCard } from "./tool-selector/tool-card";
import { ToolSelectorModal } from "./tool-selector/tool-selector-modal";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "../utils/tool.util";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { models as defaultModels, Model } from '../../ai/models'; // Import default models

interface Tool {
  id: string
  name: string
  description: string
  isFavorite: boolean
  avatar?: string
}
interface SuggestedAction {
  id: string
  title: string
  label: string
  action: string
}

interface CreateAgentFormProps {
  action: any;
  children: React.ReactNode;
  agent?: {
    id: string;
    name: string;
    description: string;
    prompt: string;
    intro: string;
    model: string;
    avatar?: string;
    tools: string[];
    suggestedActions: SuggestedAction[];
  };
}

export function CreateAgentForm({
  agent,
  action,
  children,
}: CreateAgentFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [actions, setActions] = useState<SuggestedAction[]>(agent?.suggestedActions || [])
  const [actionsValue, setActionsValue] = useState<string>(agent ? JSON.stringify(agent.suggestedActions) : '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(agent?.avatar || null);
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [visibleTools, setVisibleTools] = useState<Tool[] | null>(null);
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string>(agent?.model || '');
  const [visibleTotalPages, setVisibleTotalPages] = useState(1);
  const [models, setModels] = useState<{ id: string; apiIdentifier: string; modelName: string }[]>([]);

  const limit = 10; // Number of tools per page
  const [query, setQuery] = useState('');

  const [open, setOpen] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [prompt, setPrompt] = useState("")
  const [intro, setIntro] = useState("")

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      const combinedModels = [...defaultModels, ...data.models];
      setModels(combinedModels);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const fetchTools = async (page = 1, limit = 10, query = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tool?page=${page}&limit=${limit}&query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      setTools(data.tools);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVisibleTools = async (page = 1, limit = 10, query = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tool/all?page=${page}&limit=${limit}&query=${query}`);
      if (!response.ok) {
        throw new Error('Failed to fetch visible tools');
      }
      const data = await response.json();
      setVisibleTools(data.tools);
      setVisibleTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch visible tools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools(currentPage, limit, query);
  }, [currentPage, limit, query]);

  useEffect(() => {
    fetchVisibleTools(currentPage, limit, query);
  }, [currentPage, limit, query]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleVisiblePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVisibleTools(page);
  };

  const [selectedToolsInput, setSelectedToolsInput] = useState<string>(agent ? JSON.stringify(agent.tools) : '')

  const [isModalToolOpen, setIsModalToolOpen] = useState(false)
  const [isModalActionOpen, setIsModalActionOpen] = useState(false)

  const handleToolsSelect = (tools: Tool[]) => {
    const ids = tools.map(item => item.id);
    setSelectedToolsInput(JSON.stringify(ids));
    setSelectedTools(tools)
  }

  const handleToolRemove = (toolId: string) => {
    setSelectedTools((prev) => prev.filter((tool) => tool.id !== toolId))
  }

  const handleCreateAction = (newAction: Omit<SuggestedAction, 'id'>) => {
    const actionWithId = {
      ...newAction,
      id: Date.now().toString() // Simple ID generation
    }
    setActions([...actions, actionWithId])
    setActionsValue(JSON.stringify([...actions, actionWithId]))
    setIsModalActionOpen(false)
  }

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter(action => action.id !== id))
  }

  const deleteAllActions = () => {
    setActions([])
    setActionsValue('')
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      //setAgent((prev) => ({ ...prev, avatar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // Update the useEffect to include name and description
  useEffect(() => {
    if (agent) {
      setName(agent.name)
      setDescription(agent.description)
      setPrompt(agent.prompt)
      setIntro(agent.intro)
      setSelectedModel(agent.model)
    }
  }
    , [agent])

  return (
    <Card className='border-0'>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{agent ? 'Update Agent' : 'Create an Agent'}</CardTitle>
        <CardDescription>
          {agent ? 'Modify Your Agent' : 'Design Your Agent'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">

        <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16" >
          {agent && (
            <Input
              id="id"
              name="id"
              type="hidden"
              defaultValue={agent.id}
            />
          )}
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center space-x-4">

              <Avatar className="size-20 cursor-pointer" onClick={handleAvatarClick}>
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Agent avatar" />
                ) : (
                  <AvatarFallback>
                    <Upload className="size-8 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                ref={fileInputRef}
              />
              <Button type="button" variant="outline" onClick={handleAvatarClick}>
                {agent?.avatar ? 'Change Avatar' : 'Upload Avatar'}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Agent Name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the agent's capabilities"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Enter the agent's initial prompt"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt} required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Intro</Label>
            <Input
              id="intro"
              name="intro"
              type="text"
              placeholder="Enter the agent's initial intro"
              onChange={(e) => setIntro(e.target.value)}
              value={intro}
              required
            />
          </div>

          <div className="space-y-2">

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {selectedModel
                    ? models.find((model) => model.apiIdentifier === selectedModel)?.modelName
                    : "Select model..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">

                <Command>
                  <CommandInput
                    placeholder="Search model..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {models.map((model, i) => (
                        <CommandItem
                          value={model.id}
                          key={i}
                          onSelect={(value) => {
                            setSelectedModel(value)
                          }}
                        >
                          {model.modelName}
                          <Check
                            className={cn(
                              "ml-auto",
                              model.apiIdentifier === selectedModel
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>


          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Button onClick={(e) => { e.preventDefault(); setIsModalToolOpen(true) }}>Add Tools</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSelected={true}
                  onSelect={() => handleToolRemove(tool.id)}
                />
              ))}
            </div>
            <ToolSelectorModal
              isOpen={isModalToolOpen}
              onClose={() => setIsModalToolOpen(false)}
              onToolsSelect={handleToolsSelect}
              selectedTools={selectedTools}
              tools={tools as any}
              visibleTools={visibleTools as any}
              currentPage={currentPage}
              totalPages={totalPages}
              visibleTotalPages={visibleTotalPages}
              onPageChange={handlePageChange}
              onVisiblePageChange={handleVisiblePageChange}
              isLoading={isLoading}
              isVisibleLoading={isLoading}
              query={query}
              setQuery={setQuery}
            />

          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Button onClick={(e) => { e.preventDefault(); setIsModalActionOpen(true) }} >
                  <Plus className="mr-2 size-4" /> Create Suggested Action
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {actions.map((action) => (
                  <ActionCard key={action.id} action={action} onRemove={handleRemoveAction} />
                ))}
                <CreateActionModal
                  isOpen={isModalActionOpen}
                  onClose={() => setIsModalActionOpen(false)}
                  onCreateAction={handleCreateAction}
                />
              </div>
            </div>
            <Input
              name="tools"
              className="hidden"
              type="text"
              defaultValue={selectedToolsInput}
            />
            <Input
              name="suggestedActions"
              className="hidden"
              type="text"
              defaultValue={actionsValue}
            />
            <Input
              id="model"
              name="model"
              className="hidden"
              type="text"
              defaultValue={selectedModel}

            />
          </div>
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
