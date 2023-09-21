import { Database } from './supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Income = Database['public']['Tables']['incomes']['Row'];
export type Saving = Database['public']['Tables']['savings']['Row'];
export type SavingInstition =
  Database['public']['Tables']['saving_institutions']['Row'];
export type Loan = Database['public']['Tables']['loans']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
