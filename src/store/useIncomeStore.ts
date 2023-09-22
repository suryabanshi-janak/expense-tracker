import { create } from 'zustand';
import { Income } from '@/types/collection';
import { devtools, persist } from 'zustand/middleware';

interface IncomeStore {
  incomes: Income[];
  setIncomes: (incomes: Income[]) => void;
}

export const useIncomeStore = create<IncomeStore>()(
  devtools(
    persist(
      (set) => ({
        incomes: [],
        setIncomes: (incomes: Income[]) => set({ incomes }),
      }),
      { name: 'incomes' }
    )
  )
);
