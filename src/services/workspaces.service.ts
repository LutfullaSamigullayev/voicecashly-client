import { api } from './api';
import type { Workspace, WorkspaceMembership } from '@/types';

export const workspacesService = {
  myWorkspaces: async (): Promise<WorkspaceMembership[]> => {
    const res = await api.get<WorkspaceMembership[]>('/workspaces/me');
    return res.data;
  },
  create: async (name: string, type: 'personal' | 'team'): Promise<Workspace> => {
    const res = await api.post<Workspace>('/workspaces', { name, type });
    return res.data;
  },
  join: async (inviteCode: string): Promise<Workspace> => {
    const res = await api.post<Workspace>('/workspaces/join', { inviteCode });
    return res.data;
  },
  getOne: async (id: number): Promise<Workspace> => {
    const res = await api.get<Workspace>(`/workspaces/${id}`);
    return res.data;
  },
  getInviteCode: async (id: number): Promise<string> => {
    const res = await api.get<{ code: string }>(`/workspaces/${id}/invite`);
    return res.data.code;
  },
};
