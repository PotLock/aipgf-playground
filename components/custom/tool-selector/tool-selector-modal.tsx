"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ToolCard } from "./tool-card"


interface Tool {
    id: string
    name: string
    description: string
    isFavorite: boolean
    avatar?: string
}

interface ToolSelectorModalProps {
    isOpen: boolean
    onClose: () => void
    onToolsSelect: (tools: Tool[]) => void
    selectedTools: Tool[]
    tools: Tool[]
}

export function ToolSelectorModal({
    isOpen,
    onClose,
    onToolsSelect,
    selectedTools,
    tools
}: ToolSelectorModalProps) {
    const [activeTab, setActiveTab] = useState("user")
    const [modalSearchQuery, setModalSearchQuery] = useState("")
    const [tempSelectedTools, setTempSelectedTools] = useState<Tool[]>(selectedTools)

    useEffect(() => {
        setTempSelectedTools(selectedTools)
    }, [selectedTools])

    const filteredTools = tools.filter(
        (tool) =>
            tool.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(modalSearchQuery.toLowerCase())
    )

    const userTools = filteredTools.filter((tool) => !tool.isFavorite)
    const favoriteTools = filteredTools.filter((tool) => tool.isFavorite)

    const handleToolToggle = (tool: Tool) => {
        setTempSelectedTools((prev) =>
            prev.some((t) => t.id === tool.id)
                ? prev.filter((t) => t.id !== tool.id)
                : [...prev, tool]
        )
    }

    const handleSave = () => {
        onToolsSelect(tempSelectedTools)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Tools</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                    <Input
                        type="text"
                        placeholder="Search tools..."
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="user">Your created Tools</TabsTrigger>
                        <TabsTrigger value="favorite">Favorite Tools</TabsTrigger>
                    </TabsList>
                    <TabsContent value="user">
                        {userTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                onSelect={() => handleToolToggle(tool)}
                            />
                        ))}
                    </TabsContent>
                    <TabsContent value="favorite">
                        {favoriteTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                tool={tool}
                                isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                onSelect={() => handleToolToggle(tool)}
                            />
                        ))}
                    </TabsContent>
                </Tabs>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleSave}>Save Selection</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

