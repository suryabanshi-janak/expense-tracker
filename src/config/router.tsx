import { createBrowserRouter } from 'react-router-dom';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import MainLayout from '@/components/MainLayout';
import Transaction from '@/pages/Transaction';
import Income from '@/pages/income/Income';
import Saving from '@/pages/Saving';
import Category from '@/pages/category/Category';
import CreateCategory from '@/pages/category/CreateCategory';
import Lending from '@/pages/Lending';
import Expense from '@/pages/expense/Expense';
import CreateExpense from '@/pages/expense/CreateExpense';
import CreateIncome from '@/pages/income/CreateIncome';

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
      { path: '/savings', element: <Saving /> },
      {
        path: '/categories',
        children: [
          { index: true, element: <Category /> },
          { path: 'create', element: <CreateCategory /> },
        ],
      },
      { path: '/lendings', element: <Lending /> },
    ],
  },
]);
