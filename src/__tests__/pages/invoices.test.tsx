
import { screen, waitFor} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InvoicesPage from '../../pages/invoices';
import { renderWithProviders } from '../utils/renderWithProviders';
import invoiceService from '../../api/invoiceService';

// Mock the service
vi.mock('../../api/invoiceService', () => ({
  default: {
    getInvoices: vi.fn(),
    createInvoice: vi.fn(),
    updateInvoice: vi.fn(),
    deleteInvoice: vi.fn(),
  },
}));

const mockInvoices = {
  items: [
    {
      id: 'inv_1',
      invoiceNumber: 'INV-001',
      customerName: 'Customer A',
      amount: 1000,
      status: 'Draft',
      createdAt: Date.now(),
    },
    {
      id: 'inv_2',
      invoiceNumber: 'INV-002',
      customerName: 'Customer B',
      amount: 2000,
      status: 'Paid',
      createdAt: Date.now() - 10000,
    },
  ],
  totalCount: 2,
  page: 1,
  limit: 10,
};

describe('InvoicesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (invoiceService.getInvoices as vi.Mock).mockResolvedValue(mockInvoices);
  });

  it('renders invoices list correctly', async () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'admin@test.com', role: 'Admin', permissions: [], createdAt: 0 },
          token: 'token',
          refreshToken: 'refresh',
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    expect(screen.getByText('Invoices')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Customer A')).toBeInTheDocument();
      expect(screen.getByText('Customer B')).toBeInTheDocument();
      expect(screen.getByText('INV-001')).toBeInTheDocument();
      expect(screen.getByText('INV-002')).toBeInTheDocument();
    });
  });

  it('shows Create button for Admin', () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'admin@test.com', role: 'Admin', permissions: [], createdAt: 0 },
          token: 'token',
          isAuthenticated: true,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    expect(screen.getByText('Create Invoice')).toBeInTheDocument();
  });

  it('shows Create button for Accountant', () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'acc@test.com', role: 'Accountant', permissions: [], createdAt: 0 },
          token: 'token',
          isAuthenticated: true,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    expect(screen.getByText('Create Invoice')).toBeInTheDocument();
  });

  it('hides Create button for Viewer', () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'viewer@test.com', role: 'Viewer', permissions: [], createdAt: 0 },
          token: 'token',
          isAuthenticated: true,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    expect(screen.queryByText('Create Invoice')).not.toBeInTheDocument();
  });

  it('hides Delete button for Accountant', async () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'acc@test.com', role: 'Accountant', permissions: [], createdAt: 0 },
          token: 'token',
          isAuthenticated: true,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    await waitFor(() => {
      expect(screen.getByText('Customer A')).toBeInTheDocument();
    });

    // Tooltip for Delete should not be present (or button should not be present)
    // In our implementation, canDelete check hides the whole button
    expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument();
  });

  it('shows Delete button for Admin', async () => {
    renderWithProviders(<InvoicesPage />, {
      preloadedState: {
        auth: {
          user: { id: '1', email: 'admin@test.com', role: 'Admin', permissions: [], createdAt: 0 },
          token: 'token',
          isAuthenticated: true,
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    await waitFor(() => {
      expect(screen.getByText('Customer A')).toBeInTheDocument();
    });

    // We can't directly check the icon, but we can check if there are buttons with "Delete" tooltip
    // Or just look for the DeleteIcon by its name if MUI icons are mocked/available
    const deleteButtons = screen.queryAllByLabelText('Delete');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });
});
