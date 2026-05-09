import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './i18n';
import './styles/globals.css';
import { useUiStore } from '@/store/useUiStore';

if (useUiStore.getState().theme === 'dark') {
  document.documentElement.classList.add('dark');
}

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
void fetch(apiBase, { method: 'GET', mode: 'no-cors' }).catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        // 4xx xatolarida qayta urinma (auth/validation muammo)
        if (status && status >= 400 && status < 500) return false;
        // Network xatosi yoki 5xx: Render cold start uchun 3 marta urin
        return failureCount < 3;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15000),
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontSize: 13,
              border: '1px solid hsl(var(--border))',
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
