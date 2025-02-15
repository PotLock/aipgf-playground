'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import Form from 'next/form';

interface CreateProviderFormProps {
  action: (formData: FormData) => void;
  model?: {
    id?: string;
    modelName: string;
    apiIdentifier: string;
    apiToken: string;
  };
  children?: React.ReactNode;
}

export function CreateProviderForm({ action, model, children }: CreateProviderFormProps) {
  const [id, setId] = useState(model?.id || '');
  const [modelName, setModelName] = useState(model?.modelName || '');
  const [apiIdentifier, setApiIdentifier] = useState(model?.apiIdentifier || '');
  const [apiToken, setApiToken] = useState(model?.apiToken || '');

  return (
    <Card className="border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{model ? 'Update Provider' : 'Create a Provider'}</CardTitle>
        <CardDescription>{model ? 'Update the details for the provider' : 'Enter the details for the new provider'}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
          {id && <Input type="hidden" name="id" value={id} />}
          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name</Label>
            <Input
              id="modelName"
              name="modelName"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
              placeholder="Enter model name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpoint">Api Identifier</Label>
            <Input
              id="apiIdentifier"
              name="apiIdentifier"
              type="url"
              value={apiIdentifier}
              onChange={(e) => setApiIdentifier(e.target.value)}
              required
              placeholder="Enter endpoint URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiToken">API Token</Label>
            <Textarea
              id="apiToken"
              name="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              required
              placeholder="Enter API token"
            />
          </div>
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}