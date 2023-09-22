import { create } from 'zustand';
import { Expense } from '@/types/collection';
import { devtools, persist } from 'zustand/middleware';

interface ExpenseStore {
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  devtools(
    persist(
      (set) => ({
        expenses: [],
        setExpenses: (expenses: Expense[]) => set({ expenses }),
      }),
      { name: 'expenses' }
    )
  )
);
