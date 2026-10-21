'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

function setSessionCookie(user: User | null) {
  if (typeof document === 'undefined') return;
  if (!user) {
    document.cookie = 'helpdesk_session=; path=/; max-age=0; SameSite=Lax';
  } else {
    const sessionData = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      })
    );
    document.cookie = `helpdesk_session=${sessionData}; path=/; max-age=86400; SameSite=Lax`;
  }
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => {
        setSessionCookie(user);
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        setSessionCookie(null);
        set({ user: null, isAuthenticated: false });
      },
      updateCurrentUser: (updates: Partial<User>) => {
        set((state) => {
          if (!state.user) return state;
          const updated = { ...state.user, ...updates };
          setSessionCookie(updated);
          return { user: updated };
        });
      },
    }),
    {
      name: 'helpdesk_session_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          setSessionCookie(state.user);
        }
      },
    }
  )
);
