import React from 'react';
import {
  TableRow,
  TableCell,
  Skeleton,
  Box,
} from '@mui/material';

interface InvoiceTableSkeletonProps {
  rows?: number;
}

const InvoiceTableSkeleton: React.FC<InvoiceTableSkeletonProps> = ({ rows = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton variant="text" width="60%" height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="80%" height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="40%" height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1.5 }} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="50%" height={24} />
          </TableCell>
          <TableCell align="right">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default InvoiceTableSkeleton;
