import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../header';
import authService from '../../api/authService';
import { setUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';

function BaseLayout(): JSX.Element {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !user) {
        try {
          const userData = await authService.getMe();
          dispatch(setUser(userData));
        } catch (err) {
          // Silently fail - user will be redirected if needed
        }
      }
    };
    fetchUser();
  }, [isAuthenticated, user, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default BaseLayout;
