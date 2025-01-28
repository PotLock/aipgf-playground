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
    onSelect: () => void
  }
  
  export function ToolCard({ tool, isSelected, onSelect }: ToolCardProps) {
    return (
      <div
        className={`
          relative p-4 rounded-lg border cursor-pointer transition-all
          hover:border-primary/50 hover:shadow-sm
          ${isSelected ? "border-primary bg-primary/5" : "border-border"}
        `}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onSelect()
          }
        }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            {tool.avatar ? (
              <img src={tool.avatar || "/placeholder.svg"} alt="" className="w-6 h-6 rounded" />
            ) : (
              <span className="text-xs font-medium">{tool.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{tool.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
          </div>
          <div className="absolute top-2 right-2">
            <div
              className={`w-4 h-4 rounded-full border-2 transition-colors
                ${isSelected ? "border-primary bg-primary" : "border-muted-foreground"}
              `}
            />
          </div>
        </div>
      </div>
    )
  }
  
  