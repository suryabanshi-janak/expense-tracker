import { createBrowserRouter } from 'react-router-dom';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import MainLayout from '@/components/MainLayout';
import Transaction from '@/pages/Transaction';
import Income from '@/pages/Income';
import Expense from '@/pages/expense/Expense';
import Saving from '@/pages/Saving';
import Category from '@/pages/category/Category';
import CreateCategory from '@/pages/category/CreateCategory';
import Lending from '@/pages/Lending';

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
      { path: '/income', element: <Income /> },
      { path: '/expenses', element: <Expense /> },
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
