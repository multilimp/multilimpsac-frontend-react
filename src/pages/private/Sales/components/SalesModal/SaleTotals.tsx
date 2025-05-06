
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '@/utils/functions';

interface SaleTotalsProps {
  total: number;
  tax: number;
}

const SaleTotals = ({ total, tax }: SaleTotalsProps) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Typography variant="body1">
        Subtotal: {formatCurrency(total - tax)}
      </Typography>
      <Typography variant="body1">
        IGV (18%): {formatCurrency(tax)}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Total: {formatCurrency(total)}
      </Typography>
    </Box>
  );
};

export default SaleTotals;
