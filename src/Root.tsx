import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

export function Root() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
