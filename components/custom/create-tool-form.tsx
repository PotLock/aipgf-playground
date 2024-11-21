import { List, Plus, PlusCircle, Server, Trash2, Upload, X, LayoutDashboard } from "lucide-react";
import { FileCode2, Webhook } from 'lucide-react'
import Form from 'next/form';
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { DEFAULT_MODEL_NAME, models } from '@/ai/models';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tool } from "@/db/schema";

import { MultiSelect } from './multi-select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';




export function CreateToolForm({
  action,
  children
}: {
  action: any;
  children: React.ReactNode;
}) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [widgetArgs, setWidgetArgs] = useState([{ name: '', description: '', type: '' }])
  const [avatar, setAvatar] = useState<string | null>(null)

  // Smart Contract Form state
  const [chain, setChain] = useState('')
  const [network, setNetwork] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [contractMethods, setContractMethods] = useState<any[]>([])
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [data, setData] = useState<string>()
  const [widgetCode, setWidgetCode] = useState('')


  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // API Form state
  const [apiTitle, setApiTitle] = useState('')
  const [apiVersion, setApiVersion] = useState('')
  const [apiDescription, setApiDescription] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiPaths, setApiPaths] = useState([{
    path: '',
    method: 'get',
    summary: '',
    description: '',
    parameters: [{ name: '', in: 'query', description: '', required: false, type: 'string' }]
  }])
  const [apiSpecFile, setApiSpecFile] = useState<File | null>(null)

  const options = [
    { value: 'widget', label: 'Widget', icon: LayoutDashboard },
    { value: 'smartcontract', label: 'Smart Contract', icon: FileCode2 },
    { value: 'api', label: 'API', icon: Webhook },
  ]

  const addApiPath = () => {
    setApiPaths([...apiPaths, {
      path: '',
      method: 'get',
      summary: '',
      description: '',
      parameters: [{ name: '', in: 'query', description: '', required: false, type: 'string' }]
    }])
  }

  const removeApiPath = (index: number) => {
    setApiPaths(apiPaths.filter((_, i) => i !== index))
  }

  const updateApiPath = (index: number, field: string, value: string) => {
    const newPaths = [...apiPaths]
    newPaths[index] = { ...newPaths[index], [field]: value }
    setApiPaths(newPaths)
  }

  const addApiParameter = (pathIndex: number) => {
    const newPaths = [...apiPaths]
    newPaths[pathIndex].parameters.push({ name: '', in: 'query', description: '', required: false, type: 'string' })
    setApiPaths(newPaths)
  }

  const removeApiParameter = (pathIndex: number, paramIndex: number) => {
    const newPaths = [...apiPaths]
    newPaths[pathIndex].parameters = newPaths[pathIndex].parameters.filter((_, i) => i !== paramIndex)
    setApiPaths(newPaths)
  }

  const updateApiParameter = (pathIndex: number, paramIndex: number, field: string, value: string | boolean) => {
    const newPaths = [...apiPaths]
    newPaths[pathIndex].parameters[paramIndex] = {
      ...newPaths[pathIndex].parameters[paramIndex],
      [field]: value
    }
    setApiPaths(newPaths)
  }

  const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']
  const parameterLocations = ['query', 'path', 'header', 'cookie']
  const parameterTypes = ['string', 'number', 'integer', 'boolean', 'array', 'object']


  const handleApiSpecFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setApiSpecFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string)
          setApiTitle(json.info?.title || '')
          setApiVersion(json.info?.version || '')
          setApiDescription(json.info?.description || '')
          setApiEndpoint(json.servers?.[0]?.url || '')
          // Parse paths
          const paths = Object.entries(json.paths || {}).map(([path, methods]: [string, any]) => {
            const method = Object.keys(methods)[0]
            const methodDetails = methods[method]
            return {
              path,
              method,
              summary: methodDetails.summary || '',
              description: methodDetails.description || '',
              parameters: methodDetails.parameters || []
            }
          })
          setApiPaths(paths)
        } catch (error) {
          console.error('Error parsing JSON:', error)
          alert('Error parsing JSON file. Please make sure it\'s a valid OpenAPI v3 specification.')
        }
      }
      reader.readAsText(file)
    }
  }
  const fetchContractMethods = async (address: string) => {
    // In a real scenario, this would make an API call to fetch the contract ABI
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return [
      { name: 'transfer', args: [{ name: 'to', type: 'address', description: 'Recipient address' }, { name: 'amount', type: 'uint256', description: 'Amount to transfer' }] },
      { name: 'balanceOf', args: [{ name: 'account', type: 'address', description: 'Account to check balance' }] },
      { name: 'approve', args: [{ name: 'spender', type: 'address', description: 'Spender address' }, { name: 'amount', type: 'uint256', description: 'Amount to approve' }] },
    ];
  };

  useEffect(() => {
    if (contractAddress) {
      fetchContractMethods(contractAddress).then(methods => {
        setContractMethods(methods);
      });
    }
  }, [contractAddress]);

  useEffect(() => {
    const data = {
      code: widgetCode, // Updated to use widgetCode
      args: widgetArgs
    }
    setData(JSON.stringify(data))
  }, [widgetCode, widgetArgs])

  const chains = ['Ethereum', 'Binance Smart Chain', 'Polygon', 'Avalanche']
  const networks = ['Mainnet', 'Testnet']

  const addWidgetArg = () => {
    setWidgetArgs([...widgetArgs, { name: '', description: '', type: '' }])
  }

  const removeWidgetArg = (index: number) => {
    setWidgetArgs(widgetArgs.filter((_, i) => i !== index))
  }

  const updateWidgetArg = (index: number, field: string, value: string) => {
    const newArgs = [...widgetArgs]
    newArgs[index] = { ...newArgs[index], [field]: value }
    setWidgetArgs(newArgs)
  }
  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleMethodSelection = (methodName: string) => {
    setSelectedMethods(prev =>
      prev.includes(methodName)
        ? prev.filter(name => name !== methodName)
        : [...prev, methodName]
    )
  }
  const renderForm = () => {
    switch (selectedForm) {
      case 'widget':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Widget Form</h3>

            <div>
              <Label htmlFor="widget-template">Template</Label>
              <Textarea
                id="widget-code"
                name="widget-code"
                value={widgetCode}
                onChange={(e) => setWidgetCode(e.target.value)}
                placeholder="Enter Template Code" />
            </div>
            <div className="space-y-4">
              <Label>Widget Arguments</Label>
              {widgetArgs.map((arg, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Argument {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWidgetArg(index)}
                        aria-label={`Remove argument ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`arg-name-${index}`}>Name</Label>
                      <Input
                        id={`arg-name-${index}`}
                        value={arg.name}
                        onChange={(e) => updateWidgetArg(index, 'name', e.target.value)}
                        placeholder="Enter argument name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`arg-description-${index}`}>Description</Label>
                      <Input
                        id={`arg-description-${index}`}
                        value={arg.description}
                        onChange={(e) => updateWidgetArg(index, 'description', e.target.value)}
                        placeholder="Enter argument description"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`arg-type-${index}`}>Type</Label>
                      <Select
                        value={arg.type}
                        onValueChange={(value) => updateWidgetArg(index, 'type', value)}
                      >
                        <SelectTrigger id={`arg-type-${index}`}>
                          <SelectValue placeholder="Select argument type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                          <SelectItem value="object">Object</SelectItem>
                          <SelectItem value="array">Array</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={addWidgetArg} className="w-full">
                <Plus className="mr-2 size-4" /> Add Argument
              </Button>
            </div>
          </div>
        )
      case 'smartcontract':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Smart Contract Form</h3>
            <div>
              <Label htmlFor="chain">Chain</Label>
              <Select value={chain} onValueChange={setChain}>
                <SelectTrigger id="chain">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="network">Network</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger id="network">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {networks.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contract-address">Contract Address</Label>
              <Input
                id="contract-address"
                name="contract-address"
                placeholder="Enter contract address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>
            {contractMethods.length > 0 && (
              <div className="space-y-4">
                <Label>Contract Methods</Label>
                {contractMethods.map((method) => (
                  <Card key={method.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`method-${method.name}`}
                          checked={selectedMethods.includes(method.name)}
                          onCheckedChange={() => handleMethodSelection(method.name)}
                        />
                        <Label
                          htmlFor={`method-${method.name}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {method.name}
                        </Label>
                      </div>
                      {selectedMethods.includes(method.name) && (
                        <div className="mt-4 space-y-4">
                          <h5 className="text-sm font-medium">Arguments:</h5>
                          {method.args.map((arg: any, index: number) => (
                            <div key={index} className="pl-6 border-l-2 border-gray-200">
                              <p className="text-sm font-medium">{arg.name}</p>
                              <p className="text-sm text-muted-foreground">{arg.description}</p>
                              <p className="text-sm">Type: {arg.type}</p>
                              <Input className="mt-2" placeholder={`Enter ${arg.name}`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      case 'api':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API Form (OpenAPI v3)</h3>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Input</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="manual">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-title">API Title</Label>
                    <Input
                      id="api-title"
                      name="api-title"
                      placeholder="Enter API title"
                      value={apiTitle}
                      onChange={(e) => setApiTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-version">API Version</Label>
                    <Input
                      id="api-version"
                      name="api-version"
                      placeholder="Enter API version"
                      value={apiVersion}
                      onChange={(e) => setApiVersion(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-description">API Description</Label>
                    <Textarea
                      id="api-description"
                      name="api-description"
                      placeholder="Enter API description"
                      value={apiDescription}
                      onChange={(e) => setApiDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input
                      id="api-endpoint"
                      name="api-endpoint"
                      placeholder="Enter API endpoint"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      name="api-key"
                      type="password"
                      placeholder="Enter API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>API Paths</Label>
                    {apiPaths.map((path, pathIndex) => (
                      <Accordion type="single" collapsible key={pathIndex}>
                        <AccordionItem value={`path-${pathIndex}`}>
                          <AccordionTrigger>Path {pathIndex + 1}</AccordionTrigger>
                          <AccordionContent>
                            <Card>
                              <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">Path {pathIndex + 1}</h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeApiPath(pathIndex)}
                                    aria-label={`Remove path ${pathIndex + 1}`}
                                  >
                                    <Trash2 className="size--4" />
                                  </Button>
                                </div>
                                <div>
                                  <Label htmlFor={`path-${pathIndex}`}>Path</Label>
                                  <Input
                                    id={`path-${pathIndex}`}
                                    value={path.path}
                                    onChange={(e) => updateApiPath(pathIndex, 'path', e.target.value)}
                                    placeholder="Enter path (e.g., /users)"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`method-${pathIndex}`}>HTTP Method</Label>
                                  <Select
                                    value={path.method}
                                    onValueChange={(value) => updateApiPath(pathIndex, 'method', value)}
                                  >
                                    <SelectTrigger id={`method-${pathIndex}`}>
                                      <SelectValue placeholder="Select HTTP method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {httpMethods.map((method) => (
                                        <SelectItem key={method} value={method}>
                                          {method.toUpperCase()}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`summary-${pathIndex}`}>Summary</Label>
                                  <Input
                                    id={`summary-${pathIndex}`}
                                    value={path.summary}
                                    onChange={(e) => updateApiPath(pathIndex, 'summary', e.target.value)}
                                    placeholder="Enter path summary"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`description-${pathIndex}`}>Description</Label>
                                  <Textarea
                                    id={`description-${pathIndex}`}
                                    value={path.description}
                                    onChange={(e) => updateApiPath(pathIndex, 'description', e.target.value)}
                                    placeholder="Enter path description"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <Label>Parameters</Label>
                                  {path.parameters.map((param, paramIndex) => (
                                    <Card key={paramIndex}>
                                      <CardContent className="pt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <h5 className="text-sm font-medium">Parameter {paramIndex + 1}</h5>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeApiParameter(pathIndex, paramIndex)}
                                            aria-label={`Remove parameter ${paramIndex + 1}`}
                                          >
                                            <Trash2 className="size--4" />
                                          </Button>
                                        </div>
                                        <div>
                                          <Label htmlFor={`param-name-${pathIndex}-${paramIndex}`}>Name</Label>
                                          <Input
                                            id={`param-name-${pathIndex}-${paramIndex}`}
                                            value={param.name}
                                            onChange={(e) => updateApiParameter(pathIndex, paramIndex, 'name', e.target.value)}
                                            placeholder="Enter parameter name"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor={`param-in-${pathIndex}-${paramIndex}`}>Location</Label>
                                          <Select
                                            value={param.in}
                                            onValueChange={(value) => updateApiParameter(pathIndex, paramIndex, 'in', value)}
                                          >
                                            <SelectTrigger id={`param-in-${pathIndex}-${paramIndex}`}>
                                              <SelectValue placeholder="Select parameter location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {parameterLocations.map((location) => (
                                                <SelectItem key={location} value={location}>
                                                  {location}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label htmlFor={`param-description-${pathIndex}-${paramIndex}`}>Description</Label>
                                          <Input
                                            id={`param-description-${pathIndex}-${paramIndex}`}
                                            value={param.description}
                                            onChange={(e) => updateApiParameter(pathIndex, paramIndex, 'description', e.target.value)}
                                            placeholder="Enter parameter description"
                                          />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`param-required-${pathIndex}-${paramIndex}`}
                                            checked={param.required}
                                            onCheckedChange={(checked) => updateApiParameter(pathIndex, paramIndex, 'required', checked)}
                                          />
                                          <Label
                                            htmlFor={`param-required-${pathIndex}-${paramIndex}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            Required
                                          </Label>
                                        </div>
                                        <div>
                                          <Label htmlFor={`param-type-${pathIndex}-${paramIndex}`}>Type</Label>
                                          <Select
                                            value={param.type}
                                            onValueChange={(value) => updateApiParameter(pathIndex, paramIndex, 'type', value)}
                                          >
                                            <SelectTrigger id={`param-type-${pathIndex}-${paramIndex}`}>
                                              <SelectValue placeholder="Select parameter type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {parameterTypes.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                  {type}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                  <Button onClick={() => addApiParameter(pathIndex)} className="w-full">
                                    <Plus className="mr-2 size-4" /> Add Parameter
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                    <Button onClick={addApiPath} className="w-full">
                      <Plus className="mr-2 size-4" /> Add Path
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="file">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-spec-file">Upload OpenAPI v3 Specification</Label>
                    <Input
                      id="api-spec-file"
                      type="file"
                      accept=".json"
                      onChange={handleApiSpecFileUpload}
                    />
                  </div>
                  {apiSpecFile && (
                    <div>
                      <p>File uploaded: {apiSpecFile.name}</p>
                      <p>API Title: {apiTitle}</p>
                      <p>API Version: {apiVersion}</p>
                      <p>API Description: {apiDescription}</p>
                      <p>API Endpoint: {apiEndpoint}</p>
                      <p>Paths: {apiPaths.length}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )
      default:
        return null
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Tool</CardTitle>
        <CardDescription>Fill in the details and select tool type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form action={action}>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="size-20" onClick={handleAvatarClick}>
                <AvatarImage src={avatar || '/placeholder.svg?height=80&width=80'} alt="Avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  <Upload className="mr-2 size-4" />
                  Upload Avatar
                </Label>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                aria-describedby="name-description"
              />
              <p id="name-description" className="text-sm text-muted-foreground">Please enter tool name</p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                aria-describedby="description-description"
              />
              <p id="description-description" className="text-sm text-muted-foreground">Provide a brief description of your project or request</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <Label htmlFor="form-type">Select Type Tool</Label>
            <RadioGroup
              name="form-type"
              onValueChange={(value) => { setSelectedForm(value); console.log(value) }}
              className="grid grid-cols-3 gap-4"
              aria-describedby="form-type-description"
            >
              {options.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                  <option.icon className="mb-3 size-6" />
                  {option.label}
                </Label>
              ))}
            </RadioGroup>
            <p id="form-type-description" className="text-sm text-muted-foreground">Select the type of form you want to fill out</p>
          </div>

          {selectedForm && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                {renderForm()}
              </CardContent>
            </Card>
          )}
          <Input
            name="typeName"
            className="hidden"
            type="text"
            defaultValue={selectedForm || ''}
          />
          <Input
            name="data"
            className="hidden"
            type="text"
            defaultValue={data}
          />
          {children}
        </Form>
      </CardContent>
    </Card>
  );
}
