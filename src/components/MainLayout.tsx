import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

import { Header } from './Header';

export default function MainLayout() {
  const userSession = useAuthStore((state) => state.auth?.session);

  if (!userSession?.access_token) return <Navigate to='/login' />;

  return (
    <div>
      <Header />
      <main className='container py-4 max-w-7xl'>
        <Outlet />
      </main>
    </div>
  );
}
