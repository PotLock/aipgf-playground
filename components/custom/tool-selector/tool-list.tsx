import { ToolCard } from "./tool-card"

interface Tool {
  id: string
  name: string
  description: string
  isFavorite: boolean
  avatar?: string
}

interface ToolListProps {
  tools: Tool[] | null | undefined
  searchQuery: string
  isLoading: boolean
  tempSelectedTools: Tool[]
  handleToolToggle: (tool: Tool) => void
  currentPage: number
  itemsPerPage: number
}

export function ToolList({
  tools = [],
  searchQuery,
  isLoading,
  tempSelectedTools,
  handleToolToggle,
  currentPage,
  itemsPerPage,
}: ToolListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-sm text-muted-foreground">
        <span>Loading...</span>
      </div>
    )
  }

  // Safely handle tools array
  const safeTools = Array.isArray(tools) ? tools : []

  const filteredTools = safeTools.filter((tool) => {
    if (!tool?.name || !tool?.description) return false
    return (
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (filteredTools.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-sm text-muted-foreground">
        <span>No tools found</span>
      </div>
    )
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTools = filteredTools.slice(startIndex, endIndex)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {paginatedTools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          isSelected={tempSelectedTools.some((t) => t.id === tool.id)}
          onSelect={() => handleToolToggle(tool)}
        />
      ))}
    </div>
  )
}

