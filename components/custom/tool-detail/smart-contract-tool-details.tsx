import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SmartContractToolData {
  chain: string
  network: string
  contractAddress: string
  methods: {
    name: string
    args: {
      name: string
      type: string
      description: string
    }[]
  }[]
}

export function SmartContractToolDetails({ data }: { data: SmartContractToolData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold mb-1">Chain</p>
          <Badge variant="outline">{data.chain}</Badge>
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">Network</p>
          <Badge variant="outline">{data.network}</Badge>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-1">Contract Address</p>
        <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto">
          {data.contractAddress}
        </code>
      </div>
      {data.methods && data.methods.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="font-semibold mb-2">Methods</p>
            <ul className="space-y-3">
              {data.methods.map((method, index) => (
                <li key={index} className="border rounded-md p-3">
                  <p className="font-medium mb-1">{method.name}</p>
                  {method.args && method.args.length > 0 && (
                    <ul className="space-y-1">
                      {method.args.map((arg, argIndex) => (
                        <li key={argIndex} className="text-xs flex items-center">
                          <span className="font-medium mr-1">{arg.name}:</span>
                          <Badge variant="secondary" className="text-xs">{arg.type}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

