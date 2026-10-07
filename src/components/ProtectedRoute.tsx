import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { clearSecureSession, createSecureSession } from '../utils/security';
import { api } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'admin';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    let active = true;
    api.getMe()
      .then(({ user }) => {
        if (!active || user.role !== 'admin' || (allowedRole && user.role !== allowedRole)) {
          if (active) setStatus('unauthorized');
          return;
        }
        createSecureSession(user.associatedId || user.userId, user.role, user.email);
        setStatus('authorized');
      })
      .catch(() => {
        clearSecureSession();
        if (active) setStatus('unauthorized');
      });
    return () => { active = false; };
  }, [allowedRole]);

  if (status === 'checking') {
    return <div role="status" className="min-h-screen grid place-items-center text-sm font-semibold text-slate-600">Validating admin session…</div>;
  }

  if (status === 'unauthorized') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
