import React, { FC, ReactElement } from 'react';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';
import { render, RenderOptions } from '@testing-library/react';

import ErrorBoundary from '@/components/common/error-boundary';

import enus from '@/locales/en-us.json';

type AllTheProvidersProps = {
  children: ReactElement;
  session?: Session | null;
};

export const AllTheProviders: FC<AllTheProvidersProps> = ({ children, session = null }) => {
  return (
    <ErrorBoundary>
      <NextIntlClientProvider timeZone="America/New_York" locale={'en-us'} messages={enus}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </NextIntlClientProvider>
    </ErrorBoundary>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
