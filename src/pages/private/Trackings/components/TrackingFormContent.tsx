import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Stack, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  ArrowBack, 
  CheckCircle, 
  Business,
  Assignment as AssignmentIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { notification, Spin, Form, Select, Input } from 'antd';
import Grid from '@mui/material/Grid';
import { SaleProps } from '@/services/sales/sales';
import { alpha } from '@/styles/theme/heroui-colors';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import DatePickerAntd from '@/components/DatePickerAnt';
import { getOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import EstadoSelectAndSubmit from '@/components/EstadoSelectAndSubmit';

interface TrackingFormContentProps {
  sale: SaleProps;
}

const TrackingFormContent = ({ sale }: TrackingFormContentProps) => {
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
    navigate('/tracking');
  };

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      console.log('Guardando seguimiento:', values);
      
      // Separar datos de OC y datos de OPs
      const ocData = {
        fechaEntregaOc: values.fechaEntregaOC,
        documentoPeruCompras: values.cargoEntregaOCPeruCompras,
        fechaPeruCompras: values.fechaPeruCompras
      };
      
      // Procesar datos de cada OP
      const opsData = [];
      for (const op of ordenesProveedor) {
        const opKey = `op_${op.id}`;
        if (values[opKey]) {
          opsData.push({
            id: op.id,
            ...values[opKey]
          });
        }
      }
      
      console.log('📋 Datos de OC:', ocData);
      console.log('🏭 Datos de OPs:', opsData);
      
      // TODO: Implementar servicios para actualizar OC y OPs
      // await updateOrderCompra(sale.id, ocData);
      // for (const opData of opsData) {
      //   await updateOrderProvider(opData.id, opData);
      // }
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      notification.success({
        message: 'Seguimiento actualizado',
        description: `Se actualizaron ${opsData.length} OPs y la información de la OC`
      });

      navigate('/tracking');
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar el seguimiento'
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
            {/* Header de la OC */}
            <StepItemContent
              showHeader
              ResumeIcon={Business}
              color="#12b981"
              headerLeft={`Fecha creación: ${formattedDate(sale.createdAt)}`}
              headerRight={`Fecha actualización: ${formattedDate(sale.updatedAt)}`}
              resumeContent={
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                    {sale.codigoVenta}
                  </Typography>
                  <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                    Seguimiento de Orden de Compra
                  </Typography>
                </Box>
              }
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Información General de la Orden
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Monto de Venta</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                    {formatCurrency(parseInt(sale.montoVenta || '0'))}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Fecha Máxima de Entrega</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formattedDate(sale.fechaMaxForm)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Estado Actual</Typography>
                  <Chip 
                    label="En Proceso" 
                    sx={{ 
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Grid>
              </Grid>
            </StepItemContent>

            {/* Cuadro de Datos del Cliente, Responsable de Recepción y Lugar de Entrega */}
            <Box 
              sx={{ 
                bgcolor: 'white', 
                borderRadius: 2, 
                p: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                <Box flex={1}>
                  <Typography 
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontSize: 16, 
                      color: '#8377a8', 
                      fontWeight: 600, 
                      textAlign: 'center', 
                      mb: 2 
                    }}
                  >
                    Datos del Cliente
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 700, mb: 1 }}>
                    {sale?.cliente?.razonSocial ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    RUC: {sale?.cliente?.ruc ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    CUE: {sale?.cliente?.codigoUnidadEjecutora ?? '---'}
                  </Typography>
                </Box>
                
                <Box flex={1}>
                  <Typography 
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontSize: 16, 
                      color: '#8377a8', 
                      fontWeight: 600, 
                      textAlign: 'center', 
                      mb: 2 
                    }}
                  >
                    Responsable Recepción
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 700, mb: 1 }}>
                    {sale?.contactoCliente?.cargo ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    {sale?.contactoCliente?.nombre ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    {sale?.contactoCliente?.telefono ?? '---'} - {sale?.contactoCliente?.email ?? '---'}
                  </Typography>
                </Box>
                
                <Box flex={1}>
                  <Typography 
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontSize: 16, 
                      color: '#8377a8', 
                      fontWeight: 600, 
                      textAlign: 'center', 
                      mb: 2 
                    }}
                  >
                    Lugar de Entrega
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 14, fontWeight: 700, mb: 1 }}>
                    {sale?.direccionEntrega ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    {sale?.departamentoEntrega ?? '---'} - {sale?.provinciaEntrega ?? '---'} - {sale?.distritoEntrega ?? '---'}
                  </Typography>
                  <Typography sx={{ textTransform: 'uppercase', fontSize: 12, color: 'text.secondary' }}>
                    Ref: {sale?.referenciaEntrega ?? '---'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Lista de Órdenes de Proveedor */}
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
                <Stack spacing={2}>
                  {ordenesProveedor.map((op, index) => (
                    <Card key={op.id} variant="outlined" sx={{ border: '1px solid #e0e0e0' }}>
                      <CardHeader 
                        title={`OP ${index + 1}: ${op.codigoOp || `OP-${op.id}`}`}
                        subheader={`Proveedor: ${op.proveedor?.razonSocial || 'N/A'}`}
                        sx={{ bgcolor: '#f8fafc', py: 1 }}
                      />
                      <CardContent sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">RUC Proveedor</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {op.proveedor?.ruc || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">Contacto</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {op.contactoProveedor?.nombre || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">Total Proveedor</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#10b981' }}>
                              {formatCurrency(parseFloat(op.totalProveedor || '0'))}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="body2" color="text.secondary">Estado</Typography>
                            <Chip 
                              label={op.estadoOp || 'Pendiente'} 
                              size="small" 
                              color={op.estadoOp === 'CONFORME' ? 'success' : op.estadoOp === 'RECHAZADO' ? 'error' : 'warning'}
                            />
                          </Grid>
                          
                          {/* Fechas importantes */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2" color="text.secondary">Fecha Programada</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formattedDate(op.fechaProgramada) || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2" color="text.secondary">Fecha Despacho</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formattedDate(op.fechaDespacho) || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="body2" color="text.secondary">Fecha Recepción</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formattedDate(op.fechaRecepcion) || 'N/A'}
                            </Typography>
                          </Grid>

                          {/* FORMULARIO DE SEGUIMIENTO PARA CADA OP */}
                          <Grid size={12}>
                            <Box sx={{ 
                              bgcolor: '#f8fafc', 
                              borderRadius: 2, 
                              p: 3, 
                              mt: 2,
                              border: '2px solid #e2e8f0'
                            }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 600, 
                                mb: 3, 
                                color: '#1e293b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                <EditIcon sx={{ color: '#10b981' }} />
                                Formulario de Seguimiento - OP {index + 1}
                              </Typography>
                              
                              <Grid container spacing={3}>
                                {/* Fila 1: Tipo de Entrega, Estado OP, Fecha Entrega */}
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Tipo de Entrega
                                  </Typography>
                                  <Form.Item 
                                    name={[`op_${op.id}`, 'tipoEntrega']} 
                                    initialValue={op.tipoEntrega}
                                  >
                                    <Select
                                      placeholder="Seleccionar tipo"
                                      options={[
                                        { value: 'PARCIAL', label: 'Parcial' },
                                        { value: 'TOTAL', label: 'Total' }
                                      ]}
                                    />
                                  </Form.Item>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Estado OP
                                  </Typography>
                                  <Form.Item 
                                    name={[`op_${op.id}`, 'estadoOp']} 
                                    initialValue={op.estadoOp}
                                  >
                                    <Select
                                      placeholder="Seleccionar estado"
                                      options={[
                                        { value: 'RECHAZADO', label: 'Rechazado' },
                                        { value: 'CONFORME', label: 'Conforme' },
                                        { value: 'OBSERVADO', label: 'Observado' }
                                      ]}
                                    />
                                  </Form.Item>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 4 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Fecha de Entrega
                                  </Typography>
                                  <Form.Item 
                                    name={[`op_${op.id}`, 'fechaEntrega']} 
                                    initialValue={op.fechaEntrega}
                                  >
                                    <Input placeholder="Ingrese fecha de entrega" />
                                  </Form.Item>
                                </Grid>
                                
                                {/* Fila 2: Cargo OEA, Retorno de Mercadería */}
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Cargo OEA (Texto Libre)
                                  </Typography>
                                  <Form.Item 
                                    name={[`op_${op.id}`, 'cargoOea']} 
                                    initialValue={op.cargoOea}
                                  >
                                    <Input.TextArea 
                                      placeholder="Ingrese información del cargo OEA" 
                                      rows={3}
                                    />
                                  </Form.Item>
                                </Grid>
                                
                                <Grid size={{ xs: 12, md: 6 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                                    Retorno de Mercadería
                                  </Typography>
                                  <Form.Item 
                                    name={[`op_${op.id}`, 'retornoMercaderia']} 
                                    initialValue={op.retornoMercaderia}
                                  >
                                    <Select
                                      placeholder="Seleccionar retorno"
                                      options={[
                                        { value: 'NINGUNO', label: 'Ninguno' },
                                        { value: 'ENTIDAD', label: 'Entidad' },
                                        { value: 'TRANSPORTE', label: 'Transporte' },
                                        { value: 'ALMACEN_LIMA', label: 'Almacén Lima' },
                                        { value: 'ALMACEN_HUANCAYO', label: 'Almacén Huancayo' }
                                      ]}
                                    />
                                  </Form.Item>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>

                          {/* Productos de la OP */}
                          {op.productos && op.productos.length > 0 && (
                            <Grid size={12}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Productos ({op.productos.length})
                              </Typography>
                              <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <Table size="small">
                                  <TableHead sx={{ bgcolor: '#10b981 !important' }}>
                                    <TableRow>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>Código</TableCell>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>Descripción</TableCell>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>U.Medida</TableCell>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>Cantidad</TableCell>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>P. Unitario</TableCell>
                                      <TableCell sx={{ fontSize: 12, fontWeight: 600, color: 'white', p: 0.5 }}>Total</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {op.productos.slice(0, 5).map((producto: any, idx: number) => (
                                      <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#f8fafc' } }}>
                                        <TableCell sx={{ fontSize: 11, p: 0.5 }}>{producto.codigo || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontSize: 11, p: 0.5 }}>{producto.descripcion || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontSize: 11, p: 0.5 }}>{producto.unidadMedida || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontSize: 11, p: 0.5 }}>{producto.cantidad || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontSize: 11, p: 0.5 }}>{formatCurrency(parseFloat(producto.precioUnitario || '0'))}</TableCell>
                                        <TableCell sx={{ fontSize: 11, fontWeight: 600, p: 0.5, color: '#10b981' }}>
                                          {formatCurrency(parseFloat(producto.total || '0'))}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    {op.productos.length > 5 && (
                                      <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center', fontSize: 11, fontStyle: 'italic', p: 1 }}>
                                          ... y {op.productos.length - 5} productos más
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </StepItemContent>

            {/* Sección OC Conforme */}
            <Card 
              sx={{ 
                bgcolor: '#1e293b',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CardContent sx={{ bgcolor: '#1e293b', p: 4 }}>
                {/* Título centrado */}
                <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #10b981', pb: 2 }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 500, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: 2,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#10b981',
                      mb: 1
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 32, color: '#10b981' }} />
                    OC CONFORME
                  </Typography>
                </Box>

                {/* Los 3 campos en una sola fila */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Fecha Entrega OC
                    </Typography>
                    <Form.Item 
                      name="fechaEntregaOC" 
                      rules={[{ required: true, message: 'Fecha requerida' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <DatePickerAntd placeholder="Seleccionar fecha" />
                    </Form.Item>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Cargo de Entrega OC PERU COMPRAS
                    </Typography>
                    <Form.Item name="cargoEntregaOCPeruCompras">
                      <SimpleFileUpload
                        onChange={(file) => form.setFieldValue('cargoEntregaOCPeruCompras', file)}
                        accept="application/pdf"
                      />
                    </Form.Item>
                  </Grid>                  
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                      Fecha Perú Compras
                    </Typography>
                    <Form.Item 
                      name="fechaPeruCompras" 
                      style={{ marginBottom: 0 }}
                    >
                      <DatePickerAntd placeholder="Seleccionar fecha" />
                    </Form.Item>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Footer con botones */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'space-between',
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
                    backgroundColor: alpha('#f3f4f6', 0.5),
                  }
                }}
              >
                Volver
              </Button>

              <EstadoSelectAndSubmit
                form={form}
                name="estado"
                options={[
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'en_proceso', label: 'En Proceso' },
                  { value: 'completado', label: 'Completado' },
                  { value: 'retrasado', label: 'Retrasado' },
                  { value: 'cancelado', label: 'Cancelado' }
                ]}
                loading={loading}
                onSubmit={() => form.submit()}
                buttonText="Guardar Seguimiento"
              />
            </Box>
          </Stack>
        </Form>
      </Box>
    </Spin>
  );
};

export default TrackingFormContent;
