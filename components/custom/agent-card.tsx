import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Agent = {
    id: string
    avatar: string
    name: string
    description: string
    modelName: string
    model: string
    prompt: string
    tool: string[]
    suggestedActions: any[]
}

type AgentCardProps = {
    agent: Agent
}

function AgentCard({ agent }: AgentCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="size-14">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Model Name</span>
                        <span>{agent.modelName}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Model</span>
                        <span>{agent.model}</span>
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Prompt</span>
                    <p className="mt-1 text-sm">{agent.prompt}</p>
                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Tools</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {agent.tool.map((tool) => (
                            <Badge key={tool} variant="secondary">
                                {tool}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Suggested Actions : </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {agent.suggestedActions && agent.suggestedActions.map((action, index) => (
                            <Badge key={action.action} variant="secondary">
                                {action.action}
                            </Badge>
                        ))}
                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link className='w-full'
                        href={`/chat?agentId=${agent.id}`}>
                        Start Chat
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

type AgentCardListProps = {
    agents?: Agent[]
}

export default function AgentCardList({ agents = [] }: AgentCardListProps) {
    if (agents.length === 0) {
        return (
            <Card className="w-full max-w-md">
                <CardContent className="py-10 text-center">
                    <CardDescription>No agents available at the moment.</CardDescription>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
            ))}
        </div>
    )
}