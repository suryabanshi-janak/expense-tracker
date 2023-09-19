import { Database } from './supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Income = Database['public']['Tables']['incomes']['Row'];
