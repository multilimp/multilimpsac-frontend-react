import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContent from '@/components/PageContent';
import { Button, Box, Typography, Grid } from '@mui/material';
import { Form } from 'antd';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputFile from '@/components/InputFile';

const TrackingsOrdersPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [form] = Form.useForm();

  const submit = (vals: Record<string, string>) => {
    console.log(vals);
  };

  return (
    <PageContent
      title={`Seguimiento #${trackingId}`}
      component={
        <Button component={Link} to="/tracking" variant="outlined">
          ← Volver a Seguimientos
        </Button>
      }
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Órdenes de Proveedores
      </Typography>
      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'grey.300',
          borderRadius: 1,
          py: 6,
          textAlign: 'center',
          color: 'text.secondary',
          mb: 4,
        }}
      >
        No hay órdenes de proveedores asociadas a este seguimiento.
      </Box>

      <Form form={form} layout="vertical" onFinish={submit}>
        <Typography variant="h6" align="center" sx={{ fontWeight: 700, mb: 3 }}>
          OC CONFORME
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="deliveryDateOC" label="FECHA DE ENTREGA OC" rules={[{ required: true, message: 'Selecciona fecha' }]}>
              <DatePickerAntd label="Fecga de entrega OC" />
            </Form.Item>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="oceFile" label="Subir Archivo" rules={[{ required: true, message: 'Selecciona un PDF' }]}>
              <InputFile label="Subir archivo" accept="pdf" onChange={(file) => form.setFieldValue('oceFile', file)} />
            </Form.Item>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Form.Item name="peruPurchasesDate" label="FECHA PERÚ COMPRAS" rules={[{ required: true, message: 'Selecciona fecha' }]}>
              <DatePickerAntd label="Fecha Perú COmpras" />
            </Form.Item>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'right', mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Procesar
          </Button>
        </Box>
      </Form>
    </PageContent>
  );
};

export default TrackingsOrdersPage;
