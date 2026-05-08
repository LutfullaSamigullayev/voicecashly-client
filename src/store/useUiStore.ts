import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (t: 'light' | 'dark') => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (t) => {
        const root = document.documentElement;
        if (t === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        set({ theme: t });
      },
    }),
    { name: 'voicecashly_ui' },
  ),
);
