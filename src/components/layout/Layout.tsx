import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useMyWorkspaces } from '@/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

function WorkspaceLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <p className="text-muted-foreground">Ma'lumotlar yuklanmadi</p>
      <button
        onClick={onRetry}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
      >
        Qayta urinish
      </button>
    </div>
  );
}

function SlowLoadBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground shadow">
      Server ishga tushmoqda, biroz kuting...
    </div>
  );
}

export function Layout() {
  useRealtimeSync();
  const { data: memberships, isLoading, isError, refetch } = useMyWorkspaces();
  const { activeWorkspaceId, setActive } = useWorkspaceStore();
  const [showSlowBanner, setShowSlowBanner] = useState(false);

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setShowSlowBanner(true), 8000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) setShowSlowBanner(false);
  }, [isLoading]);

  useEffect(() => {
    if (!memberships || memberships.length === 0) return;
    const found = memberships.find((m) => m.workspaceId === activeWorkspaceId);
    if (!found) {
      setActive(memberships[0].workspaceId, memberships[0].role);
    }
  }, [memberships, activeWorkspaceId, setActive]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner className="h-8 w-8" />
        <SlowLoadBanner show={showSlowBanner} />
      </div>
    );
  }

  if (isError) {
    return <WorkspaceLoadError onRetry={() => void refetch()} />;
  }

  if (memberships && memberships.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
