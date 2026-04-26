import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

function Header(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #eaeaea', backgroundColor: '#fff', top: 0, zIndex: 1100 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Side - Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
        >
          <CenterFocusStrongIcon sx={{ fontSize: 28, color: '#6b4ce6' }} />
          <Typography variant="h6" fontWeight="bold" letterSpacing={1} sx={{ color: '#1a1a1a' }}>
            EAZYCAPTURE
          </Typography>
        </Box>

        {/* Right Side - Auth Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                {user?.email}
              </Typography>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#6b4ce6',
                  color: '#6b4ce6',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#5a3ed6',
                    backgroundColor: 'rgba(107, 76, 230, 0.04)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#6b4ce6',
                boxShadow: 'none',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: '#5a3ed6',
                  boxShadow: 'none',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
