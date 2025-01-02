import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface ToolStepProps {
    title: string;
    content: string;
    next: string;
    toolName: string;
    toolResult: string;
    toolArgs: Record<string, any>;
}


export function ToolStep({ data }: { data: ToolStepProps }) {
    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="text-lg">{data.title}</CardTitle>
                <CardDescription>{data.content}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold mb-1">Next Step</p>
                        <p className="text-sm">{data.next}</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Tool Name</p>
                        <Badge>{data.toolName}</Badge>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold mb-1">Tool Result</p>
                        <p className="text-sm">{data.toolResult}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold mb-1">Tool Arguments</p>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(data.toolArgs, null, 2)}
                        </pre>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

