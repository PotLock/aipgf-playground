import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ApiToolData {
  title?: string
  version?: string
  description?: string
  endpoint?: string
  key?: string
  paths?: {
    path: string
    method: string
    summary: string
    description: string
    parameters: {
      name: string
      in: string
      description: string
      required: boolean
      type: string
    }[]
  }[]
}

export function ApiToolDetails({ data }: { data: ApiToolData }) {
  return (
    <div className="space-y-4">
      {data.title && (
        <div>
          <p className="font-semibold text-sm">Title</p>
          <p className="text-gray-600">{data.title}</p>
        </div>
      )}
      {data.version && (
        <div>
          <p className="font-semibold text-sm">Version</p>
          <p className="text-gray-600">{data.version}</p>
        </div>
      )}
      {data.endpoint && (
        <div>
          <p className="font-semibold text-sm mb-1">Endpoint</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
            {data.endpoint}
          </code>
        </div>
      )}
      {data.paths && data.paths.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="font-semibold mb-2">Paths</p>
            <ul className="space-y-3">
              {data.paths.map((path, index) => (
                <li key={index} className="border rounded-md p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge>{path.method.toUpperCase()}</Badge>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{path.path}</code>
                  </div>
                  <p className="text-xs text-gray-600">{path.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

