import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import { Loader2 } from 'lucide-react';

export const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs font-bold text-slate-500 tracking-wider">
          Restoring session...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/30 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
};
export default ProtectedLayout;
