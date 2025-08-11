'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { adminUser, isLoading, isAuthenticated, hasRole } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/admin/dashboard');
        return;
      }
    }
  }, [adminUser, isLoading, requiredRole, router, isAuthenticated, hasRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
