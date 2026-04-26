import {
  Box,
  Paper,
  Grid,
  Divider,
  Skeleton,
} from '@mui/material';

function InvoiceDetailSkeleton(): JSX.Element {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, margin: '0 auto' }}>
      {/* Back Button Skeleton */}
      <Skeleton variant="rectangular" width={150} height={32} sx={{ mb: 4, borderRadius: 1 }} />

      <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box sx={{ width: '60%' }}>
            {/* Title Skeleton */}
            <Skeleton variant="text" width="80%" height={60} />
            {/* Chip Skeleton */}
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1.5, mt: 1 }} />
          </Box>
          {/* Icon Skeleton */}
          <Skeleton variant="circular" width={60} height={60} />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="70%" height={32} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 2 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="70%" height={32} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 4, borderRadius: 3, backgroundColor: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '40%' }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width="100%" height={40} />
                </Box>
                <Skeleton variant="text" width="30%" height={60} />
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
          <Skeleton variant="text" width="80%" height={20} />
        </Box>
      </Paper>
    </Box>
  );
}

export default InvoiceDetailSkeleton;
