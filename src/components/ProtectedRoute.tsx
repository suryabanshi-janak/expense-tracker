import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuth';

export default function ProtectedRoute() {
  const userSession = useAuthStore((state) => state.auth?.session);

  if (!userSession?.access_token) return <Navigate to='/login' />;

  return <Outlet />;
}
