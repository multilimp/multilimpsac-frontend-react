import { Skeleton, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';

const ProviderOrdersTableSkeleton = () => {
  return (
    <Box sx={{ 
      bgcolor: '#ffffff', 
      borderRadius: 2, 
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                <Skeleton variant="text" width={60} height={24} sx={{ bgcolor: '#cbd5e1' }} />
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: '#cbd5e1' }} />
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: '#cbd5e1' }} />
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                <Skeleton variant="text" width={120} height={24} sx={{ bgcolor: '#cbd5e1' }} />
              </TableCell>
              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                <Skeleton variant="text" width={80} height={24} sx={{ bgcolor: '#cbd5e1' }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((index) => (
              <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: '#e2e8f0' }} />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: '#e2e8f0' }} />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: '#e2e8f0' }} />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: '#e2e8f0' }} />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                  <Skeleton variant="rectangular" width={40} height={32} sx={{ borderRadius: 1, bgcolor: '#e2e8f0' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProviderOrdersTableSkeleton;
