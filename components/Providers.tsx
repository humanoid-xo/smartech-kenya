'use client';

import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from 'react-error-boundary';
import { store } from '@/store';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-accent-500 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-neutral-600 mb-6">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider>
        <Provider store={store}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#303030',
              },
              success: {
                iconTheme: {
                  primary: '#006400',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#C8102E',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Provider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
