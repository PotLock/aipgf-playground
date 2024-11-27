"use client"

import { Trash2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"


interface Tool {
    id: string
    name: string
    description: string
    isFavorite: boolean
    avatar?: string
}

interface ToolCardProps {
    tool: Tool
    isSelected: boolean
    onSelect?: () => void
    onRemove?: () => void
    showSwitch?: boolean
}

export function ToolCard({ tool, isSelected, onSelect, onRemove, showSwitch = true }: ToolCardProps) {
    return (
        <Card className={`my-2 relative transition-all duration-200 ${!showSwitch ? 'bg-primary/5 hover:bg-primary/10' : ''}`}>
            <CardHeader className="flex flex-row items-center space-y-0 p-4">
                <Avatar className="size-9 mr-4">
                    <AvatarImage src={tool.avatar} alt={tool.name} />
                    <AvatarFallback>{tool.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grow mr-4">
                    <CardTitle className="text-sm font-medium leading-none">{tool.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">{tool.description}</CardDescription>
                </div>
                {showSwitch ? (
                    <Switch
                        id={`tool-${tool.id}`}
                        checked={isSelected}
                        onCheckedChange={onSelect}
                    />
                ) : (
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Remove tool"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </CardHeader>
        </Card>
    )
}

