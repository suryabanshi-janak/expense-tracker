import { createBrowserRouter } from 'react-router-dom';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import MainLayout from '@/components/MainLayout';
import Transaction from '@/pages/Transaction';
import Income from '@/pages/income/Income';
import Saving from '@/pages/saving/Saving';
import Category from '@/pages/category/Category';
import CreateCategory from '@/pages/category/CreateCategory';
import Loan from '@/pages/loan/Loan';
import Expense from '@/pages/expense/Expense';
import CreateExpense from '@/pages/expense/CreateExpense';
import CreateIncome from '@/pages/income/CreateIncome';
import CreateSaving from '@/pages/saving/CreateSaving';
import SavingInstitution from '@/pages/saving/institutions/SavingInstitution';
import CreateLoan from '@/pages/loan/CreateLoan';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/transactions', element: <Transaction /> },
      {
        path: '/incomes',
        children: [
          { index: true, element: <Income /> },
          { path: 'create', element: <CreateIncome /> },
        ],
      },
      {
        path: '/expenses',
        children: [
          { index: true, element: <Expense /> },
          { path: 'create', element: <CreateExpense /> },
        ],
      },
      {
        path: '/savings',
        children: [
          { index: true, element: <Saving /> },
          { path: 'create', element: <CreateSaving /> },
          { path: 'institutions', element: <SavingInstitution /> },
        ],
      },
      {
        path: '/categories',
        children: [
          { index: true, element: <Category /> },
          { path: 'create', element: <CreateCategory /> },
        ],
      },
      {
        path: '/loans',
        children: [
          { index: true, element: <Loan /> },
          { path: 'create', element: <CreateLoan /> },
        ],
      },
    ],
  },
]);
