
import { CotizacionProps, CreateCotizacionData, TipoPago, CotizacionEstado } from '@/types/cotizacion.types';
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
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectCompanies from '@/components/selects/SelectCompanies';
import SelectClients from '@/components/selects/SelectClients';
import DatePickerAntd from '@/components/DatePickerAnt';
import { createCotizacion, updateCotizacion } from '@/services/quotes/quotes.request';

interface QuotesModalProps {
  data: CotizacionProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const tiposPagoOptions = [
  { label: 'Contado', value: TipoPago.CONTADO },
  { label: 'Crédito', value: TipoPago.CREDITO },
  { label: 'Consignación', value: TipoPago.CONSIGNACION },
];

const estadosCotizacionOptions = [
  { label: 'Pendiente', value: CotizacionEstado.PENDIENTE },
  { label: 'Aceptada', value: CotizacionEstado.ACEPTADA },
  { label: 'Rechazada', value: CotizacionEstado.RECHAZADA },
];

const QuotesModal = ({ data, open, onClose, onSuccess }: QuotesModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        codigoCotizacion: data.codigoCotizacion,
        empresaId: data.empresaId,
        clienteId: data.clienteId,
        contactoClienteId: data.contactoClienteId,
        montoTotal: data.montoTotal,
        tipoPago: data.tipoPago,
        notaPago: data.notaPago,
        notaPedido: data.notaPedido,
        direccionEntrega: data.direccionEntrega,
        distritoEntrega: data.distritoEntrega,
        provinciaEntrega: data.provinciaEntrega,
        departamentoEntrega: data.departamentoEntrega,
        referenciaEntrega: data.referenciaEntrega,
        estado: data.estado,
        fechaCotizacion: data.fechaCotizacion,
        fechaEntrega: data.fechaEntrega,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const payload: CreateCotizacionData = {
        codigoCotizacion: values.codigoCotizacion,
        empresaId: values.empresaId,
        clienteId: values.clienteId,
        contactoClienteId: values.contactoClienteId,
        montoTotal: values.montoTotal,
        tipoPago: values.tipoPago,
        notaPago: values.notaPago,
        notaPedido: values.notaPedido,
        direccionEntrega: values.direccionEntrega,
        distritoEntrega: values.distritoEntrega,
        provinciaEntrega: values.provinciaEntrega,
        departamentoEntrega: values.departamentoEntrega,
        referenciaEntrega: values.referenciaEntrega,
        fechaCotizacion: values.fechaCotizacion,
        fechaEntrega: values.fechaEntrega,
      };

      if (data?.id) {
        await updateCotizacion(data.id, payload);
      } else {
        await createCotizacion(payload);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error guardando cotización:', error);
    } finally {
      setLoading(false);
    }
  };

  return (    <Dialog
      open={open}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      sx={{
        zIndex: 1300, // Más alto que el sidebar (1200)
        '& .MuiDialog-paper': {
          zIndex: 1300,
        },
        '& .MuiBackdrop-root': {
          zIndex: 1299,
        }
      }}
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
              name="codigoCotizacion"
              rules={[{ required: true, message: 'Código de cotización obligatorio' }]}
            >
              <InputAntd
                label="Código Cotización"
                placeholder="Ej. COT-00123"
              />
            </Form.Item>

            <Form.Item
              name="empresaId"
              rules={[{ required: true, message: 'Empresa obligatoria' }]}
            >
              <SelectCompanies
                label="Empresa"
                onChange={(_, option: any) => {
                  form.setFieldValue('empresaId', option?.optiondata?.id);
                }}
              />
            </Form.Item>

            <Form.Item
              name="clienteId"
              rules={[{ required: true, message: 'Cliente obligatorio' }]}
            >
              <SelectClients
                label="Cliente"
                onChange={(_, option: any) => {
                  form.setFieldValue('clienteId', option?.optiondata?.id);
                }}
              />
            </Form.Item>

            <Form.Item
              name="montoTotal"
              rules={[{ required: true, message: 'Monto total obligatorio' }]}
            >
              <InputAntd
                label="Monto Total (S/.)"
                type="number"
              />
            </Form.Item>

            <Form.Item
              name="tipoPago"
              rules={[{ required: true, message: 'Tipo de pago obligatorio' }]}
            >
              <SelectGeneric
                label="Tipo de Pago"
                options={tiposPagoOptions}
              />
            </Form.Item>

            <Form.Item
              name="estado"
              rules={[{ required: true, message: 'Estado obligatorio' }]}
            >
              <SelectGeneric
                label="Estado"
                options={estadosCotizacionOptions}
              />
            </Form.Item>

            <Form.Item
              name="fechaCotizacion"
              rules={[{ required: true, message: 'Fecha de cotización obligatoria' }]}
            >
              <DatePickerAntd
                label="Fecha Cotización"
                type="date"
              />
            </Form.Item>

            <Form.Item name="fechaEntrega">
              <DatePickerAntd
                label="Fecha de Entrega"
                type="date"
              />
            </Form.Item>

            <Form.Item name="direccionEntrega">
              <InputAntd label="Dirección de Entrega" />
            </Form.Item>

            <Form.Item name="distritoEntrega">
              <InputAntd label="Distrito de Entrega" />
            </Form.Item>

            <Form.Item name="provinciaEntrega">
              <InputAntd label="Provincia de Entrega" />
            </Form.Item>

            <Form.Item name="departamentoEntrega">
              <InputAntd label="Departamento de Entrega" />
            </Form.Item>

            <Form.Item name="referenciaEntrega">
              <InputAntd label="Referencia de Entrega" />
            </Form.Item>

            <Form.Item name="notaPago">
              <InputAntd label="Nota de Pago" type="textarea" />
            </Form.Item>

            <Form.Item name="notaPedido">
              <InputAntd label="Nota de Pedido" type="textarea" />
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
