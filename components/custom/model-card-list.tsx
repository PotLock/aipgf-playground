'use client';

import { useState, useEffect } from 'react';
import { ModelCard } from './model-card';
import { Card, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { removeModel } from '@/app/(chat)/(models)/actions';

interface Model {
  id: string;
  modelName: string;
  apiIdentifier: string;
  apiToken: string;
}

export default function ModelCardList() {
  const [models, setModels] = useState<Model[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [IsRemoving, setIsRemoving] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Number of models per page

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/models?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      setModels(data.models);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
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
    setModels((prevModels) => prevModels?.filter((model) => model.id !== id) || null);
  };

  const handleCopyApiToken = (apiToken: string) => {
    navigator.clipboard.writeText(apiToken);
    toast.success('API Token copied to clipboard');
  };

  return (
    <div>
      {isLoading ? (
        <Card className="w-full">
          <CardContent className="py-10 text-center">
            <CardDescription>Loading...</CardDescription>
          </CardContent>
        </Card>
      ) : (
        <>
          {
            models && models.length > 0 ?
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {
                  models.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      onDelete={handleRemove}
                      onCopyApiToken={handleCopyApiToken}
                      onModelRemoved={fetchModels} // Pass the callback to reload data
                    />
                  ))}
              </div> : (
                <Card className="w-full">
                  <CardContent className="py-10 text-center">
                    <CardDescription>No Models found</CardDescription>
                  </CardContent>
                </Card>
              )}
          <div className="flex flex-col items-center justify-center mt-8 space-y-4">
            <div className="join space-x-1">
              <Button onClick={handlePreviousPage} disabled={page === 1}>
                Previous
              </Button>
              <Button onClick={handleNextPage} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}