import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BaseLayout from '../component/layout/baseLayout';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import InvoicesPage from '../pages/invoices';
import InvoiceDetail from '../pages/invoices/detail';
import { RootState } from '../store';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<InvoicesPage />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
