import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { 
  ArrowBack, 
  Save,
  Business,
  Assignment as AssignmentIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { notification, Spin, Form, Input, DatePicker, Select } from 'antd';
import Grid from '@mui/material/Grid';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import { getOrderProvider } from '@/services/providerOrders/providerOrders.requests';

interface BillingFormContentProps {
  sale: SaleProps;
}

const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordenesProveedor, setOrdenesProveedor] = useState<any[]>([]);

  useEffect(() => {
    loadProviderOrders();
  }, [sale.id]);

  const loadProviderOrders = async () => {
    try {
      setLoading(true);
      const ops = await getOrderProvider(sale.id);
      setOrdenesProveedor(ops);
    } catch (error) {
      notification.error({
        message: 'Error al cargar órdenes de proveedor',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
      console.error('Error loading provider orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/billings');
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      console.log('Guardando facturación:', values);
      
      // TODO: Implementar guardado real de la facturación
      await new Promise(resolve => setTimeout(resolve, 1000));

      notification.success({
        message: 'Facturación actualizada',
        description: 'La facturación se ha actualizado correctamente'
      });

      navigate('/billings');
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar la facturación'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', p: 2 }}>
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Stack spacing={3}>
            
            {/* Header OC - READONLY */}
            <StepItemContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business />
                Datos de la Orden de Compra
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                bgcolor: '#f8fafc', 
                borderRadius: 2, 
                border: '1px solid #e0e0e0',
                mb: 3
              }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">Código OC</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {sale.codigoVenta || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">Cliente</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {sale?.cliente?.razonSocial || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">RUC Cliente</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {sale?.cliente?.ruc || 'N/A'}
                    </Typography>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">Empresa</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {sale?.empresa?.razonSocial || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">Monto Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                      {formatCurrency(parseFloat(sale.montoVenta || '0'))}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="body2" color="text.secondary">Fecha Emisión</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {formattedDate(sale.fechaEmision) || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </StepItemContent>

            {/* Tabla de Órdenes de Proveedor - READONLY */}
            <StepItemContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon />
                Órdenes de Proveedor ({ordenesProveedor.length})
              </Typography>
              
              {ordenesProveedor.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay órdenes de proveedor registradas para esta orden de compra
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#667eea' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Código OP</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha Recepción</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha Programación</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Fecha Entrega OP</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ordenesProveedor.map((op) => (
                        <TableRow key={op.id} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f8fafc' } }}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {op.codigoOp || `OP-${op.id}`}
                          </TableCell>
                          <TableCell>
                            {formattedDate(op.fechaRecepcion) || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {formattedDate(op.fechaProgramada) || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {formattedDate(op.fechaDespacho) || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              disabled 
                              title="Función de impresión próximamente"
                            >
                              <PrintIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </StepItemContent>

            {/* Sección Facturación - EDITABLE */}
            <Card 
              sx={{ 
                bgcolor: '#ffffff',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '2px solid #667eea'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #667eea', pb: 2 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#667eea',
                      mb: 1
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 32, color: '#667eea' }} />
                    FACTURACIÓN
                  </Typography>
                </Box>

                {/* Primera fila: Factura, Fecha Factura, GRR */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Número de Factura *
                    </Typography>
                    <Form.Item 
                      name="numeroFactura" 
                      rules={[{ required: true, message: 'Número de factura requerido' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input 
                        placeholder="Ingrese número de factura"
                        size="large"
                      />
                    </Form.Item>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Fecha de Factura *
                    </Typography>
                    <Form.Item 
                      name="fechaFactura" 
                      rules={[{ required: true, message: 'Fecha de factura requerida' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <DatePicker 
                        placeholder="Seleccionar fecha"
                        size="large"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      GRR (Guía de Remisión)
                    </Typography>
                    <Form.Item 
                      name="grr" 
                      style={{ marginBottom: 0 }}
                    >
                      <Input 
                        placeholder="Ingrese número de GRR"
                        size="large"
                      />
                    </Form.Item>
                  </Grid>
                </Grid>

                {/* Segunda fila: Porcentaje Retención, Porcentaje Detracción, Forma de Envío */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Porcentaje de Retención
                    </Typography>
                    <Form.Item 
                      name="porcentajeRetencion" 
                      style={{ marginBottom: 0 }}
                      initialValue={0}
                    >
                      <Select
                        defaultValue={0}
                        size="large"
                        style={{ width: '100%' }}
                        options={[
                          { value: 0, label: '0%' },
                          { value: 3, label: '3%' }
                        ]}
                      />
                    </Form.Item>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Porcentaje de Detracción
                    </Typography>
                    <Form.Item 
                      name="porcentajeDetraccion" 
                      style={{ marginBottom: 0 }}
                      initialValue={0}
                    >
                      <Select
                        defaultValue={0}
                        size="large"
                        style={{ width: '100%', height: '40px' }}
                        options={[
                          { value: 0, label: '0%' },
                          { value: 4, label: '4%' },
                          { value: 9, label: '9%' },
                          { value: 10, label: '10%' }
                        ]} 
                      />
                    </Form.Item>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Forma de Envío de Factura
                    </Typography>
                    <Form.Item 
                      name="formaEnvioFactura" 
                      style={{ marginBottom: 0 }}
                    >
                      <Input 
                        placeholder="Ej: Correo electrónico, Físico, etc."
                        size="large"
                      />
                    </Form.Item>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Footer con botones */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              alignItems: 'center',
              mt: 4, 
              p: 3,
              bgcolor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f3f4f6',
                  }
                }}
              >
                Volver
              </Button>

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => form.submit()}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                Guardar Facturación
              </Button>
            </Box>
          </Stack>
        </Form>
      </Box>
    </Spin>
  );
};

export default BillingFormContent;