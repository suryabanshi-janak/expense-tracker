export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          parent_id: string | null;
          slug: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: number;
          category_id: string;
          created_at: string;
          description: string;
          id: string;
          payment_date: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id: string;
          created_at?: string;
          description: string;
          id?: string;
          payment_date: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          amount?: number;
          category_id?: string;
          created_at?: string;
          description?: string;
          id?: string;
          payment_date?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'expenses_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };
      incomes: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          id: string;
          income_date: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          id?: string;
          income_date: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          id?: string;
          income_date?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      loans: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          id: string;
          loan_date: string;
          loan_transaction_type: Database['public']['Enums']['loan_transaction_type_enum'];
          payee_payor: string;
          status: Database['public']['Enums']['loan_status_enum'];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          id?: string;
          loan_date: string;
          loan_transaction_type: Database['public']['Enums']['loan_transaction_type_enum'];
          payee_payor: string;
          status: Database['public']['Enums']['loan_status_enum'];
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          id?: string;
          loan_date?: string;
          loan_transaction_type?: Database['public']['Enums']['loan_transaction_type_enum'];
          payee_payor?: string;
          status?: Database['public']['Enums']['loan_status_enum'];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      saving_institutions: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      savings: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          id: string;
          institution: string;
          saving_date: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          id?: string;
          institution: string;
          saving_date: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          id?: string;
          institution?: string;
          saving_date?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'savings_institution_fkey';
            columns: ['institution'];
            referencedRelation: 'saving_institutions';
            referencedColumns: ['id'];
          }
        ];
      };
      transactions: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          expense_id: string | null;
          id: string;
          income_id: string | null;
          loan_id: string | null;
          saving_id: string | null;
          transaction_date: string;
          transaction_type: Database['public']['Enums']['transaction_type_enum'];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          expense_id?: string | null;
          id?: string;
          income_id?: string | null;
          loan_id?: string | null;
          saving_id?: string | null;
          transaction_date: string;
          transaction_type?: Database['public']['Enums']['transaction_type_enum'];
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          expense_id?: string | null;
          id?: string;
          income_id?: string | null;
          loan_id?: string | null;
          saving_id?: string | null;
          transaction_date?: string;
          transaction_type?: Database['public']['Enums']['transaction_type_enum'];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_expense_id_fkey';
            columns: ['expense_id'];
            referencedRelation: 'expenses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_income_id_fkey';
            columns: ['income_id'];
            referencedRelation: 'incomes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_loan_id_fkey';
            columns: ['loan_id'];
            referencedRelation: 'loans';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_saving_id_fkey';
            columns: ['saving_id'];
            referencedRelation: 'savings';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      counter_party_enum: 'Lender' | 'Borrower';
      loan_status_enum: 'Pending' | 'Paid' | 'Defaulted';
      loan_transaction_type_enum: 'Lend' | 'Borrow';
      transaction_type_enum: 'Expense' | 'Income' | 'Saving' | 'Loan';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
