// App.js
import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './Assets/css/PrintableContainer.css';

import LoginPage from './Components/LoginPage';
import NotFound from './ErrorPages/NotFound';
import ServerDown from './ErrorPages/ServerDown';
import Unauthorized from './ErrorPages/Unauthorized';
import CheckServerStatus from './CheckServerStatus';

import { SnackbarProvider } from './contexts/SnackbarContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/auth/ProtectedRoute';
import MainLayout from './Components/layout/MainLayout';
import { routes } from './config/routes';

const flattenRoutes = (items) =>
  items.flatMap((item) => [item, ...(item.childs ? flattenRoutes(item.childs) : [])]);

const flatRoutes = flattenRoutes(routes).filter((r) => r.component);

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <div style={{ height: '100%' }}>
          <BrowserRouter>
            <CheckServerStatus>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/server-down" element={<ServerDown />} />

                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  {flatRoutes.map((r) => (
                    <Route
                      key={r.key}
                      path={r.route.replace(/^\//, '')}
                      element={r.component}
                    />
                  ))}
                  <Route path="unauthorized" element={<Unauthorized />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </CheckServerStatus>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
