import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface SuggestedAction {
    id: string
    title: string
    label: string
    action: string
}

export default function ActionCard({ action, onRemove }: { action: SuggestedAction; onRemove: (id: string) => void }) {
    return (
        <Card className="relative">
            <CardHeader>
                <CardTitle className="pr-8">{action.title}</CardTitle>
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => onRemove(action.id)}
                    aria-label="Remove action"
                >
                    <Trash2 className="size-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold">Label:</span> {action.label}
                    </div>
                    <div>
                        <span className="font-semibold">Action:</span> {action.action}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}