
import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import authReducer from '../../store/slices/authSlice';
import { theme } from '../../theme';

const rootReducer = combineReducers({
  auth: authReducer,
});

/** Build a fresh store so tests are fully isolated from one another. */
export function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type TestStore = ReturnType<typeof createTestStore>;

interface RenderConfig extends RenderOptions {
  preloadedState?: Partial<RootState>;
  store?: TestStore;
  routerProps?: MemoryRouterProps;
}


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
