import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { categoriesService, type CategoryInput } from '@/services/categories.service';

export function useCategories(workspaceId: number | null) {
  return useQuery({
    queryKey: ['categories', workspaceId],
    queryFn: () => categoriesService.findAll(workspaceId!),
    enabled: !!workspaceId,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (input: CategoryInput) => categoriesService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('toasts.saved'));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<CategoryInput> }) =>
      categoriesService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('toasts.saved'));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: number) => categoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('toasts.deleted'));
    },
  });
}
