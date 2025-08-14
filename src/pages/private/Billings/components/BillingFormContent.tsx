import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ArrowBack,
  Print
} from '@mui/icons-material';
import { notification, Form } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { SaleProps } from '@/services/sales/sales';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import { alpha } from '@/styles/theme/heroui-colors';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { getBillingByOrdenCompraId, patchBilling } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { Icon } from '@mui/material';
import { printOrdenProveedor } from '@/services/print/print.requests';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, setFacturacionId] = useState<number | null>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);

  // Estados para el control de cambios
  const changedOCFields = new Set<string>(); // Simulado para compatibilidad
  const savingOC = false; // Simulado para compatibilidad
  const savingBilling = loading; // Usar el estado de loading existente

  useEffect(() => {
    loadExistingBilling();
    loadOrdenesProveedor();
  }, [sale.id]);

  useEffect(() => {
    console.log('Estado ordenesProveedor cambió:', ordenesProveedor);
    console.log('Longitud:', ordenesProveedor.length);
  }, [ordenesProveedor]);

  const loadOrdenesProveedor = async () => {
    try {
      setLoading(true);
      const ops = await getOpsByOrdenCompra(sale.id);

      
      if (ops && Array.isArray(ops)) {
        setOrdenesProveedor(ops);
      } else {
        setOrdenesProveedor([]);
      }
    } catch (error) {
      console.error('Error loading provider orders:', error);
      setOrdenesProveedor([]);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoading(false);
    }
  };

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

      // Preparar solo los campos que han cambiado
      const updateData: any = {};

      if (values.numeroFactura) updateData.factura = values.numeroFactura;
      if (values.fechaFactura) updateData.fechaFactura = values.fechaFactura.toISOString();
      if (values.grr) updateData.grr = values.grr;
      if (values.porcentajeRetencion !== undefined) updateData.retencion = values.porcentajeRetencion;
      if (values.porcentajeDetraccion !== undefined) updateData.detraccion = values.porcentajeDetraccion;
      if (values.formaEnvioFactura) updateData.formaEnvioFactura = values.formaEnvioFactura;
      if (values.estado) updateData.estado = parseInt(values.estado);

      await patchBilling(facturacionId, updateData);

      notification.success({
        message: 'Facturación actualizada',
        description: 'Los cambios se han guardado correctamente'
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

  const handleBack = () => {
    navigate('/billing');
  };

  const handlePrintOP = async (op: ProviderOrderProps) => {
    try {
      console.log('Imprimiendo OP:', op.codigoOp, 'ID:', op.id);

      notification.info({
        message: 'Generando PDF',
        description: `Preparando impresión de ${op.codigoOp}...`
      });

      await printOrdenProveedor(op.id);

      notification.success({
        message: 'PDF Generado',
        description: `La orden de proveedor ${op.codigoOp} se ha descargado correctamente`
      });
    } catch (error) {
      console.error('Error al imprimir OP:', error);
      notification.error({
        message: 'Error al generar PDF',
        description: `No se pudo generar el PDF de ${op.codigoOp}`
      });
    }
  };
  const saveBilling = async () => {
    await handleSave();
  };

  const cancelOCChanges = () => {
    // Función para cancelar cambios si es necesario
    notification.info({
      message: 'Cambios cancelados',
      description: 'Se han revertido los cambios pendientes'
    });
  };

  return (
    <>
      {loading ? (
        <ProviderOrderFormSkeleton />
      ) : (
        <Box sx={{ p: 3 }}>
        <Form form={form} layout="vertical">
          <Stack spacing={3}>

            {/* Header OC - READONLY */}
            <StepItemContent
              showHeader
              color="#10b981"
              headerLeft={`Fecha creación: ${formattedDate(sale.createdAt)}`}
              headerRight={`Fecha actualización: ${formattedDate(sale.updatedAt)}`}
              showSearchButton={false}
              resumeContent={
                <Box>
                  <Typography variant="h5">
                    {sale.codigoVenta}
                  </Typography>
                  <Typography fontWeight={300}>
                    {sale?.cliente?.razonSocial || 'Cliente no especificado'}
                  </Typography>
                  <Typography fontWeight={300}>
                    RUC: {sale?.cliente?.ruc || 'N/A'}
                  </Typography>
                </Box>
              }
            >
              {/* Información Empresarial Minimalista */}
              <Box sx={{ mb: 3 }}>
                {/* Grid minimalista - Exactamente 3 columnas */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: 1.5
                }}>
                  {/* Card 1: Empresa */}
                  {sale?.empresa?.razonSocial && (
                    <Card sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e0e0e0',
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none'
                    }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Empresa
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 500, 
                          color: '#424242', 
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {sale.empresa.razonSocial} 
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Card 2: Fecha Emisión */}
                  {sale.fechaEmision && (
                    <Card sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid #e0e0e0',
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none'
                    }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Fecha Emisión
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                          {formattedDate(sale.fechaEmision)}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Card 3: Monto Total */}
                  <Card sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e0e0e0',
                    minHeight: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: 'none'
                  }}>
                    <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        Monto Total
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                        {formatCurrency(parseFloat(sale.montoVenta || '0'))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </StepItemContent>

            {/* Tabla de Órdenes de Proveedor - READONLY */}
            <StepItemContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#1f2937',
                    fontSize: '1.25rem'
                  }}
                >
                  <Icon sx={{ color: '#667eea', fontSize: 28 }} />
                  Órdenes de Proveedor ({ordenesProveedor.length})
                </Typography>
              </Box>
              
              {loading ? (
                <ProviderOrdersTableSkeleton />
              ) : ordenesProveedor.length === 0 ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 8,
                  bgcolor: '#f8fafc',
                  borderRadius: 3,
                  border: '2px dashed #cbd5e1'
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Icon sx={{ fontSize: 48, color: '#94a3b8' }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      mb: 1
                    }}
                  >
                    No hay órdenes de proveedor
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.9rem'
                    }}
                  >
                    No se encontraron órdenes de proveedor registradas para esta orden de compra
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  bgcolor: '#ffffff', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                          <TableCell sx={{ 
                            borderBottom: '2px solid #e2e8f0', 
                            fontWeight: 600, 
                            color: '#475569',
                            fontSize: '0.875rem'
                          }}>
                            OP
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: '2px solid #e2e8f0', 
                            fontWeight: 600, 
                            color: '#475569',
                            fontSize: '0.875rem'
                          }}>
                            Fecha Recepción
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: '2px solid #e2e8f0', 
                            fontWeight: 600, 
                            color: '#475569',
                            fontSize: '0.875rem'
                          }}>
                            Fecha Programada
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: '2px solid #e2e8f0', 
                            fontWeight: 600, 
                            color: '#475569',
                            fontSize: '0.875rem'
                          }}>
                            Fecha Despacho
                          </TableCell>
                          <TableCell sx={{ 
                            borderBottom: '2px solid #e2e8f0', 
                            fontWeight: 600, 
                            color: '#475569',
                            fontSize: '0.875rem'
                          }}>
                            Acciones
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ordenesProveedor.map((op, index) => (
                          <TableRow 
                            key={op.id} 
                            sx={{ 
                              '&:hover': { bgcolor: '#f8fafc' },
                              bgcolor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                            }}
                          >
                            <TableCell sx={{ 
                              borderBottom: '1px solid #f1f5f9',
                              fontWeight: 500,
                              color: '#1e293b'
                            }}>
                              {op.codigoOp}
                            </TableCell>
                            <TableCell sx={{ 
                              borderBottom: '1px solid #f1f5f9',
                              color: '#475569'
                            }}>
                              {formattedDate(op.fechaRecepcion)}
                            </TableCell>
                            <TableCell sx={{ 
                              borderBottom: '1px solid #f1f5f9',
                              color: '#475569'
                            }}>
                              {formattedDate(op.fechaProgramada)}
                            </TableCell>
                            <TableCell sx={{ 
                              borderBottom: '1px solid #f1f5f9',
                              color: '#475569'
                            }}>
                              {formattedDate(op.fechaDespacho)}
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #f1f5f9' }}>
                              <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => handlePrintOP(op)}
                                size="small"
                                sx={{ 
                                  minWidth: 'auto',
                                  px: 1.5,
                                  py: 0.5
                                }}
                              >
                                <Print sx={{ fontSize: 18 }} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </StepItemContent>

            {/* Sección Facturación - EDITABLE */}
            <Card
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
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
                      Factura *
                    </Typography>
                    <Form.Item
                      name="numeroFactura"
                      rules={[{ required: true, message: 'Número de factura requerido' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputAntd
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
                      <DatePickerAntd
                        label=""
                        placeholder="Seleccionar fecha"
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
                      <InputAntd
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
                      <SelectGeneric
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
                      <SelectGeneric
                        defaultValue={0}
                        size="large"
                        style={{ width: '100%' }}
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
                      <InputAntd
                        placeholder="Ej: Correo electrónico, Físico, etc."
                        size="large"
                      />
                    </Form.Item>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* btn de submit */}
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


              <div style={{ display: 'flex', gap: 10 }}>
                {changedOCFields.size > 0 && (
                  <Button
                    variant="outlined"
                    onClick={cancelOCChanges}
                    disabled={savingOC}
                    sx={{
                      borderColor: '#d1d5db',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#9ca3af',
                        backgroundColor: alpha('#f3f4f6', 0.5),
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={saveBilling}
                  disabled={savingBilling}
                  sx={{
                    bgcolor: '#10b981',
                    '&:hover': {
                      bgcolor: '#059669'
                    },
                    '&:disabled': {
                      bgcolor: '#6b7280'
                    }
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Facturación'}
                </Button>
              </div>


            </Box>
          </Stack>
        </Form>
      </Box>
      )}
    </>
  );
};

export default BillingFormContent;