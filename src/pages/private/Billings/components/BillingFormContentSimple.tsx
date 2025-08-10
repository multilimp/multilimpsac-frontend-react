import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { notification, Spin, Form } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { SaleProps } from '@/services/sales/sales';
import { getBillingByOrdenCompraId, patchBilling } from '@/services/billings/billings.request';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';

interface BillingFormContentProps {
  sale: SaleProps;
}

interface BillingFormData {
  numeroFactura?: string;
  fechaFactura?: dayjs.Dayjs;
  grr?: string;
  porcentajeRetencion?: number;
  porcentajeDetraccion?: number;
  formaEnvioFactura?: string;
  estado?: string;
}

const BillingFormContentSimple = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, setFacturacionId] = useState<number | null>(null);

  useEffect(() => {
    loadExistingBilling();
  }, [sale.id]);

  const loadExistingBilling = async () => {
    try {
      setLoading(true);
      const billing = await getBillingByOrdenCompraId(sale.id);
      if (billing && billing.facturacionId) {
        setFacturacionId(billing.facturacionId);
        
        // Convertir fecha correctamente
        let fechaFactura = undefined;
        if (billing.fechaFactura) {
          try {
            fechaFactura = dayjs(billing.fechaFactura);
            if (!fechaFactura.isValid()) {
              fechaFactura = undefined;
            }
          } catch (error) {
            fechaFactura = undefined;
          }
        }
        
        form.setFieldsValue({
          numeroFactura: billing.factura || '',
          fechaFactura: fechaFactura,
          grr: billing.grr || '',
          porcentajeRetencion: billing.retencion || 0,
          porcentajeDetraccion: billing.detraccion || 0,
          formaEnvioFactura: billing.formaEnvioFactura || '',
          estado: billing.estadoFacturacion ? billing.estadoFacturacion.toString() : '1'
        });
      }
    } catch (error) {
      console.error('Error loading existing billing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!facturacionId) {
        notification.error({
          message: 'Error',
          description: 'No existe facturación para actualizar. Debe crear una nueva facturación primero.'
        });
        return;
      }

      const values = await form.validateFields();
      
      // Preparar solo los campos que han cambiado (PATCH)
      const updateData: any = {};
      
      if (values.numeroFactura) updateData.factura = values.numeroFactura;
      if (values.fechaFactura) updateData.fechaFactura = values.fechaFactura.toISOString();
      if (values.grr) updateData.grr = values.grr;
      if (values.porcentajeRetencion !== undefined) updateData.retencion = parseFloat(values.porcentajeRetencion);
      if (values.porcentajeDetraccion !== undefined) updateData.detraccion = parseFloat(values.porcentajeDetraccion);
      if (values.formaEnvioFactura) updateData.formaEnvioFactura = values.formaEnvioFactura;
      if (values.estado) updateData.estado = parseInt(values.estado);

      console.log('📤 PATCH Data:', updateData);

      await patchBilling(facturacionId, updateData);

      notification.success({
        message: 'Facturación actualizada',
        description: 'Los cambios se han guardado correctamente usando PATCH'
      });

      navigate('/billing');
    } catch (error) {
      console.error('Error saving billing:', error);
      notification.error({
        message: 'Error al guardar',
        description: error instanceof Error ? error.message : 'No se pudo actualizar la facturación'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} size="large">
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Card sx={{ mb: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#1e293b', fontWeight: 600 }}>
              Facturación - {sale.codigoVenta}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Cliente: {sale?.cliente?.razonSocial || 'N/A'} | RUC: {sale?.cliente?.ruc || 'N/A'}
            </Typography>
          </CardContent>
        </Card>

        {/* Formulario Simplificado */}
        <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pb: 2, borderBottom: '2px solid #667eea' }}>
              <ReceiptIcon sx={{ fontSize: 28, color: '#667eea', mr: 2 }} />
              <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 600 }}>
                DATOS DE FACTURACIÓN (PATCH)
              </Typography>
            </Box>

            <Form form={form} layout="vertical">
              <Grid container spacing={3}>
                {/* Número de Factura */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    Número de Factura
                  </Typography>
                  <Form.Item name="numeroFactura" style={{ marginBottom: 0 }}>
                    <InputAntd
                      placeholder="Ej: F001-00001234"
                      size="large"
                    />
                  </Form.Item>
                </Grid>

                {/* Fecha de Factura */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    Fecha de Factura
                  </Typography>
                  <Form.Item name="fechaFactura" style={{ marginBottom: 0 }}>
                    <DatePickerAntd
                      label=""
                      placeholder="Seleccionar fecha"
                    />
                  </Form.Item>
                </Grid>

                {/* GRR */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    GRR (Guía de Remisión)
                  </Typography>
                  <Form.Item name="grr" style={{ marginBottom: 0 }}>
                    <InputAntd
                      placeholder="Ej: T001-00001234"
                      size="large"
                    />
                  </Form.Item>
                </Grid>

                {/* Forma de Envío */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    Forma de Envío
                  </Typography>
                  <Form.Item name="formaEnvioFactura" style={{ marginBottom: 0 }}>
                    <InputAntd
                      placeholder="Ej: Correo electrónico, Físico"
                      size="large"
                    />
                  </Form.Item>
                </Grid>

                {/* Retención */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    Retención (%)
                  </Typography>
                  <Form.Item name="porcentajeRetencion" style={{ marginBottom: 0 }}>
                    <InputAntd
                      type="number"
                      placeholder="0.00"
                      size="large"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Grid>

                {/* Detracción */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography sx={{ color: '#374151', mb: 1, fontWeight: 500 }}>
                    Detracción (%)
                  </Typography>
                  <Form.Item name="porcentajeDetraccion" style={{ marginBottom: 0 }}>
                    <InputAntd
                      type="number"
                      placeholder="0.00"
                      size="large"
                      min={0}
                      max={100}
                    />
                  </Form.Item>
                </Grid>
              </Grid>

              {/* Botones de Acción */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4, pt: 3, borderTop: '1px solid #e5e7eb' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/billing')}
                  sx={{ minWidth: 120 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading || !facturacionId}
                  startIcon={<SaveIcon />}
                  sx={{
                    minWidth: 120,
                    bgcolor: '#667eea',
                    '&:hover': { bgcolor: '#5a67d8' }
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar PATCH'}
                </Button>
              </Box>

              {!facturacionId && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fef3cd', borderRadius: 1, border: '1px solid #fbbf24' }}>
                  <Typography variant="body2" sx={{ color: '#92400e' }}>
                    ⚠️ No existe facturación para esta orden de compra. Debe crear una facturación primero antes de poder editarla.
                  </Typography>
                </Box>
              )}

              {facturacionId && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#d1fae5', borderRadius: 1, border: '1px solid #10b981' }}>
                  <Typography variant="body2" sx={{ color: '#065f46' }}>
                    ✅ Facturación ID: {facturacionId} - Edición con PATCH habilitada
                  </Typography>
                </Box>
              )}
            </Form>
          </CardContent>
        </Card>
      </Box>
    </Spin>
  );
};

export default BillingFormContentSimple;
