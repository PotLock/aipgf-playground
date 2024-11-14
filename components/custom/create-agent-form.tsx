import { List, Server } from "lucide-react";
import Form from 'next/form';
import { useState } from "react";

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';

import { ChatHeader } from "./chat-header";
import { MultiSelect } from '../custom/multi-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectItem, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';


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

  const selectedModelId = "a"
  return (
    <>
      <ChatHeader selectedModelId={selectedModelId} />


      <Card>
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
                className="bg-muted text-md md:text-sm hidden"
                type="text"
                placeholder="Super Agent"
                autoComplete="text"
                required
                autoFocus
                defaultValue={selectedFrameworks}
              />
            </div>
            {children}
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
