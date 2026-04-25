import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BaseLayout from './component/layout/baseLayout';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import InvoicesPage from './pages/invoices';
import InvoiceDetail from './pages/invoices/detail';
import { RootState } from './store';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<InvoicesPage />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
