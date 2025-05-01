import { QuoteProps } from '@/services/quotes/quotes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface QuotesModalProps {
  data: QuoteProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuotesModal = ({ data, open, onClose, onSuccess }: QuotesModalProps) => {
  const handleSave = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      {/* Misma estructura que OrdersModal */}
    </Dialog>
  );
};

export default QuotesModal;