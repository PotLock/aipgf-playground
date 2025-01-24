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
    return (
      <div className="p-6">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h2 className="text-2xl font-bold tracking-tight">Tool</h2>
          <Button asChild>
            <Link href="/create-tool">
              Create Tool
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Create your own custom tool
          </p>
          {isLoading ? (
            <Card className="w-full ">
              <CardContent className="py-10 text-center">
                <CardDescription>
                  {isLoading ? 'Loading...' : 'No agents available at the moment.'}
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <p>No tools available at the moment.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h2 className="text-2xl font-bold tracking-tight">Tool</h2>
        <Button asChild>
          <Link href="/create-tool">
            Create Tool
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Create your own custom tool
        </p>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          tools && tools.length > 0 ? (
            tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))
          ) : (
            <Card className="flex flex-col items-center justify-center h-full">
              <CardContent className="pt-6 text-center">
                <PlusCircle className="size-12 mb-4 mx-auto text-gray-400" />
                <CardTitle className="text-xl mb-2">Create New Tool</CardTitle>
                <CardDescription className="mb-4">Create tool</CardDescription>
                <Button asChild>
                  <Link className='w-full' href={`/create-tool`}>
                    Create Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>)
        )}
      </div>

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
    </div>
  );
} 