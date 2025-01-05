"use client"

import Link from 'next/link'

import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { removeAgent } from '@/app/(chat)/(agent)/actions'
import { toast } from 'sonner'

type Agent = {
    id: string
    avatar: string
    name: string
    description: string
    modelName: string
    model: string
    prompt: string
    tools: any[]
    suggestedActions: any[]
}

type AgentCardProps = {
    agent: Agent
}

function AgentCard({ agent }: AgentCardProps) {
    const [isRemoving, setIsRemoving] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false);

    const handleRemove = async () => {
        setIsRemoving(true)
        try {
            const result = await removeAgent(agent.id)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error('Failed to remove agent')
            }
        } catch (error) {
            console.error('Error removing agent:', error)
            toast.error('An error occurred while removing the agent')
        } finally {
            setIsRemoving(false)
        }
    }
    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="size-14">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>{agent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault()
                                }}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to remove this agent?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the agent and remove their data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleRemove} disabled={isRemoving}>
                                        {isRemoving ? 'Removing...' : 'Remove'}
                                    </AlertDialogAction>                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                    
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">Model</span>
                        <span>{agent.model}</span>
                    </div>
                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Prompt</span>
                    <span>
                            {isExpanded ? agent.prompt : `${agent.prompt.slice(0, 100)}...`}
                            {agent.prompt.length > 100 && (
                                <button onClick={handleToggleExpand} className="text-blue-500 ml-2">
                                    {isExpanded ? 'Read Less' : 'Read More'}
                                </button>
                            )}
                        </span>                </div>
                <div>
                    <span className="text-sm font-medium text-muted-foreground">Tools</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {agent.tools && agent.tools.map((tool, index) => (
                            <Badge key={index} variant="secondary">
                                {tool}
                            </Badge>
                        ))}
                    </div>
                </div>
                {/* <div>
                    <span className="text-sm font-medium text-muted-foreground">Suggested Actions : </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {agent.suggestedActions && agent.suggestedActions.map((action, index) => (
                            <Badge key={index} variant="secondary">
                                {action.action}
                            </Badge>
                        ))}
                    </div>
                </div> */}

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