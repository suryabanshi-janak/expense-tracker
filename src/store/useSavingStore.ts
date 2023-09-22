import { create } from 'zustand';
import { Saving } from '@/types/collection';
import { devtools, persist } from 'zustand/middleware';

interface SavingStore {
  savings: Saving[];
  setSavings: (savings: Saving[]) => void;
}

export const useSavingStore = create<SavingStore>()(
  devtools(
    persist(
      (set) => ({
        savings: [],
        setSavings: (savings: Saving[]) => set({ savings }),
      }),
      { name: 'savings' }
    )
  )
);
