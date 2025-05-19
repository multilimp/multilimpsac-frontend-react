// src/pages/private/TrackingsOrders/components/TrackingsOrdersForm.tsx
import React from 'react';
import { Form, DatePicker } from 'antd';
import InputFile from '@/components/InputFile';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography, Box } from '@mui/material';

interface Props {
  onSubmit: (values: {
    deliveryDateOC: string;
    oceFile: File;
    peruPurchasesDate: string;
  }) => void;
}

const TrackingsOrdersForm: React.FC<Props> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const submit = (vals: any) =>
    onSubmit({
      deliveryDateOC: vals.deliveryDateOC.toISOString(),
      oceFile: vals.oceFile,
      peruPurchasesDate: vals.peruPurchasesDate.toISOString(),
    });

  return (
    <Form form={form} layout="vertical" onFinish={submit}>
      <Typography
        variant="h6"
        align="center"
        sx={{ fontWeight: 700, mb: 3 }}
      >
        OC CONFORME
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        {/* FECHA DE ENTREGA OC */}
        <Grid xs={12} sm={4}>
          <Form.Item
            name="deliveryDateOC"
            label="FECHA DE ENTREGA OC"
            rules={[{ required: true, message: 'Selecciona fecha' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="-- Seleccionar fecha --"
            />
          </Form.Item>
        </Grid>
        {/* SUBIR ARCHIVO */}
        <Grid xs={12} sm={4}>
          <Form.Item
            name="oceFile"
            label="Subir Archivo"
            rules={[{ required: true, message: 'Selecciona un PDF' }]}
          >
            <InputFile
              label="Subir archivo"
              accept=".pdf"
              onChange={(file) => form.setFieldValue('oceFile', file)}
            />
          </Form.Item>
        </Grid>
        {/* FECHA PERÚ COMPRAS */}
        <Grid xs={12} sm={4}>
          <Form.Item
            name="peruPurchasesDate"
            label="FECHA PERÚ COMPRAS"
            rules={[{ required: true, message: 'Selecciona fecha' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="-- Seleccionar fecha --"
            />
          </Form.Item>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'right', mt: 4 }}>
        <Button type="submit" variant="contained" color="primary">
          Procesar
        </Button>
      </Box>
    </Form>
  );
};

export default TrackingsOrdersForm;
