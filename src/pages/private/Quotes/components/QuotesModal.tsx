
import { QuoteProps } from '@/services/quotes/quotes';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { Close, Save } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { Form } from 'antd';
import InputAntd from '@/components/InputAntd';
import { createQuote, updateQuote } from '@/services/quotes/quotes.request';

interface QuotesModalProps {
  data: QuoteProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuotesModal = ({ data, open, onClose, onSuccess }: QuotesModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        quoteNumber: data.quoteNumber,
        ruc: data.ruc,
        razonSocial: data.razonSocial,
        departamento: data.departamento,
        plazaEntrega: data.plazaEntrega,
        date: data.date,
        total: data.total,
        status: data.status,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const payload: Omit<QuoteProps, 'id'> = {
        quoteNumber: values.quoteNumber,
        ruc: values.ruc,
        razonSocial: values.razonSocial,
        departamento: values.departamento,
        plazaEntrega: values.plazaEntrega,
        date: values.date,
        total: values.total,
        status: values.status,
      };

      if (data?.id) {
        await updateQuote(data.id, payload);
      } else {
        await createQuote(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error guardando cotización:', error);
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
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight={600}>
            {data ? 'Editar Cotización' : 'Nueva Cotización'}
          </Typography>
          <Button variant="text" color="inherit" onClick={onClose} sx={{ p: 1 }}>
            <Close />
          </Button>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Form form={form} layout="vertical" autoComplete="off">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Form.Item
              name="quoteNumber"
              rules={[{ required: true, message: 'Código de cotización obligatorio' }]}
            >
              <InputAntd
                label="Código Cotización"
                placeholder="Ej. COT-00123"
              />
            </Form.Item>

            <Form.Item
              name="ruc"
              rules={[{ required: true, message: 'RUC del cliente obligatorio' }]}
            >
              <InputAntd
                label="RUC Cliente"
                placeholder="Ej. 20601234567"
              />
            </Form.Item>

            <Form.Item
              name="razonSocial"
              rules={[{ required: true, message: 'Razón social obligatoria' }]}
            >
              <InputAntd label="Razón Social Cliente" />
            </Form.Item>

            <Form.Item
              name="departamento"
              rules={[{ required: true, message: 'Departamento obligatorio' }]}
            >
              <InputAntd label="Departamento" />
            </Form.Item>

            <Form.Item
              name="plazaEntrega"
              rules={[{ required: true, message: 'Plaza de entrega obligatoria' }]}
            >
              <InputAntd label="Plaza de Entrega" />
            </Form.Item>

            <Form.Item
              name="date"
              rules={[{ required: true, message: 'Fecha obligatorio' }]}
            >
              <InputAntd label="Fecha Cotización" type="date" />
            </Form.Item>

            <Form.Item
              name="total"
              rules={[{ required: true, message: 'Monto obligatorio' }]}
            >
              <InputAntd label="Monto (S/.)" type="number" />
            </Form.Item>

            <Form.Item
              name="status"
              rules={[{ required: true, message: 'Estado obligatorio' }]}
            >
              <InputAntd label="Estado" />
            </Form.Item>
          </Box>
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
