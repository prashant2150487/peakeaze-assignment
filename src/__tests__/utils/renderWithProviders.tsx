/**
 * renderWithProviders — wraps a component in Redux store + Router + MUI Theme.
 * Import this in every test file instead of @testing-library/react's render.
 */
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import authReducer from '../../store/slices/authSlice';
import { theme } from '../../theme';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a fresh store so tests are fully isolated from one another. */
export function createTestStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;

interface RenderConfig extends RenderOptions {
  preloadedState?: PreloadedState<RootState>;
  store?: TestStore;
  routerProps?: MemoryRouterProps;
}

/**
 * Renders `ui` inside:
 *  • Redux <Provider> with an isolated store (or a custom one you pass in)
 *  • React Router <MemoryRouter> (set `routerProps.initialEntries` to mock the URL)
 *  • MUI <ThemeProvider>
 *
 * Returns everything from RTL's `render` plus the store for dispatch assertions.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    routerProps,
    ...renderOptions
  }: RenderConfig = {}
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <Provider store={store}>
        <MemoryRouter
          initialEntries={routerProps?.initialEntries}
          initialIndex={routerProps?.initialIndex}
        >
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper as React.ComponentType, ...renderOptions }) };
}
