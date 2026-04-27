import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  Alert,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import invoiceService, { Invoice } from '../../api/invoiceService';
import InvoiceTableSkeleton from './InvoiceTableSkeleton';
import useDebounce from '../../hooks/useDebounce';
import DeleteInvoiceModal from './DeleteInvoiceModal';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'> = {
  Draft: 'default',
  Sent: 'info',
  Paid: 'success',
};

function InvoicesPage(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'Admin';
  const isAccountant = user?.role === 'Accountant';
  const canCreateOrEdit = isAdmin || isAccountant;
  const canDelete = isAdmin;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const [openModal, setOpenModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [modalForm, setModalForm] = useState({ customerName: '', amount: '', status: 'Draft' });
  const [modalErrors, setModalErrors] = useState({ customerName: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getInvoices({ page, limit: 10, search: debouncedSearch, status: statusFilter });

      // Client-side sorting as required
      const statusOrder = { 'Draft': 1, 'Sent': 2, 'Paid': 3 };
      const sortedItems = [...data.items].sort((a, b) => {
        // First sort by status order
        const statusDiff = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        if (statusDiff !== 0) return statusDiff;

        // Then by creation time (newest first)
        return b.createdAt - a.createdAt;
      });

      setInvoices(sortedItems);
      setTotalPages(Math.ceil(data.totalCount / 10));
    } catch (invoiceErr: unknown) {
      const invoiceError = invoiceErr as { response?: { data?: { error?: string } } };
      setError(invoiceError.response?.data?.error || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleOpenModal = (invoice: Invoice | null = null) => {
    setModalErrors({ customerName: '', amount: '' });
    if (invoice) {
      setEditingInvoice(invoice);
      setModalForm({ customerName: invoice.customerName, amount: invoice.amount.toString(), status: invoice.status });
    } else {
      setEditingInvoice(null);
      setModalForm({ customerName: '', amount: '', status: 'Draft' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingInvoice(null);
    setModalErrors({ customerName: '', amount: '' });
  };

  const validateModal = () => {
    const errors = { customerName: '', amount: '' };
    let isValid = true;
    if (!modalForm.customerName.trim()) {
      errors.customerName = 'Customer name is required';
      isValid = false;
    }
    if (!modalForm.amount || parseFloat(modalForm.amount) <= 0) {
      errors.amount = 'Valid amount is required';
      isValid = false;
    }
    setModalErrors(errors);
    return isValid;
  };

  const handleModalSubmit = async () => {
    if (!validateModal()) return;

    try {
      setSubmitting(true);
      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice.id, {
          customerName: modalForm.customerName,
          amount: parseFloat(modalForm.amount),
          status: modalForm.status as 'Draft' | 'Sent' | 'Paid',
        });
      } else {
        await invoiceService.createInvoice({
          customerName: modalForm.customerName,
          amount: parseFloat(modalForm.amount),
        });
      }
      handleCloseModal();
      fetchInvoices();
    } catch (operErr: unknown) {
      const operError = operErr as { response?: { data?: { error?: string } } };
      const apiError = operError.response?.data?.error || 'Operation failed';
      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteModalOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">Invoices</Typography>
        {canCreateOrEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ backgroundColor: '#6b4ce6', '&:hover': { backgroundColor: '#5a3ed6' }, borderRadius: 2, textTransform: 'none' }}
          >
            Create Invoice
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', borderRadius: 2 }}>
        <TextField
          placeholder="Search by customer..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Sent">Sent</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
        </TextField>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: { xs: 700, sm: "100%" } }}>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Invoice #
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Customer
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                align="right"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && invoices.length === 0 && (
              <InvoiceTableSkeleton rows={10} />
            )}

            {!loading && invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    No invoices found
                  </Typography>

                  {canCreateOrEdit && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal()}
                      sx={{
                        borderColor: "#6b4ce6",
                        color: "#6b4ce6",
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      Create Your First Invoice
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )}

            {invoices.map((inv) => (
              <TableRow
                key={inv.id}
                hover
                onClick={() => navigate(`/invoices/${inv.id}`)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                  <RouterLink
                    to={`/invoices/${inv.id}`}
                    style={{
                      color: "#6b4ce6",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {inv.invoiceNumber}
                  </RouterLink>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {inv.customerName}
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  ${inv.amount.toLocaleString()}
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Chip
                    label={inv.status}
                    size="small"
                    color={statusColors[inv.status]}
                    sx={{ fontWeight: 600, borderRadius: 1.5 }}
                  />
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {new Date(inv.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      flexWrap: "nowrap",
                    }}
                  >
                    {canCreateOrEdit && (
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(inv);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {canDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(inv);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          sx={{ '& .Mui-selected': { backgroundColor: '#6b4ce6 !important' } }}
        />
      </Box>

      {/* Create/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              value={modalForm.customerName}
              onChange={(e) => setModalForm({ ...modalForm, customerName: e.target.value })}
              error={!!modalErrors.customerName}
              helperText={modalErrors.customerName}
            />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={modalForm.amount}
              onChange={(e) => setModalForm({ ...modalForm, amount: e.target.value })}
              error={!!modalErrors.amount}
              helperText={modalErrors.amount}
            />
            {editingInvoice && (
              <TextField
                select
                label="Status"
                fullWidth
                value={modalForm.status}
                onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
              >
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Sent" disabled={editingInvoice.status === 'Paid'}>Sent</MenuItem>
                <MenuItem value="Paid" disabled={editingInvoice.status === 'Draft'}>Paid</MenuItem>
              </TextField>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#666' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleModalSubmit}
            disabled={submitting}
            sx={{ backgroundColor: '#6b4ce6', '&:hover': { backgroundColor: '#5a3ed6' }, borderRadius: 2 }}
          >
            {submitting ? 'Saving...' : 'Save Invoice'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteInvoiceModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setInvoiceToDelete(null);
        }}
        invoice={invoiceToDelete}
        onDeleted={fetchInvoices}
      />
    </Box>
  );
};

export default InvoicesPage;
