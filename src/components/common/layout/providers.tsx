'use client';

import React, { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { TooltipProvider } from '@/components/ui/tooltip'
import { MediaContextProvider } from '@/components/common/media';
import ServiceWorker from '@/components/common/service-worker';
import { SidebarProvider } from '@/hooks/use-sidebar'

import ErrorBoundary from '../error-boundary';

import '@/libs/svg-icons/dist/svg-icons.scss';
import '@/app/globals.scss';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false
    }
  }
});

type ProvidersProps = {
  children: ReactNode;
};

function Providers({ children }: ProvidersProps) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <ErrorBoundary>
        <ServiceWorker />
        <SidebarProvider>
          <TooltipProvider>
            <MediaContextProvider disableDynamicMediaQueries>{children}</MediaContextProvider>
          </TooltipProvider>
        </SidebarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ErrorBoundary>
    </PersistQueryClientProvider>
  );
}

export default Providers;
