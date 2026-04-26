import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import invoiceService, { Invoice } from '../../../api/invoiceService';

interface DeleteInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onDeleted: () => void;
}

const DeleteInvoiceModal: React.FC<DeleteInvoiceModalProps> = ({ open, onClose, invoice, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!invoice) return;
    try {
      setLoading(true);
      setError(null);
      await invoiceService.deleteInvoice(invoice.id);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Box 
          sx={{ 
            backgroundColor: '#fee2e2', 
            borderRadius: '50%', 
            p: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <DeleteOutlineIcon sx={{ color: '#dc2626' }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">Delete Invoice</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          Are you sure you want to delete invoice <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{invoice?.invoiceNumber}</Box>? This action cannot be undone.
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1, backgroundColor: '#fef2f2', p: 1.5, borderRadius: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ 
            color: '#64748b', 
            textTransform: 'none', 
            fontWeight: 600,
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleDelete}
          disabled={loading}
          sx={{ 
            backgroundColor: '#dc2626', 
            '&:hover': { backgroundColor: '#b91c1c' }, 
            borderRadius: 2.5, 
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 4px 6px -1px rgb(220 38 38 / 0.1), 0 2px 4px -2px rgb(220 38 38 / 0.1)'
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Deleting...' : 'Delete Invoice'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteInvoiceModal;
