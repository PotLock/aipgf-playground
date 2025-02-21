"use client"

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
import { Eye, EyeOff, MoreVertical, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { removeTool, updateToolVisibility } from '@/app/(chat)/(tool)/action';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';
import Link from 'next/link';


interface ToolCardProps {
  tool: Tool;
  onRemove: () => void;
}

export function ToolCard({ tool, onRemove }: ToolCardProps) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false)
  const [isVisible, setIsVisible] = useState(tool.visible);

  const handleRemove = async (e: any) => {
    e.preventDefault()

    setIsRemoving(true)
    try {
      const result = await removeTool(tool.id)
      if (result.success) {
        toast.success(result.message)
        onRemove()
      } else {
        toast.error('Failed to remove tool')
      }
    } catch (error) {
      console.error('Error removing tool:', error)
      toast.error('An error occurred while removing the tool')
    } finally {
      setIsRemoving(false)
    }
  }
  const handleVisibilityToggle = async () => {
    try {
      const result = await updateToolVisibility(tool.id, !isVisible);
      if (result.success) {
        toast.success(result.message)
        setIsVisible(!isVisible);
      } else {
        toast.error('Failed to update tool visibility')
      }
    } catch (error) {
      console.error('Failed to update tool visibility', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="">
        <div className="flex flex-row items-center gap-4 mb-2">
          <Avatar>
            <AvatarImage src={tool.avatar || ""} alt={tool.name} />
            <AvatarFallback>{tool.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle>{tool.name.length > 20 ? `${tool.name.slice(0, 20)}...` : tool.name}</CardTitle>
            <CardDescription>{tool.description && tool.description.length > 20 ? `${tool.description.slice(0, 20)}...` : tool.name}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault()
                    }}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to remove this agent?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the agent and remove their data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemove} disabled={isRemoving}>
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                    }}>
                      {isVisible ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Show
                        </>
                      )}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {isVisible ? 'Hide' : 'Show'} this tool?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to {isVisible ? 'hide' : 'show'} this tool?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleVisibilityToggle}>
                        {isVisible ? 'Hide' : 'Show'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="space-y-1">
          <Badge>{tool.typeName}</Badge>
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

export default function ToolCardList() {
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of tools per page
  useEffect(() => {
    const fetchTool = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tool?page=${page}&limit=${limit}`)
        const data = await response.json();
        setTools(data.tools);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching agent:', error);
        toast.error('Failed to fetch agent data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [page]);



  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleRemove = (id: string) => {
    setTools((prevAgents) => prevAgents?.filter((agent) => agent.id !== id) || null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div>
      {isLoading ? (
        <Card className="w-full ">
          <CardContent className="py-10 text-center">
            <CardDescription>
              {isLoading ? 'Loading...' : 'No tools available at the moment.'}
            </CardDescription>
          </CardContent>
        </Card>)
        : (
          <>
            {tools && tools.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tools?.map((agent) => (
                    <ToolCard key={agent.id} tool={agent} onRemove={() => handleRemove(agent.id)} />
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                  <div className="join space-x-1">
                    <Button
                      className="join-item px-2 sm:px-4"
                      onClick={() => handlePageChange(1)}
                      disabled={page === 1}
                    >
                      «
                    </Button>
                    <Button
                      className="join-item px-2 sm:px-4"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      ‹
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = page - 2 + i;
                      if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                          <Button
                            key={pageNumber}
                            className={`join-item px-3 sm:px-4 ${pageNumber === page ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    <Button
                      className="join-item px-2 sm:px-4"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      ›
                    </Button>
                    <Button
                      className="join-item px-2 sm:px-4"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={page === totalPages}
                    >
                      »
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                </div>
              </>

            ) : (
              <Card className="flex flex-col items-center justify-center h-full">
                <CardContent className="pt-6 text-center">
                  <PlusCircle className="size-12 mb-4 mx-auto text-gray-400" />
                  <CardTitle className="text-xl mb-2">Create New Tool</CardTitle>
                  <CardDescription className="mb-4">Add a new Tool to your collection</CardDescription>
                  <Button asChild>
                    <Link className='w-full'
                      href={`/create-tool`}>
                      Create Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}


    </div>
  )
}