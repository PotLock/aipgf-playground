"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolCard } from "./tool-card"
import { Pagination } from "./pagination"

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
    tools: Tool[] | null | undefined
    visibleTools: Tool[] | null | undefined
    currentPage: number
    totalPages: number
    visibleTotalPages: number
    onPageChange: (page: number) => void
    onVisiblePageChange: (page: number) => void
    isLoading: boolean
    isVisibleLoading: boolean
    query: string
    setQuery: (query: string) => void
}

export function ToolSelectorModal({
    isOpen,
    onClose,
    onToolsSelect,
    selectedTools,
    tools = [],
    visibleTools = [],
    currentPage,
    totalPages,
    visibleTotalPages,
    onPageChange,
    onVisiblePageChange,
    isLoading,
    isVisibleLoading,
    query,
    setQuery
}: ToolSelectorModalProps) {
    const [activeTab, setActiveTab] = useState("user")
    const [tempSelectedTools, setTempSelectedTools] = useState<Tool[]>(selectedTools)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        setTempSelectedTools(selectedTools)
    }, [selectedTools])

    const filteredTools = (tools || []).filter(
        (tool) =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()),
    )

    const filteredVisibleTools = (visibleTools || []).filter(
        (tool) =>
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()),
    )
    
    const handleToolToggle = (tool: Tool) => {
        setTempSelectedTools((prev) =>
            prev.some((t) => t.id === tool.id) ? prev.filter((t) => t.id !== tool.id) : [...prev, tool],
        )
    }

    const handleSave = () => {
        onToolsSelect(tempSelectedTools)
        onClose()
    }

    const paginatedTools = (tools: Tool[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return tools.slice(startIndex, endIndex)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-0">

                <div className="flex flex-col h-[80vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <DialogTitle>Select Tools</DialogTitle>
                    </div>
                    {/* Search */}
                    <div className="p-4 border-b">
                        <Input
                            type="text"
                            placeholder="Search tools..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    {/* Tabs and Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="user">Your Tools</TabsTrigger>
                            <TabsTrigger value="favorite">Explore Tools</TabsTrigger>
                        </TabsList>
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto p-4">
                                <TabsContent value="user" className="mt-0 h-full">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <span>Loading...</span>
                                        </div>
                                    ) : filteredTools.length === 0 ? (
                                        <div className="flex justify-center items-center h-full">
                                            <span>No tools found</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {paginatedTools(filteredTools).map((tool) => (
                                                <ToolCard
                                                    key={tool.id}
                                                    tool={tool}
                                                    isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                                    onSelect={() => handleToolToggle(tool)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="favorite" className="mt-0 h-full">
                                    {isVisibleLoading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <span>Loading...</span>
                                        </div>
                                    ) : filteredVisibleTools.length === 0 ? (
                                        <div className="flex justify-center items-center h-full">
                                            <span>No tools found</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {paginatedTools(filteredVisibleTools).map((tool) => (
                                                <ToolCard
                                                    key={tool.id}
                                                    tool={tool}
                                                    isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                                    onSelect={() => handleToolToggle(tool)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                            {/* Pagination */}
                            <div className="border-t p-4">
                                {activeTab === "user" ? (
                                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
                                ) : (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={visibleTotalPages}
                                        onPageChange={onVisiblePageChange}
                                    />
                                )}
                            </div>
                        </div>
                    </Tabs>

                    {/* Footer */}
                    <div className="border-t p-4">
                        <Button className="w-full" onClick={handleSave}>
                            Save Selection
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

