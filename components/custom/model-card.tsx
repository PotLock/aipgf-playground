import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { MoreVertical, Pencil, Trash, Eye, EyeOff, Clipboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { removeModel } from '@/app/(chat)/(models)/actions'
interface Model {
    id: string;
    modelName: string;
    apiIdentifier: string;
    apiToken: string;
}

interface ModelCardProps {
    model: Model;
    onDelete: (id: string) => void;
    onCopyApiToken: (apiToken: string) => void;
    onModelRemoved: () => void; // Callback to reload data
}

export function ModelCard({ model, onDelete, onCopyApiToken, onModelRemoved }: ModelCardProps) {
    const router = useRouter();
    const [isApiTokenVisible, setIsApiTokenVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const handleEdit = () => {
        router.push(`/update-model/${model.id}`);
    };

    const handleDelete = async () => {
        setIsRemoving(true);
        try {
            const result = await removeModel(model.id);
            if (result.success) {
                toast.success(result.message);
                onDelete(model.id);
                onModelRemoved(); // Trigger data reload
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error removing model:', error);
            toast.error('An error occurred while removing the model');
        } finally {
            setIsRemoving(false);
        }
    };

    const handleToggleApiTokenVisibility = () => {
        setIsApiTokenVisible(!isApiTokenVisible);
    };

    const handleCopyApiToken = () => {
        navigator.clipboard.writeText(model.apiToken);
        toast.success('API Token copied to clipboard');
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center gap-4 mb-2">
                <div className="flex-grow">
                    <CardTitle className="text-2xl">{model.modelName}</CardTitle>
                    <CardDescription>Api Identifier: {model.apiIdentifier}</CardDescription>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Model
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} disabled={isRemoving}>
                            <Trash className="mr-2 h-4 w-4" />
                            {isRemoving ? 'Removing...' : 'Delete Model'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <p>{isApiTokenVisible ? model.apiToken : '••••••••••••••••••••••••••••••••'}</p>
                        <Button variant="ghost" size="icon" onClick={handleToggleApiTokenVisibility}>
                            {isApiTokenVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCopyApiToken}>
                            <Clipboard className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}