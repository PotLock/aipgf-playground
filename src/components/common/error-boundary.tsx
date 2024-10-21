'use client';

import { FC, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { ErrorBoundary as ReactErrorBoundary, useErrorBoundary } from 'react-error-boundary';

import { useRouter } from 'next/navigation';

type ErrorFallbackProps = {
  error: Error;
};

const ErrorFallback: FC<ErrorFallbackProps> = ({ error }) => {
  const searchParams = useSearchParams();
  const { resetBoundary } = useErrorBoundary();

  return (
    <section className="relative py-24 md:py-44 lg:pb-72 lg:pt-56">
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="md:max-w-4xl">
            <span className="text-4xl font-bold leading-tight text-primary md:text-5xl">Something went wrong</span>
            <h2 className="my-4 text-2xl font-bold leading-tight tracking-tighter md:text-3xl">{error.name}</h2>
            <p className="mb-6 text-lg text-gray-400 md:text-xl">{error.message}</p>
            <div className="flex flex-wrap space-x-2">
              <button onClick={resetBoundary}>Try Again</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type ErrorBoundaryProps = {
  children: ReactNode;
};

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
};

export default ErrorBoundary;
