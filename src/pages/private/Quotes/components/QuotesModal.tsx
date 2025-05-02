
import { QuoteProps } from '@/services/quotes/quotes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Typography, Grid, Divider } from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { useState } from 'react';
import { Form } from 'antd';
import InputAntd from '@/components/InputAntd';

interface QuotesModalProps {
  data: QuoteProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuotesModal = ({ data, open, onClose, onSuccess }: QuotesModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await form.validateFields();
      // Logic to save would go here
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      fullWidth 
      maxWidth="md" 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={600}>
            {data ? 'Editar Cotización' : 'Nueva Cotización'}
          </Typography>
          <Button variant="text" color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Form form={form} layout="vertical" initialValues={data || {}}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Form.Item 
                name="quoteNumber" 
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <InputAntd label="N° Cotización" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={6}>
              <Form.Item 
                name="date"
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <InputAntd label="Fecha" type="date" />
              </Form.Item>
            </Grid>
            <Grid item xs={12}>
              <Form.Item 
                name="client"
                rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              >
                <InputAntd label="Cliente" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={6}>
              <Form.Item name="total">
                <InputAntd label="Total" type="number" />
              </Form.Item>
            </Grid>
            <Grid item xs={12} md={6}>
              <Form.Item name="status">
                <InputAntd label="Estado" />
              </Form.Item>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose} 
          disabled={loading}
          startIcon={<Close />}
        >
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading}
          startIcon={<Save />}
        >
          {data ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuotesModal;
