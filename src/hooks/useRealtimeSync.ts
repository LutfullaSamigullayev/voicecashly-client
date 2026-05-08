import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/services/supabase';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!supabase || !activeWorkspaceId) return;

    const channel = supabase
      .channel(`ws-${activeWorkspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Transaction',
          filter: `workspaceId=eq.${activeWorkspaceId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['summary'] });
          queryClient.invalidateQueries({ queryKey: ['analytics'] });
          if (payload.eventType === 'INSERT') {
            toast(t('transactions.new_arrived', { name: '' }));
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Budget',
          filter: `workspaceId=eq.${activeWorkspaceId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeWorkspaceId, queryClient, t]);
}
