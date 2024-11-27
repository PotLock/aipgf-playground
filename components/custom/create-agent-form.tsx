import { List, Plus, PlusCircle, Server, Trash2, Upload, X } from "lucide-react";
import Form from 'next/form';
import { useRef, useState } from "react";

import { models } from '@/ai/models';

import { MultiSelect } from '../custom/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectItem, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import ActionCard from "./suggest-action/action-card";
import CreateActionModal from "./suggest-action/create-action-modal";
import { ToolCard } from "./tool-selector/tool-card";
import { ToolSelectorModal } from "./tool-selector/tool-selector-modal";



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

export function CreateAgentForm({
  action,
  children,
  tools
}: {
  action: any;
  children: React.ReactNode;
  tools: any

}) {
  const fileInputRef = useRef<HTMLInputElement>(null)



  const [actions, setActions] = useState<SuggestedAction[]>([])
  const [actionsValue, setActionsValue] = useState<string>('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedTools, setSelectedTools] = useState<Tool[]>([])
  const [selectedToolsInput, setSelectedToolsInput] = useState<string>('')

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

  return (
    <Card >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an Agent</CardTitle>
        <CardDescription>
          Design Your Agent
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">

        <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16" >
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
                Upload Avatar
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={''} placeholder="Agent Name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the agent's capabilities"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="Enter the agent's initial prompt"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Intro</Label>
            <Input
              id="intro"
              name="intro"
              type="text"
              placeholder="Enter the agent's initial intro"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="text"
            >
              Model
            </Label>
            <Select name="model">
              <SelectTrigger >
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {models.map((model, index) => (
                    <SelectItem value={model.apiIdentifier} key={index}>{model.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="text"            >
              Tool
            </Label>
            <div className="flex items-center space-x-2">
              <Button onClick={(e) => { e.preventDefault(); setIsModalToolOpen(true) }}>Add Tools</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isSelected={true}
                  onRemove={() => handleToolRemove(tool.id)}
                  showSwitch={false}
                />
              ))}
            </div>
            <ToolSelectorModal
              isOpen={isModalToolOpen}
              onClose={() => setIsModalToolOpen(false)}
              onToolsSelect={handleToolsSelect}
              selectedTools={selectedTools}
              tools={tools}
            />
            <Input
              id="tool"
              name="tool"
              hidden
              className="hidden"
              type="text"
              required
              defaultValue={selectedToolsInput}
            />
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>Suggested Actions</Label>
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
              name="suggestedActions"
              className="hidden"
              type="text"
              required
              defaultValue={actionsValue}
            />
          </div>
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
