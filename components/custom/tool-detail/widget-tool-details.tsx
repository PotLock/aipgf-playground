import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface WidgetToolData {
  code: string
  args: {
    name: string
    description: string
    type: string
  }[]
}

export function WidgetToolDetails({ data }: { data: WidgetToolData }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold text-sm mb-1">Widget Code</p>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
          <code>{data.code}</code>
        </pre>
      </div>
      {data.args && data.args.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="font-semibold text-sm mb-2">Arguments</p>
            <ul className="space-y-3">
              {data.args.map((arg, index) => (
                <li key={index} className="border rounded-md p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline">{arg.type}</Badge>
                    <span className="font-medium text-sm">{arg.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{arg.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

