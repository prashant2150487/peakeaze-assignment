import type React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { describe, expect, it } from 'vitest';
import { Root } from '../Root';
import { theme } from '../theme';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('Root', () => {
  it('renders the invoice management heading', () => {
    renderWithTheme(<Root />);
    expect(screen.getByText(/Invoice Management/i)).toBeInTheDocument();
  });
});
