
import { Form, DatePicker, Input } from 'antd';
import { Box, Typography } from '@mui/material';

const { TextArea } = Input;

const SaleAdditionalInfo = () => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        Información Adicional
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Form.Item
            name="formalDate"
            label="Fecha Formal"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Seleccione la fecha formal" />
          </Form.Item>
        </Box>
        
        <Box>
          <Form.Item
            name="deliveryDate"
            label="Fecha de Entrega"
          >
            <DatePicker style={{ width: '100%' }} placeholder="Seleccione fecha de entrega" />
          </Form.Item>
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Form.Item
          name="observations"
          label="Observaciones"
        >
          <TextArea 
            rows={4} 
            placeholder="Ingrese cualquier observación relevante"
            style={{ resize: 'none' }}
          />
        </Form.Item>
      </Box>
    </Box>
  );
};

export default SaleAdditionalInfo;
