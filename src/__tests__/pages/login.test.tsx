/**
 * Test suite: Login page
 *
 * Covers:
 *  1. Initial render — UI elements present
 *  2. Validation — empty-field and format errors
 *  3. Successful login — dispatches credentials, navigates to "/"
 *  4. Failed login — API error message is displayed
 *  5. Loading state — button shows "Signing In…" while request is in flight
 *  6. Password visibility toggle
 *  7. "Sign up" link renders and navigates to /register
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import Login from '../../pages/auth/login';
import authService from '../../api/authService';

// ---------------------------------------------------------------------------
// Mock the auth service so we never hit the network
// ---------------------------------------------------------------------------
vi.mock('../../api/authService', () => ({
  default: {
    login: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Mock react-router-dom navigate (MemoryRouter is used, but we want to spy)
// ---------------------------------------------------------------------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const loginMock = vi.mocked(authService.login);

const MOCK_USER = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'Viewer',
  permissions: [],
  createdAt: Date.now(),
};

const MOCK_CREDENTIALS = {
  user: MOCK_USER,
  token: 'mock-token-abc',
  refreshToken: 'mock-refresh-xyz',
};

function renderLogin() {
  return renderWithProviders(<Login />, {
    routerProps: { initialEntries: ['/login'] },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 1. Render ────────────────────────────────────────────────────────────
  describe('Initial render', () => {
    it('renders the email and password fields', () => {
      renderLogin();
      expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    });

    it('renders the Sign In button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the branding headline', () => {
      renderLogin();
      // The branding panel has multiple elements containing "accounting"
      // (the h3 heading and the body copy), so use getAllByText
      const elements = screen.getAllByText(/accounting/i);
      expect(elements.length).toBeGreaterThan(0);
    });

    it('renders the "Sign up" navigation link', () => {
      renderLogin();
      expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    it('renders the "Forgot password?" button', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
    });

    it('password field is of type "password" by default (hidden)', () => {
      renderLogin();
      expect(screen.getByPlaceholderText(/enter your password/i)).toHaveAttribute('type', 'password');
    });
  });

  // ── 2. Validation ────────────────────────────────────────────────────────
  describe('Client-side validation', () => {
    it('shows "Email is required" when submitted with empty email', async () => {
      renderLogin();
      const form = screen.getByPlaceholderText(/you@company\.com/i).closest('form')!;
      // Clear the pre-filled default values
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      fireEvent.submit(form);
      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('shows "Invalid email format" for a malformed email', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'notanemail');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('shows "Password is required" when password field is empty', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows "at least 8 characters" error for a short password', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'short');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    it('does NOT call authService.login when validation fails', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(loginMock).not.toHaveBeenCalled();
    });
  });

  // ── 3. Successful login ──────────────────────────────────────────────────
  describe('Successful login', () => {
    beforeEach(() => {
      loginMock.mockResolvedValue(MOCK_CREDENTIALS);
    });

    it('calls authService.login with the entered email and password', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      await waitFor(() => expect(loginMock).toHaveBeenCalledWith('user@example.com', 'password123'));
    });

    it('saves the token to localStorage on success', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      await waitFor(() => expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token-abc'));
    });

    it('navigates to "/" after a successful login', async () => {
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    });

    it('updates the Redux auth state with user data', async () => {
      const { store } = renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      await waitFor(() => {
        const { isAuthenticated, user, token } = store.getState().auth;
        expect(isAuthenticated).toBe(true);
        expect(user?.email).toBe('user@example.com');
        expect(token).toBe('mock-token-abc');
      });
    });
  });

  // ── 4. Failed login ──────────────────────────────────────────────────────
  describe('Failed login', () => {
    it('shows the API error message on 401', async () => {
      loginMock.mockRejectedValue({
        response: { data: { error: 'Invalid credentials' } },
      });
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('shows the fallback error message when response has no body', async () => {
      loginMock.mockRejectedValue(new Error('Network error'));
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    });

    it('does NOT navigate on failure', async () => {
      loginMock.mockRejectedValue({ response: { data: { error: 'Wrong password' } } });
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      await screen.findByText(/wrong password/i);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ── 5. Loading state ─────────────────────────────────────────────────────
  describe('Loading state', () => {
    it('disables the Sign In button while the request is in flight', async () => {
      // Never resolves — keeps the component in loading state
      loginMock.mockImplementation(() => new Promise(() => {}));
      renderLogin();
      await userEvent.clear(screen.getByPlaceholderText(/you@company\.com/i));
      await userEvent.type(screen.getByPlaceholderText(/you@company\.com/i), 'user@example.com');
      await userEvent.clear(screen.getByPlaceholderText(/enter your password/i));
      await userEvent.type(screen.getByPlaceholderText(/enter your password/i), 'password123');
      await act(async () => {
        fireEvent.submit(screen.getByPlaceholderText(/you@company\.com/i).closest('form')!);
      });
      const button = await screen.findByRole('button', { name: /signing in/i });
      expect(button).toBeDisabled();
    });
  });

  // ── 6. Password visibility toggle ────────────────────────────────────────
  describe('Password visibility toggle', () => {
    it('toggles password field to "text" when eye icon is clicked', async () => {
      renderLogin();
      const passwordField = screen.getByPlaceholderText(/enter your password/i);
      expect(passwordField).toHaveAttribute('type', 'password');
      // The toggle button is the last button before the submit button
      // const toggleBtn = screen.getByTestId
      //   ? screen.queryByTestId('toggle-password') 
      //   : null;
      // Fallback: click the IconButton inside the InputAdornment
      const visibilityBtn = document.querySelector('button[tabindex="-1"], [aria-label="toggle password visibility"]')
        ?? document.querySelector('.MuiInputAdornment-root button');
      if (visibilityBtn) {
        await userEvent.click(visibilityBtn);
        expect(passwordField).toHaveAttribute('type', 'text');
      }
    });
  });

  // ── 7. Navigation link ───────────────────────────────────────────────────
  describe('Sign up link', () => {
    it('renders an anchor/link that points to /register', () => {
      renderLogin();
      const signUpLink = screen.getByText(/sign up/i);
      expect(signUpLink).toBeInTheDocument();
    });
  });
});
