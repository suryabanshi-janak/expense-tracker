import { Loan } from '@/types/collection';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface LoanStore {
  loans: Loan[];
  setLoans: (loans: Loan[]) => void;
}

export const useLoanStore = create<LoanStore>()(
  devtools(
    persist(
      (set) => ({
        loans: [],
        setLoans: (loans: Loan[]) => set({ loans }),
      }),
      { name: 'loans' }
    )
  )
);
