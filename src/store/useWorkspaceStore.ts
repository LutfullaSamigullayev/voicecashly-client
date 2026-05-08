import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Workspace, Role } from '@/types';

interface WorkspaceState {
  activeWorkspaceId: number | null;
  activeRole: Role | null;
  setActive: (id: number, role?: Role) => void;
  setRole: (role: Role) => void;
  reset: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      activeRole: null,
      setActive: (id, role) =>
        set({ activeWorkspaceId: id, activeRole: role ?? null }),
      setRole: (role) => set({ activeRole: role }),
      reset: () => set({ activeWorkspaceId: null, activeRole: null }),
    }),
    { name: 'voicecashly_workspace' },
  ),
);

export function pickActiveWorkspace(
  workspaces: { workspaceId: number; role: Role; workspace: Workspace }[],
  activeId: number | null,
): { workspaceId: number; role: Role; workspace: Workspace } | undefined {
  if (!workspaces.length) return undefined;
  return workspaces.find((m) => m.workspaceId === activeId) ?? workspaces[0];
}
