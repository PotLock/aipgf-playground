import { List, PlusCircle, Server, Trash2, Upload, X } from "lucide-react";
import Form from 'next/form';
import { useRef, useState } from "react";

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';
import { agent } from "@/db/schema";

import { MultiSelect } from '../custom/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectItem, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';



interface SuggestedActions {
  id: number
  label: string
  action: string
  title: string
}
export function CreateAgentForm({
  action,
  children
}: {
  action: any;
  children: React.ReactNode;
}) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const frameworksList = [
    { value: "tool1", label: "Tool 1", icon: List },
    { value: "tool2", label: "Tool 2", icon: Server },
  ];


  const [actions, setActions] = useState<SuggestedActions[]>([])
  const [actionsValue, setActionsValue] = useState<string>('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [newAction, setNewAction] = useState<Omit<SuggestedActions, "id">>({ label: "", action: "", title: "" })

  const addAction = () => {
    if (newAction.label && newAction.action && newAction.title) {
      setActions([...actions, { ...newAction, id: Date.now() }])
      setNewAction({ label: "", action: "", title: "" })
      setActionsValue(JSON.stringify([...actions, { ...newAction, id: Date.now() }]))
    }
  }

  const removeAction = (id: number) => {
    setActions(actions.filter(item => item.id !== id))
    setActionsValue(JSON.stringify(actions.filter(item => item.id !== id)))
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
            <MultiSelect
              options={frameworksList}
              onValueChange={setSelectedFrameworks}
              defaultValue={selectedFrameworks}
              placeholder="Select tools"
              variant="inverted"
              animation={0}
              maxCount={3}
            />
            <Input
              id="tool"
              name="tool"
              hidden
              className="hidden"
              type="text"
              defaultValue={selectedFrameworks}
            />
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label>Suggested Actions</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  id="title"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Enter title"
                />
                <Input
                  id="label"
                  value={newAction.label}
                  onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
                  placeholder="Enter label"
                />
                <Input
                  id="action"
                  value={newAction.action}
                  onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                  placeholder="Enter action"
                />
              </div>
            </div>
            <Button type="button" onClick={(e) => { e.preventDefault(); addAction(); }} className="mt-2">
              Add Suggested Action
            </Button>

            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              {actions.map((item, index) => (
                <Card key={index} className="bg-secondary">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.label}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">{item.action}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                      Try it
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeAction(item.id)}
                    >
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <Input
              name="suggestedActions"
              className="hidden"
              type="text"
              defaultValue={actionsValue}
            />
          </div>
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
