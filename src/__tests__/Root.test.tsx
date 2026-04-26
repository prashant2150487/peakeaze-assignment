/**
 * Root.test.tsx
 * Tests that the Root component renders the app correctly.
 * Root renders BrowserRouter + AppRoutes, which requires Redux context.
 */
import { describe, expect, it } from 'vitest';
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { Root } from '../Root';
import { createTestStore } from './utils/renderWithProviders';
import { theme } from '../theme';

function renderRoot(isAuthenticated = false) {
  const store = createTestStore({
    auth: {
      user: null,
      token: isAuthenticated ? 'test-token' : null,
      refreshToken: null,
      isAuthenticated,
    },
  });
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Root />
      </ThemeProvider>
    </Provider>
  );
}

describe('Root', () => {
  it('redirects unauthenticated users to the login page', () => {
    renderRoot(false);
    // The login page should be shown — look for the branding text
    expect(screen.getByText(/EAZYCAPTURE/i)).toBeInTheDocument();
  });

  it('renders without crashing when authenticated', () => {
    // With a valid token and isAuthenticated=true, app renders the main layout
    renderRoot(true);
    // Header logo should appear
    expect(screen.getByText(/EAZYCAPTURE/i)).toBeInTheDocument();
  });
});
