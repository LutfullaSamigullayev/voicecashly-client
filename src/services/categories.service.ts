import { api } from './api';
import type { Category, CategoryType } from '@/types';

export interface CategoryInput {
  workspaceId: number;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  type: CategoryType;
  color?: string;
  icon?: string;
}

export const categoriesService = {
  findAll: async (workspaceId: number): Promise<Category[]> => {
    const res = await api.get<Category[]>('/categories', { params: { workspaceId } });
    return res.data;
  },
  create: async (input: CategoryInput): Promise<Category> => {
    const res = await api.post<Category>('/categories', input);
    return res.data;
  },
  update: async (id: number, input: Partial<CategoryInput>): Promise<Category> => {
    const res = await api.patch<Category>(`/categories/${id}`, input);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
