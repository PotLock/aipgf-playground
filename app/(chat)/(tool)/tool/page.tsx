import { Separator } from '@radix-ui/react-dropdown-menu';
import { PlusCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { auth } from '@/app/(auth)/auth';
import { ChatHeader } from '@/components/custom/chat-header';
import { ApiToolDetails } from '@/components/custom/tool-detail/api-tool-details';
import { SmartContractToolDetails } from '@/components/custom/tool-detail/smart-contract-tool-details';
import { WidgetToolDetails } from '@/components/custom/tool-detail/widget-tool-details';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getToolByUserId } from '@/db/queries';



export default async function Page(props: { searchParams: Promise<any> }) {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  const tools = await getToolByUserId({ userId: session.user.id! });
  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Tool</CardTitle>
          <CardDescription>
            Create your own custom tool</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center h-full">
            <CardContent className="pt-6 text-center">
              <PlusCircle className="size-12 mb-4 mx-auto text-gray-400" />
              <CardTitle className="text-xl mb-2">Create New Tool</CardTitle>
              <CardDescription className="mb-4">Add a new tool to your collection</CardDescription>
              <Button asChild>
                <Link className='w-full'
                  href={`/create-tool`}>
                  Create Tool
                </Link>
              </Button>
            </CardContent>
          </Card>
          {tools.map((tool) => (
            <Card key={tool.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Avatar>
                    <AvatarImage src={tool.avatar || ""} alt={tool.name} />
                    <AvatarFallback>{tool.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Badge>{tool.typeName}</Badge>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="grow pt-4">
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-1">ID</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
                    {tool.id}
                  </code>
                </div>
                <Separator className="my-4" />
                {tool.typeName === 'api' && <ApiToolDetails data={tool.data as any} />}
                {tool.typeName === 'smartcontract' && <SmartContractToolDetails data={tool.data as any} />}
                {tool.typeName === 'widget' && <WidgetToolDetails data={tool.data as any} />}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
