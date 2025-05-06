
import { Form, Input, Select } from 'antd';
import { Box, Typography } from '@mui/material';

const SaleCompanyInfo = () => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
        Información de la Empresa
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Box>
          <Form.Item
            name="companyName"
            label="Razón Social de la Empresa"
            rules={[{ required: true, message: 'Este campo es obligatorio' }]}
          >
            <Input placeholder="Ingrese la razón social" />
          </Form.Item>
        </Box>
        
        <Box>
          <Form.Item
            name="companyRuc"
            label="RUC de la Empresa"
            rules={[
              { required: true, message: 'Este campo es obligatorio' },
              { pattern: /^\d{11}$/, message: 'El RUC debe tener 11 dígitos' }
            ]}
          >
            <Input placeholder="Ingrese el RUC" maxLength={11} />
          </Form.Item>
        </Box>
        
        <Box>
          <Form.Item
            name="contact"
            label="Contacto"
            rules={[{ required: false }]}
          >
            <Input placeholder="Nombre del contacto" />
          </Form.Item>
        </Box>
        
        <Box>
          <Form.Item
            name="catalog"
            label="Catálogo"
          >
            <Select
              placeholder="Seleccione un catálogo"
              options={[
                { value: 'cat1', label: 'Catálogo General' },
                { value: 'cat2', label: 'Catálogo Empresarial' },
                { value: 'cat3', label: 'Catálogo Especial' }
              ]}
              allowClear
            />
          </Form.Item>
        </Box>
      </Box>
    </Box>
  );
};

export default SaleCompanyInfo;
