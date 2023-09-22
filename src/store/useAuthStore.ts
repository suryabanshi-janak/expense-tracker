import { type User, type Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface UserAuth {
  user: User;
  session: Session;
}

interface AuthStoreProps {
  auth: UserAuth | null;
  setAuth: (auth: UserAuth | null) => void;
}

export const useAuthStore = create<AuthStoreProps>()(
  devtools(
    persist(
      (set) => ({
        auth: null,
        setAuth: (auth: UserAuth | null) => set({ auth }),
      }),
      { name: 'auth' }
    )
  )
);
