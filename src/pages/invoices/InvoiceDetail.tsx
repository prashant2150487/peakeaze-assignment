import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import invoiceService, { Invoice } from '../../api/invoiceService';
import InvoiceDetailSkeleton from './InvoiceDetailSkeleton';

const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'> = {
  Draft: 'default',
  Sent: 'info',
  Paid: 'success',
};

function InvoiceDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await invoiceService.getInvoiceById(id);
        setInvoice(data);
      } catch (detailErr: unknown) {
        const detailError = detailErr as { response?: { data?: { error?: string } } };
        setError(detailError.response?.data?.error || 'Invoice not found');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return <InvoiceDetailSkeleton />;
  }

  if (error || !invoice) {
    return (
      <Box sx={{ p: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>Back to Invoices</Button>
        <Alert severity="error">{error || 'Something went wrong'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: '0 auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 4, textTransform: 'none', fontWeight: 600, color: '#666' }}
      >
        Back to Invoices
      </Button>

      <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Invoice {invoice.invoiceNumber}
            </Typography>
            <Chip
              label={invoice.status}
              color={statusColors[invoice.status]}
              sx={{ fontWeight: 600, px: 1 }}
            />
          </Box>
          <ReceiptIcon sx={{ fontSize: 60, color: '#6b4ce6', opacity: 0.2 }} />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(107, 76, 230, 0.1)', color: '#6b4ce6' }}>
                <PersonIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                  Customer Name
                </Typography>
                <Typography variant="h6" fontWeight="bold">{invoice.customerName}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(107, 76, 230, 0.1)', color: '#6b4ce6' }}>
                <CalendarTodayIcon />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontWeight: 600, textTransform: 'uppercase' }}>
                  Date Created
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {new Date(invoice.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 4, borderRadius: 3, backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon sx={{ color: '#6b4ce6' }} />
                <Typography variant="h5" fontWeight="bold">Total Amount</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#6b4ce6' }}>
                ${invoice.amount.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Thank you for your business! If you have any questions about this invoice, please contact us.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default InvoiceDetail;
