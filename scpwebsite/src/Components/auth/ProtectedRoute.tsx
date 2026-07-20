import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { routes, RouteConfig } from '@/config/routes';
import { usePermissions } from '@/Hooks/use-security';
import { useSnackbar } from '@/contexts/SnackbarContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const findRouteByPath = (
  routes: RouteConfig[],
  path: string
): RouteConfig | null => {
  for (const route of routes) {
    if (route.route === path) return route;
    if (route.childs) {
      const found = findRouteByPath(route.childs, path);
      if (found) return found;
    }
  }
  return null;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { warning } = useSnackbar();
  const { data: prohibitedAccess } = usePermissions(user?.groupCode, !!user);
  const location = useLocation();

  const currentRouteConfig = findRouteByPath(routes, location.pathname);
  const isProhibited = currentRouteConfig?.permission && prohibitedAccess?.includes(currentRouteConfig.permission);

  useEffect(() => {
    if (isProhibited) {
      warning('You do not have permission to access this section.');
    }
  }, [isProhibited]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isProhibited) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
