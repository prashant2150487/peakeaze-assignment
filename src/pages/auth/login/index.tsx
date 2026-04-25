import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  InputAdornment,
  IconButton,
  CssBaseline,
  Alert,
} from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../../../api/authService';
import { setCredentials } from '../../../store/slices/authSlice';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const validate = (email: string, password: string) => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    const errors = validate(email, password);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    try {
      setLoading(true);
      const res = await authService.login(email, password);
      dispatch(setCredentials({ user: res.user, token: res.token, refreshToken: res.refreshToken }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', backgroundColor: '#F8F9FA' }}>
      <CssBaseline />
      
      {/* Left Side - Branding */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundColor: '#6b4ce6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          p: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 1 }}>
          <CenterFocusStrongIcon sx={{ fontSize: 32 }} />
          <Typography variant="h6" fontWeight="bold" letterSpacing={1}>EAZYCAPTURE</Typography>
        </Box>

        <Box sx={{ zIndex: 1, mt: -10 }}>
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, lineHeight: 1.2 }}>Accounting,</Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3, lineHeight: 1.2 }}>automated with Intelligence.</Typography>
          <Typography variant="body1" sx={{ maxWidth: 450, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            Transform your accounting practice with intelligent automation. Let AI handle the routine while you focus on what matters.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 6, zIndex: 1, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">98%</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Time saved on</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>data entry</Typography>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">500+</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Firms</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>transformed</Typography>
          </Box>
          <Box>
            <Typography variant="h5" fontWeight="bold">99.9%</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block' }}>Accuracy</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>rate</Typography>
          </Box>
        </Box>
      </Grid>

      {/* Right Side - Login Form */}
      <Grid item xs={12} sm={8} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 400, px: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#1a1a1a' }}>Welcome back</Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>Sign in to your account to continue</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>Email address</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="you@company.com"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              size="small"
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>Password</Typography>
              <Link href="#" variant="body2" sx={{ color: '#6b4ce6', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              variant="outlined"
              size="small"
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#fff' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#999', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" size="small">
                      {showPassword ? <VisibilityOff sx={{ color: '#999', fontSize: 20 }} /> : <Visibility sx={{ color: '#999', fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 1, mb: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontSize: '1rem', fontWeight: 600, backgroundColor: '#6b4ce6', boxShadow: 'none', '&:hover': { backgroundColor: '#5a3ed6', boxShadow: 'none' } }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Typography variant="body2" align="center" sx={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link component="button" variant="body2" onClick={() => navigate('/register')} sx={{ color: '#6b4ce6', textDecoration: 'none', fontWeight: 600, verticalAlign: 'baseline' }}>
                Create one
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
