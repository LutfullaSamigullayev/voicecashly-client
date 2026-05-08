import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesService } from '@/services/workspaces.service';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function useMyWorkspaces() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['workspaces', 'me'],
    queryFn: () => workspacesService.myWorkspaces(),
    enabled: isAuthenticated,
  });
}

export function useActiveWorkspace() {
  const { data: memberships } = useMyWorkspaces();
  const { activeWorkspaceId } = useWorkspaceStore();
  if (!memberships?.length) return undefined;
  return memberships.find((m) => m.workspaceId === activeWorkspaceId) ?? memberships[0];
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const { setActive } = useWorkspaceStore();
  return useMutation({
    mutationFn: (input: { name: string; type: 'personal' | 'team' }) =>
      workspacesService.create(input.name, input.type),
    onSuccess: (ws) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setActive(ws.id, 'OWNER');
    },
  });
}

export function useWorkspaceDetail(id: number | null) {
  return useQuery({
    queryKey: ['workspaces', id],
    queryFn: () => workspacesService.getOne(id!),
    enabled: !!id,
  });
}

export function useInviteCode(id: number | null) {
  return useQuery({
    queryKey: ['workspaces', id, 'invite'],
    queryFn: () => workspacesService.getInviteCode(id!),
    enabled: !!id,
  });
}
