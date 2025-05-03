import { BillingProps } from '@/services/billings/billings.d';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

interface BillingsModalProps {
  data?: BillingProps | null;
  open: boolean;
  onClose: () => void;
}

const BillingsModal = ({ data = null, open, onClose }: BillingsModalProps) => {
  const [form] = Form.useForm();

  const initialValues = data ? {
    ...data,
    registerDate: data.registerDate ? dayjs(data.registerDate) : null,
    invoiceDate: data.invoiceDate ? dayjs(data.invoiceDate) : null
  } : {};

  return (
    <Dialog open={open} fullWidth maxWidth="lg" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Factura</DialogTitle>
      <DialogContent dividers>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="saleId" label="ID Venta">
              <input className="ant-input" />
            </Form.Item>

            <Form.Item name="clientRuc" label="RUC Cliente">
              <input className="ant-input" />
            </Form.Item>

            <Form.Item name="clientBusinessName" label="Razón Social Cliente">
              <input className="ant-input" />
            </Form.Item>

            <Form.Item name="contact" label="Contacto">
              <input className="ant-input" />
            </Form.Item>

            <Form.Item name="registerDate" label="Fecha Registro">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="saleAmount" label="Monto Venta">
              <input type="number" className="ant-input" />
            </Form.Item>

            <Form.Item name="invoiceNumber" label="N° Factura">
              <input className="ant-input" />
            </Form.Item>

            <Form.Item name="invoiceDate" label="Fecha Factura">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => form.submit()}
        >
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingsModal;