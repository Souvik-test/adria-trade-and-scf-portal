
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('AuthGuard - Loading:', loading, 'User:', user?.user_id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-corporate-teal-600 mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Loading Dashboard...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we prepare your workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('AuthGuard - No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('AuthGuard - User authenticated, rendering children');
  return <>{children}</>;
};

export default AuthGuard;
