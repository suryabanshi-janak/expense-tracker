import { Category } from './collection';

export interface CategoryWithSubCategory extends Category {
  subcategories: Category[];
}

export enum TransactionType {
  LOAN = 'Loan',
  EXPENSE = 'Expense',
  INCOME = 'Income',
  SAVING = 'Saving',
}

export enum LoanStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  DEFAULTED = 'Defaulted',
}

export enum LoanTransactionType {
  LEND = 'Lend',
  BORROW = 'Borrow',
}
