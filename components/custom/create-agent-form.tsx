import { List, PlusCircle, Server, Trash2, X } from "lucide-react";
import Form from 'next/form';
import { useState } from "react";

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';

import { MultiSelect } from '../custom/multi-select';
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

  const frameworksList = [
    { value: "tool1", label: "Tool 1", icon: List },
    { value: "tool2", label: "Tool 2", icon: Server },
  ];


  const [actions, setActions] = useState<SuggestedActions[]>([])
  const [newAction, setNewAction] = useState<Omit<SuggestedActions, "id">>({ label: "", action: "", title: "" })

  const addAction = () => {
    if (newAction.label && newAction.action && newAction.title) {
      setActions([...actions, { ...newAction, id: Date.now() }])
      setNewAction({ label: "", action: "", title: "" })
    }
  }

  const removeAction = (id: number) => {
    setActions(actions.filter(item => item.id !== id))
  }

  const deleteAllActions = () => {
    setActions([])
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
        <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Avatar
            </Label>

            <Input
              id="avatar"
              name="avatar"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Avatar"
              autoComplete="text"
              required
              autoFocus
              defaultValue={'/Logo.svg'}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Name Agent
            </Label>

            <Input
              id="name"
              name="name"
              className="bg-muted text-md md:text-sm"
              type="text"
              placeholder="Super Agent"
              autoComplete="text"
              required
              autoFocus
              defaultValue={''}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              className="bg-muted text-md md:text-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Intro
            </Label>

            <Input
              id="intro"
              name="intro"
              className="bg-muted text-md md:text-sm"
              type="text"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Model
            </Label>
            <Select name="model">
              <SelectTrigger className="w-[180px]">
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
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
              Prompt
            </Label>

            <Textarea
              id="prompt"
              name="prompt"
              className="bg-muted text-md md:text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text"
              className="text-zinc-600 font-normal dark:text-zinc-400"
            >
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
          {/* create suggestedActions */}
          <div className="flex flex-col gap-2">
            <Card className="w-full  mx-auto">
              <CardHeader>
                <CardTitle>Suggested Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAction.title}
                        onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                        placeholder="Enter title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={newAction.label}
                        onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
                        placeholder="Enter label"
                      />
                    </div>
                    <div>
                      <Label htmlFor="action">Action</Label>
                      <Input
                        id="action"
                        value={newAction.action}
                        onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                        placeholder="Enter action"
                      />
                    </div>
                  </div>
                  <Button onClick={(e) => { e.preventDefault(); addAction(); }} className="w-full">
                    <PlusCircle className="mr-2 size-4" /> Add Item
                  </Button>
                </div>
                <div className="mt-6 space-y-2">
                  {actions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <div className="grow mr-2">
                        <span className="font-semibold">{item.label}</span> -
                        <span className="text-muted-foreground"> {item.action}</span> -
                        <span className="italic">{item.title}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAction(item.id)}
                        aria-label={`Remove ${item.label}`}
                      >
                        <X className="size-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={deleteAllActions} className="w-full">
                  <Trash2 className="mr-2 size-4" /> Delete All Actions
                </Button>
              </CardFooter>
            </Card>
            <Input
              id="suggestedActions"
              name="suggestedActions"
              hidden
              className="hidden"
              type="text"
              defaultValue={JSON.stringify(actions)}
            />
          </div>
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
