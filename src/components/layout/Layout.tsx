import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useMyWorkspaces } from '@/hooks/useWorkspaces';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function Layout() {
  useRealtimeSync();
  const { data: memberships, isLoading, isError } = useMyWorkspaces();
  const { activeWorkspaceId, setActive } = useWorkspaceStore();

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
      </div>
    );
  }

  if (!isError && memberships && memberships.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">
          <ErrorBoundary
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
                Sahifa yuklanmadi. Qayta urinib ko'ring.
              </div>
            }
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
