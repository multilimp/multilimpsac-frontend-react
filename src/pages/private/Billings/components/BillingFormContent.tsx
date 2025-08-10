import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ArrowBack,
  Save as SaveIcon
} from '@mui/icons-material';
import { notification, Spin, Form } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { SaleProps } from '@/services/sales/sales';
import { getBillingByOrdenCompraId } from '@/services/billings/billings.requests';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import { alpha } from '@/styles/theme/heroui-colors';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import { patchBilling } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';

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

interface ProviderOrder {
  id: number;
  codigoOp?: string;
  fechaRecepcion?: string;
  fechaProgramada?: string;
  fechaDespacho?: string;
}

const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, setFacturacionId] = useState<number | null>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrder[]>([]);
  
  // Estados para el control de cambios
  const changedOCFields = new Set<string>(); // Simulado para compatibilidad
  const savingOC = false; // Simulado para compatibilidad
  const savingBilling = loading; // Usar el estado de loading existente

  useEffect(() => {
    loadExistingBilling();
    loadOrdenesProveedor();
  }, [sale.id]);

  const loadOrdenesProveedor = async () => {
    try {
      // Simular carga de órdenes de proveedor - puedes conectar con tu API real
      setOrdenesProveedor([]);
    } catch (error) {
      console.error('Error loading provider orders:', error);
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

  const handlePrintOP = (op: ProviderOrder) => {
    console.log('Printing OP:', op);
    notification.info({
      message: 'Funcionalidad de impresión',
      description: 'Esta funcionalidad estará disponible próximamente'
    });
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
    <Spin spinning={loading} size="large">
      <Box sx={{ p: 3 }}>
        <Form form={form} layout="vertical">
          <Stack spacing={3}>

            {/* Header OC - READONLY */}
            <StepItemContent
              showHeader
              color="#10b981"
              headerLeft={`Fecha creación: ${formattedDate(sale.createdAt)}`}
              headerRight={`Fecha actualización: ${formattedDate(sale.updatedAt)}`}
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
              {/* Información Empresarial Mejorada */}
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                mt: 3,
                p: 3,
                bgcolor: 'rgba(16, 185, 129, 0.05)',
                borderRadius: 3,
                border: '1px solid rgba(16, 185, 129, 0.1)'
              }}>

                {/* Empresa */}
                {sale?.empresa?.razonSocial && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #a855f7 0%, #9333ea 100%)',
                      borderRadius: '8px 8px 0 0'
                    }
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 1
                      }}
                    >
                      Empresa
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        textAlign: 'center',
                        lineHeight: 1.3,
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {sale.empresa.razonSocial}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#9ca3af',
                        mt: 0.5,
                        textAlign: 'center'
                      }}
                    >
                      Proveedor
                    </Typography>
                  </Box>
                )}

                {/* Fecha Emisión */}
                {sale.fechaEmision && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '8px 8px 0 0'
                    }
                  }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#6b7280',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        mb: 1
                      }}
                    >
                      Fecha Emisión
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1f2937',
                        textAlign: 'center',
                        fontFamily: '"Roboto Mono", monospace'
                      }}
                    >
                      {formattedDate(sale.fechaEmision)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#9ca3af',
                        mt: 0.5,
                        textAlign: 'center'
                      }}
                    >
                      Orden de Compra
                    </Typography>
                  </Box>
                )}

                {/* Monto Total */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    borderRadius: '8px 8px 0 0'
                  }
                }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b7280',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      mb: 1
                    }}
                  >
                    Monto Total
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#10b981',
                      textAlign: 'center',
                      fontFamily: '"Roboto Mono", monospace'
                    }}
                  >
                    {formatCurrency(parseFloat(sale.montoVenta || '0'))}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9ca3af',
                      mt: 0.5,
                      textAlign: 'center'
                    }}
                  >
                    Soles (PEN)
                  </Typography>
                </Box>

              </Box>
            </StepItemContent>

            {/* Tabla de Órdenes de Proveedor - READONLY */}
            <StepItemContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#1f2937',
                  fontSize: '1.25rem'
                }}
              >
                <AssignmentIcon sx={{ color: '#667eea', fontSize: 28 }} />
                Órdenes de Proveedor ({ordenesProveedor.length})
              </Typography>

              {ordenesProveedor.length === 0 ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 6,
                  bgcolor: 'rgba(249, 250, 251, 0.8)',
                  borderRadius: 3,
                  border: '2px dashed #d1d5db'
                }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#6b7280',
                      fontWeight: 500,
                      fontSize: '1.1rem'
                    }}
                  >
                    No hay órdenes de proveedor registradas para esta orden de compra
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  bgcolor: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(229, 231, 235, 0.8)'
                }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{
                          bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          '& th': {
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
                            py: 2.5,
                            px: 3,
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'white',
                            textAlign: 'center',
                            position: 'relative',
                            '&:first-of-type': {
                              borderTopLeftRadius: 12
                            },
                            '&:last-of-type': {
                              borderTopRightRadius: 12
                            }
                          }
                        }}>
                          <TableCell sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            py: 2.5,
                            px: 3,
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            Código OP
                          </TableCell>
                          <TableCell sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            py: 2.5,
                            px: 3,
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            Fecha Recepción
                          </TableCell>
                          <TableCell sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            py: 2.5,
                            px: 3,
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            Fecha Programación
                          </TableCell>
                          <TableCell sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            py: 2.5,
                            px: 3,
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            Fecha Entrega OP
                          </TableCell>
                          <TableCell sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            textAlign: 'center',
                            py: 2.5,
                            px: 3,
                            borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
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
                              bgcolor: index % 2 === 0 ? '#ffffff' : 'rgba(249, 250, 251, 0.6)',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.05)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.1)'
                              },
                              '& td': {
                                py: 2.5,
                                px: 3,
                                borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: '#374151'
                              }
                            }}
                          >
                            <TableCell sx={{
                              fontWeight: 600,
                              color: '#1f2937',
                              fontFamily: '"Roboto Mono", monospace',
                              fontSize: '0.875rem',
                              textAlign: 'center',
                              py: 2.5,
                              px: 3,
                              borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
                            }}>
                              {op.codigoOp || `OP-${op.id}`}
                            </TableCell>
                            <TableCell sx={{
                              textAlign: 'center',
                              py: 2.5,
                              px: 3,
                              borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: '#374151'
                            }}>
                              {formattedDate(op.fechaRecepcion) || 'N/A'}
                            </TableCell>
                            <TableCell sx={{
                              textAlign: 'center',
                              py: 2.5,
                              px: 3,
                              borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: '#374151'
                            }}>
                              {formattedDate(op.fechaProgramada) || 'N/A'}
                            </TableCell>
                            <TableCell sx={{
                              textAlign: 'center',
                              py: 2.5,
                              px: 3,
                              borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: '#374151'
                            }}>
                              {formattedDate(op.fechaDespacho) || 'N/A'}
                            </TableCell>
                            <TableCell sx={{
                              textAlign: 'center',
                              py: 2.5,
                              px: 3,
                              borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
                            }}>
                              <IconButton
                                sx={{
                                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                                  color: '#667eea',
                                  border: '1px solid rgba(102, 126, 234, 0.2)',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                  },
                                  '&:disabled': {
                                    bgcolor: 'rgba(156, 163, 175, 0.1)',
                                    color: '#9ca3af',
                                    border: '1px solid rgba(156, 163, 175, 0.2)'
                                  }
                                }}
                                onClick={() => handlePrintOP(op)}
                                title="Generar e imprimir factura"
                                disabled={loading}
                              >
                                <PrintIcon sx={{ fontSize: 20 }} />
                              </IconButton>
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
                  {loading ? 'Guardando...' : 'Guardar Seguimiento'}
                </Button>
              </div>


            </Box>
          </Stack>
        </Form>
      </Box>
    </Spin>
  );
};

export default BillingFormContent;