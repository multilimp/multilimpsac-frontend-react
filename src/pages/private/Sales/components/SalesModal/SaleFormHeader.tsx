
import { Form, Select, DatePicker } from 'antd';
import { Grid as MuiGrid } from '@mui/material';
import { ClientProps } from '@/services/clients/client';
import dayjs from 'dayjs';

interface SaleFormHeaderProps {
  clients: ClientProps[];
}

const paymentMethods = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'credit', label: 'Crédito' },
  { value: 'transfer', label: 'Transferencia' }
];

const statusOptions = [
  { value: 'completed', label: 'Completado' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'refunded', label: 'Reembolsado' }
];

const SaleFormHeader = ({ clients }: SaleFormHeaderProps) => {
  return (
    <MuiGrid container spacing={2}>
      <MuiGrid xs={12} md={6}>
        <Form.Item
          name="client"
          label="Cliente"
          rules={[{ required: true, message: 'Seleccione un cliente' }]}
        >
          <Select
            placeholder="Seleccione un cliente"
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            options={clients.map(client => ({
              value: client.razon_social,
              label: `${client.razon_social} (${client.ruc})`
            }))}
          />
        </Form.Item>
      </MuiGrid>
      
      <MuiGrid xs={12} md={6}>
        <Form.Item
          name="date"
          label="Fecha"
          rules={[{ required: true, message: 'Seleccione una fecha' }]}
          initialValue={dayjs()}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </MuiGrid>

      <MuiGrid xs={12} md={6}>
        <Form.Item
          name="paymentMethod"
          label="Método de Pago"
          rules={[{ required: true, message: 'Seleccione el método de pago' }]}
        >
          <Select
            placeholder="Seleccione método de pago"
            style={{ width: '100%' }}
            options={paymentMethods}
          />
        </Form.Item>
      </MuiGrid>

      <MuiGrid xs={12} md={6}>
        <Form.Item
          name="status"
          label="Estado"
          rules={[{ required: true, message: 'Seleccione el estado' }]}
          initialValue="completed"
        >
          <Select
            placeholder="Seleccione el estado"
            style={{ width: '100%' }}
            options={statusOptions}
          />
        </Form.Item>
      </MuiGrid>
    </MuiGrid>
  );
};

export default SaleFormHeader;
