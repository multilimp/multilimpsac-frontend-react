
import { Form, Select, DatePicker, Input } from 'antd';
import { Box, Typography } from '@mui/material';
import { ClientProps } from '@/services/clients/client';
import dayjs from 'dayjs';
import { useState } from 'react';

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
  const [selectedClient, setSelectedClient] = useState<ClientProps | null>(null);

  // Get form instance from context
  const formInstance = Form.useFormInstance();
  
  // Listen to client selection changes
  const handleClientChange = (value: string) => {
    const client = clients.find(c => c.razon_social === value);
    setSelectedClient(client || null);
    
    // Set RUC automatically when client changes
    if (client) {
      formInstance.setFieldsValue({ clientRuc: client.ruc });
    } else {
      formInstance.setFieldsValue({ clientRuc: '' });
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        Información Principal
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
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
              onChange={handleClientChange}
              options={clients.map(client => ({
                value: client.razon_social,
                label: `${client.razon_social} (${client.ruc})`
              }))}
            />
          </Form.Item>
        </Box>
        
        <Box>
          <Form.Item
            name="clientRuc"
            label="RUC Cliente"
            rules={[
              { required: true, message: 'Este campo es obligatorio' },
              { pattern: /^\d{11}$/, message: 'El RUC debe tener 11 dígitos' }
            ]}
          >
            <Input placeholder="RUC del cliente" maxLength={11} />
          </Form.Item>
        </Box>

        <Box>
          <Form.Item
            name="date"
            label="Fecha"
            rules={[{ required: true, message: 'Seleccione una fecha' }]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Box>
        
        <Box>
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
        </Box>

        <Box>
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
        </Box>
      </Box>
    </Box>
  );
};

export default SaleFormHeader;
