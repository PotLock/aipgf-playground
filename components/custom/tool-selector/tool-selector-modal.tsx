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
    visibleTools: Tool[]
    currentPage: number
    totalPages: number
    visibleTotalPages: number
    onPageChange: (page: number) => void
    onVisiblePageChange: (page: number) => void
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
    onVisiblePageChange
}: ToolSelectorModalProps) {
    const [activeTab, setActiveTab] = useState("user")
    const [modalSearchQuery, setModalSearchQuery] = useState("")
    const [tempSelectedTools, setTempSelectedTools] = useState<Tool[]>(selectedTools)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        setTempSelectedTools(selectedTools)
    }, [selectedTools])

    const filteredTools = Array.isArray(tools)
        ? tools.filter(
            (tool) =>
                tool.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(modalSearchQuery.toLowerCase())
        )
        : []

    const filteredVisibleTools = Array.isArray(visibleTools)
        ? visibleTools.filter(
            (tool) =>
                tool.name.toLowerCase().includes(modalSearchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(modalSearchQuery.toLowerCase())
        )
        : []

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

    const paginatedTools = (tools: Tool[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return tools.slice(startIndex, endIndex)
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
                        <TabsTrigger value="user">Your Tools</TabsTrigger>
                        <TabsTrigger value="favorite">Explore Tools</TabsTrigger>
                    </TabsList>
                    <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <TabsContent value="user">
                            {paginatedTools(filteredTools).map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                    onSelect={() => handleToolToggle(tool)}
                                />
                            ))}
                            <div className="mt-4 flex flex-col items-center space-y-2">
                                <div className="join space-x-1">
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onPageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </Button>
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ‹
                                    </Button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = currentPage - 2 + i;
                                        if (pageNumber > 0 && pageNumber <= totalPages) {
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    className={`join-item px-3 sm:px-4 ${pageNumber === currentPage ? 'bg-primary text-primary-foreground' : ''}`}
                                                    onClick={() => onPageChange(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        }
                                        return null;
                                    })}
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        ›
                                    </Button>
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onPageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="favorite">
                            {paginatedTools(filteredVisibleTools).map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
                                    onSelect={() => handleToolToggle(tool)}
                                />
                            ))}
                            <div className="mt-4 flex flex-col items-center space-y-2">
                                <div className="join space-x-1">
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onVisiblePageChange(1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </Button>
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onVisiblePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ‹
                                    </Button>
                                    {Array.from({ length: Math.min(5, visibleTotalPages) }, (_, i) => {
                                        const pageNumber = currentPage - 2 + i;
                                        if (pageNumber > 0 && pageNumber <= visibleTotalPages) {
                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    className={`join-item px-3 sm:px-4 ${pageNumber === currentPage ? 'bg-primary text-primary-foreground' : ''}`}
                                                    onClick={() => onVisiblePageChange(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        }
                                        return null;
                                    })}
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onVisiblePageChange(currentPage + 1)}
                                        disabled={currentPage === visibleTotalPages}
                                    >
                                        ›
                                    </Button>
                                    <Button
                                        className="join-item px-2 sm:px-4"
                                        onClick={() => onVisiblePageChange(visibleTotalPages)}
                                        disabled={currentPage === visibleTotalPages}
                                    >
                                        »
                                    </Button>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Page {currentPage} of {visibleTotalPages}
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleSave}>Save Selection</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

