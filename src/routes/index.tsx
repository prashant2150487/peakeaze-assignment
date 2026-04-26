
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BaseLayout from '../component/layout/baseLayout';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import InvoicesPage from '../pages/invoices';
import InvoiceDetail from '../pages/invoices/InvoiceDetail';
import { RootState } from '../store';

function ProtectedRoute(): JSX.Element {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppRoutes(): JSX.Element {
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
