import { Separator } from '@radix-ui/react-dropdown-menu';
import { Tool } from '@/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiToolDetails } from '@/components/custom/tool-detail/api-tool-details';
import { SmartContractToolDetails } from '@/components/custom/tool-detail/smart-contract-tool-details';
import { WidgetToolDetails } from '@/components/custom/tool-detail/widget-tool-details';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col relative">

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Avatar>
            <AvatarImage src={tool.avatar || ""} alt={tool.name} />
            <AvatarFallback>{tool.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Badge>{tool.typeName}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => router.push(`/update-tool/${tool.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this tool?')) {
                      // Gọi API xóa tool
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl">{tool.name}</CardTitle>
          <CardDescription>{tool.description}</CardDescription>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="grow pt-4">
        <div className="mb-6">
          <p className="text-sm font-semibold mb-1">ID</p>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded block overflow-x-auto text-black">
            {tool.id}
          </code>
        </div>
        <Separator className="my-4" />
        {tool.typeName === 'api' && <ApiToolDetails data={tool.data as any} />}
        {tool.typeName === 'smartcontract' && <SmartContractToolDetails data={tool.data as any} />}
        {tool.typeName === 'widget' && <WidgetToolDetails data={tool.data as any} />}
      </CardContent>
    </Card>
  );
} 