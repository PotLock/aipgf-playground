"use client"
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Tool } from '@/db/schema';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolCard } from '@/components/custom/tool-card';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Tools() {
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of tools per page

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tool?page=${page}&limit=${limit}`);
        const data = await response.json();
        setTools(data.tools);
        setTotalPages(data.totalTools);
      } catch (error) {
        console.error('Error fetching tool:', error);
        toast.error('Failed to fetch tool data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [page]);

  if (isLoading) {
    return(
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Tool</CardTitle>
                <CardDescription>
                Create your own custom tool
                </CardDescription>
            </CardHeader>
            <Card className="w-full ">
                <CardContent className="py-10 text-center">
                    <CardDescription>
                        {isLoading ? 'Loading...' : 'No tools available at the moment.'}
                    </CardDescription>
                </CardContent>
            </Card>
        </Card>
    ); 
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Tool</CardTitle>
        <CardDescription>
          Create your own custom tool
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center h-full">
          <CardContent className="pt-6 text-center">
            <PlusCircle className="size-12 mb-4 mx-auto text-gray-400" />
            <CardTitle className="text-xl mb-2">Create New Tool</CardTitle>
            <CardDescription className="mb-4">Add a new tool to your collection</CardDescription>
            <Button asChild>
              <Link className='w-full' href={`/create-tool`}>
                Create Tool
              </Link>
            </Button>
          </CardContent>
        </Card>
        {tools && tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </CardContent>
      
      <div className="flex flex-col items-center justify-center mt-8 space-y-4 pb-6">
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
    </Card>
  );
} 