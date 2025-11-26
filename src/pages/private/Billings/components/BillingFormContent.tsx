import React, { useState, useEffect, useCallback } from 'react';
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
  Table,
} from '@mui/material';
import {
  Print,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { notification, Form, Select } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';
import { alpha } from '@/styles/theme/heroui-colors';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { getBillingHistoryByOrdenCompraId } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { estadoOptions, ESTADOS, estadoBgMap } from '@/utils/constants';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { printOrdenProveedor } from '@/services/print/print.requests';
import { patchSale } from '@/services/sales/sales.request';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { BillingProps } from '@/services/billings/billings.d';
import BillingModal, { BillingModalMode } from './BillingModal';
import BillingHistory from '@/components/BillingHistory';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);

  // Estado unificado para el modal de facturación
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingModalMode, setBillingModalMode] = useState<BillingModalMode>('create');
  const [selectedBilling, setSelectedBilling] = useState<BillingProps | null>(null);

  const [cartaCciUrl, setCartaCciUrl] = useState<string | null>(null);
  const [cartaGarantiaUrl, setCartaGarantiaUrl] = useState<string | null>(null);
  const [savingCartaCci, setSavingCartaCci] = useState(false);
  const [savingCartaGarantia, setSavingCartaGarantia] = useState(false);

  const [estadoFacturacion, setEstadoFacturacion] = useState<string>(sale.estadoFacturacion || ESTADOS.PENDIENTE.value);

  useEffect(() => {
    loadOrdenesProveedor();
    loadBillingHistory();
  }, [sale.id]);

  useEffect(() => {
    if (sale.estadoFacturacion) {
      setEstadoFacturacion(sale.estadoFacturacion);
      form.setFieldsValue({ estadoFacturacion: sale.estadoFacturacion });
    }
  }, [sale.estadoFacturacion, form]);

  useEffect(() => {
    if (sale.cartaCci) {
      setCartaCciUrl(sale.cartaCci);
    }
    if (sale.cartaGarantia) {
      setCartaGarantiaUrl(sale.cartaGarantia);
    }
  }, [sale.cartaCci, sale.cartaGarantia]);

  const loadOrdenesProveedor = useCallback(async () => {
    try {
      setLoading(true);
      const ops = await getOpsByOrdenCompra(sale.id);

      if (ops && Array.isArray(ops)) {
        setOrdenesProveedor(ops);
      } else {
        setOrdenesProveedor([]);
      }
    } catch (error) {
      console.error('Error loading provider orders:', error instanceof Error ? error.message : 'Unknown error');
      setOrdenesProveedor([]);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoading(false);
    }
  }, [sale.id]);

  const loadBillingHistory = useCallback(async () => {
    try {
      const history = await getBillingHistoryByOrdenCompraId(sale.id);
      setBillingHistory(history || []);
    } catch (error) {
      console.error('❌ Error loading billing history:', error instanceof Error ? error.message : 'Unknown error');
      setBillingHistory([]);
    }
  }, [sale.id]);

  // Funciones para el modal unificado de facturación
  const handleOpenCreateModal = useCallback(() => {
    setSelectedBilling(null);
    setBillingModalMode('create');
    setBillingModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((billing: BillingProps) => {
    setSelectedBilling(billing);
    setBillingModalMode('edit');
    setBillingModalOpen(true);
  }, []);

  const handleOpenRefactorModal = useCallback((billing: BillingProps) => {
    setSelectedBilling(billing);
    setBillingModalMode('refactor');
    setBillingModalOpen(true);
  }, []);

  const handleViewBilling = useCallback((billing: BillingProps) => {
    setSelectedBilling(billing);
    setBillingModalMode('view');
    setBillingModalOpen(true);
  }, []);

  const handleCloseBillingModal = useCallback(() => {
    setBillingModalOpen(false);
    setSelectedBilling(null);
  }, []);

  const handleBillingSuccess = useCallback(async () => {
    await loadBillingHistory();
  }, [loadBillingHistory]);

  const handleViewFile = useCallback((fileUrl: string | null | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }, []);

  const handleEstadoFacturacionChange = useCallback(async (value: string) => {
    try {
      setEstadoFacturacion(value);
      form.setFieldsValue({ estadoFacturacion: value });

      await patchSale(sale.id, { estadoFacturacion: value });

      notification.success({
        message: 'Estado actualizado',
        description: 'El estado de facturación se actualizó correctamente',
        duration: 2
      });
    } catch (error) {
      console.error('Error updating estado facturación:', error);
      notification.error({
        message: 'Error al actualizar',
        description: 'No se pudo actualizar el estado de facturación'
      });
      setEstadoFacturacion(sale.estadoFacturacion || ESTADOS.PENDIENTE.value);
      form.setFieldsValue({ estadoFacturacion: sale.estadoFacturacion || ESTADOS.PENDIENTE.value });
    }
  }, [sale.id, sale.estadoFacturacion, form]);

  // Guardar Carta CCI automáticamente
  const handleCartaCciChange = useCallback(async (fileUrl: string | null) => {
    setCartaCciUrl(fileUrl);

    if (fileUrl) {
      try {
        setSavingCartaCci(true);
        await patchSale(sale.id, { cartaCci: fileUrl });
        notification.success({
          message: 'Carta CCI guardada',
          description: 'El documento se ha guardado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error saving Carta CCI:', error);
        notification.error({
          message: 'Error al guardar',
          description: 'No se pudo guardar la Carta CCI'
        });
        setCartaCciUrl(sale.cartaCci || null);
      } finally {
        setSavingCartaCci(false);
      }
    } else if (sale.cartaCci) {
      // Si se eliminó el archivo, actualizar en BD
      try {
        setSavingCartaCci(true);
        await patchSale(sale.id, { cartaCci: null });
        notification.success({
          message: 'Carta CCI eliminada',
          description: 'El documento se ha eliminado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error removing Carta CCI:', error);
        notification.error({
          message: 'Error al eliminar',
          description: 'No se pudo eliminar la Carta CCI'
        });
        setCartaCciUrl(sale.cartaCci);
      } finally {
        setSavingCartaCci(false);
      }
    }
  }, [sale.id, sale.cartaCci]);

  // Guardar Carta de Garantía automáticamente
  const handleCartaGarantiaChange = useCallback(async (fileUrl: string | null) => {
    setCartaGarantiaUrl(fileUrl);

    if (fileUrl) {
      try {
        setSavingCartaGarantia(true);
        await patchSale(sale.id, { cartaGarantia: fileUrl });
        notification.success({
          message: 'Carta de Garantía guardada',
          description: 'El documento se ha guardado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error saving Carta Garantía:', error);
        notification.error({
          message: 'Error al guardar',
          description: 'No se pudo guardar la Carta de Garantía'
        });
        setCartaGarantiaUrl(sale.cartaGarantia || null);
      } finally {
        setSavingCartaGarantia(false);
      }
    } else if (sale.cartaGarantia) {
      // Si se eliminó el archivo, actualizar en BD
      try {
        setSavingCartaGarantia(true);
        await patchSale(sale.id, { cartaGarantia: null });
        notification.success({
          message: 'Carta de Garantía eliminada',
          description: 'El documento se ha eliminado correctamente',
          duration: 2
        });
      } catch (error) {
        console.error('Error removing Carta Garantía:', error);
        notification.error({
          message: 'Error al eliminar',
          description: 'No se pudo eliminar la Carta de Garantía'
        });
        setCartaGarantiaUrl(sale.cartaGarantia);
      } finally {
        setSavingCartaGarantia(false);
      }
    }
  }, [sale.id, sale.cartaGarantia]);

  const handlePrintOP = async (op: ProviderOrderProps) => {
    try {
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
      console.error('Error al imprimir OP:', error instanceof Error ? error.message : String(error));
      notification.error({
        message: 'Error al generar PDF',
        description: `No se pudo generar el PDF de ${op.codigoOp}`
      });
    }
  };
  interface BillingSectionProps {
    billingHistory: BillingProps[];
  }

  const BillingSection = React.memo<BillingSectionProps>(({ billingHistory }) => {
    return (
      <>
        {/* Apartado de Documentos */}
        <Card sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <DescriptionIcon sx={{ fontSize: 24 }} />
                Documentos
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                      Carta CCI
                    </Typography>
                    {savingCartaCci && (
                      <Typography variant="caption" sx={{ color: '#667eea', fontStyle: 'italic' }}>
                        Guardando...
                      </Typography>
                    )}
                  </Box>
                  <SimpleFileUpload
                    label="Seleccionar archivo PDF"
                    accept="application/pdf"
                    value={cartaCciUrl}
                    onChange={handleCartaCciChange}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: '#475569' }}>
                      Carta de Garantía
                    </Typography>
                    {savingCartaGarantia && (
                      <Typography variant="caption" sx={{ color: '#667eea', fontStyle: 'italic' }}>
                        Guardando...
                      </Typography>
                    )}
                  </Box>
                  <SimpleFileUpload
                    label="Seleccionar archivo PDF"
                    accept="application/pdf"
                    value={cartaGarantiaUrl}
                    onChange={handleCartaGarantiaChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <BillingHistory
          billings={billingHistory}
          readOnly={false}
          onCreateNew={handleOpenCreateModal}
          onRefactor={handleOpenRefactorModal}
          onView={handleViewBilling}
          onViewFile={handleViewFile}
        />
      </>
    );
  });

  const ProviderOrdersTableComponent = React.memo<{ ordenesProveedor: any[]; handlePrintOP: (op: any) => void }>(({ ordenesProveedor, handlePrintOP }) => (
    <TableContainer sx={{
      bgcolor: '#f8fafc',
      borderRadius: 2,
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: '#e2e8f0' }}>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>OP</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha Recepción</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha Programada</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha Despacho</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ordenesProveedor.map((op, index) => (
            <TableRow
              key={op.id}
              sx={{
                '&:hover': {
                  bgcolor: '#f1f5f9'
                }
              }}
            >
              <TableCell sx={{ color: '#475569', fontWeight: 500 }}>
                {op.codigoOp}
              </TableCell>
              <TableCell sx={{ color: '#64748b' }}>
                {formattedDate(op.fechaRecepcion)}
              </TableCell>
              <TableCell sx={{ color: '#64748b' }}>
                {formattedDate(op.fechaProgramada)}
              </TableCell>
              <TableCell sx={{ color: '#64748b' }}>
                {formattedDate(op.fechaDespacho)}
              </TableCell>
              <TableCell>
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
  ));

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
                      RUC: {sale?.cliente?.ruc || ' '}
                    </Typography>
                  </Box>
                }
              >
                {/* Información Empresarial Minimalista */}
                <Box>
                  {/* Grid minimalista - Exactamente 3 columnas */}
                  <Typography variant="h6" sx={{
                    mb: 2, fontWeight: 600, color: '#667eea', display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <AssignmentIcon sx={{ fontSize: 24 }} />
                    Información de la Orden de Compra
                  </Typography>
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 1.5
                  }}>
                    {/* Card 1: Empresa */}
                    {sale?.empresa?.razonSocial && (
                      <Card sx={{
                        minHeight: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        border: 'none'
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

                    {/* Card 4: Fuente de financiamiento */}
                    <Card sx={{
                      minHeight: '70px',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: 'none'
                    }}>
                      <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                          Fuente de Financiamiento
                        </Typography>
                        <Typography variant="body1" sx={{
                          fontWeight: 500,
                          color: '#424242',
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {sale.multipleFuentesFinanciamiento ? 'Múltiples fuentes' : 'Única fuente'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </StepItemContent>

              {/* Tabla de Órdenes de Proveedor - READONLY */}
              <Card sx={{
                border: '1px solid #e2e8f0',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <AssignmentIcon sx={{ fontSize: 24 }} />
                      Órdenes de Proveedor
                    </Typography>
                  </Box>

                  {loading ? (
                    <ProviderOrdersTableSkeleton />
                  ) : ordenesProveedor.length === 0 ? (
                    <Box sx={{
                      textAlign: 'center',
                      py: 4,
                      bgcolor: '#f8fafc',
                      borderRadius: 2,
                      border: '2px dashed #e2e8f0'
                    }}>
                      <AssignmentIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                        No hay órdenes de proveedor
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                        No se encontraron órdenes de proveedor registradas para esta orden de compra
                      </Typography>
                    </Box>
                  ) : (
                    <ProviderOrdersTableComponent
                      ordenesProveedor={ordenesProveedor}
                      handlePrintOP={handlePrintOP}
                    />
                  )}
                </CardContent>
              </Card>
              <BillingSection
                billingHistory={billingHistory}
              />
              <Box sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#ffffff',
                p: 3,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/billing')}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#5a67d8',
                      bgcolor: 'rgba(102, 94, 234, 0.05)',
                    }
                  }}
                >
                  Regresar a Facturaciones
                </Button>

                <Box sx={{ minWidth: 280 }}>
                  <Typography sx={{
                    color: '#475569',
                    mb: 1.5,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Estado de Facturación
                  </Typography>
                  <Form.Item
                    name="estadoFacturacion"
                    initialValue={sale.estadoFacturacion || ESTADOS.PENDIENTE.value}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      value={estadoFacturacion}
                      onChange={handleEstadoFacturacionChange}
                      placeholder="Seleccionar estado"
                      size="large"
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                      dropdownStyle={{
                        borderRadius: 12,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        fontSize: 15,
                      }}
                    >
                      {estadoOptions.map(option => (
                        <Select.Option
                          key={option.value}
                          value={option.value}
                          style={{
                            color: estadoBgMap[option.value] || '#222',
                            fontWeight: 600,
                            padding: '10px 16px',
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: estadoBgMap[option.value] || '#ccc',
                                boxShadow: `0 0 8px ${estadoBgMap[option.value]}60`
                              }}
                            />
                            <span>{option.label}</span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Box>
              </Box>
            </Stack>

            {/* Modal unificado de facturación */}
            <BillingModal
              open={billingModalOpen}
              mode={billingModalMode}
              billing={selectedBilling}
              ordenCompraId={sale.id}
              onClose={handleCloseBillingModal}
              onSuccess={handleBillingSuccess}
            />
          </Form>
        </Box>
      )}
    </>
  );
};

export default BillingFormContent;