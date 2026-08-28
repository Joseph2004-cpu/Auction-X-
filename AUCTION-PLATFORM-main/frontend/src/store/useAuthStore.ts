import { create } from 'zustand';
import { fetchApi } from '../lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  hydrate: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  setAuth: (user, accessToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ user, accessToken });
  },
  hydrate: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;

    try {
      const response = await fetchApi('/api/v1/users/me');
      const profile = response.data;
      set({
        accessToken: token,
        user: {
          ...profile,
          roles: profile.roles?.map((entry: any) => typeof entry === 'string' ? entry : entry.role?.name || entry) || [],
          permissions: profile.permissions || [],
        },
      });
    } catch {
      localStorage.removeItem('accessToken');
      set({ accessToken: null, user: null });
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    set({ user: null, accessToken: null });
  },
}));
