import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Print,
  Save as SaveIcon
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
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { getBillingByOrdenCompraId, patchBilling, getBillingHistoryByOrdenCompraId, createBilling } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { Icon } from '@mui/material';
import { printOrdenProveedor } from '@/services/print/print.requests';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { BillingProps } from '@/services/billings/billings';
import { uploadFile } from '@/services/files/file.requests';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, setFacturacionId] = useState<number | null>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBilling, setEditingBilling] = useState<BillingProps | null>(null);

  // Estados para documentos
  const [cartaCciUrl, setCartaCciUrl] = useState<string | null>(null);
  const [cartaGarantiaUrl, setCartaGarantiaUrl] = useState<string | null>(null);
  const [savingDocuments, setSavingDocuments] = useState(false);

  // Estados para el control de cambios
  const changedOCFields = new Set<string>(); // Simulado para compatibilidad
  const savingOC = false; // Simulado para compatibilidad
  const savingBilling = loading; // Usar el estado de loading existente

  useEffect(() => {
    loadOrdenesProveedor();
    loadBillingHistory();
  }, [sale.id]);

  useEffect(() => {
    console.log('Estado ordenesProveedor cambió:', ordenesProveedor);
    console.log('Longitud:', ordenesProveedor.length);
  }, [ordenesProveedor]);

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
      console.error('Error loading provider orders:', error);
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
      console.log('🔍 Cargando historial de facturaciones para orden:', sale.id);
      const history = await getBillingHistoryByOrdenCompraId(sale.id);
      console.log('📊 Historial recibido:', history);
      console.log('📊 Número de facturaciones en historial:', history.length);
      setBillingHistory(history);

      // Si hay facturaciones, cargar automáticamente la última (más reciente)
      if (history && history.length > 0) {
        await loadLatestBillingFromHistory(history);
      }
    } catch (error) {
      console.error('❌ Error loading billing history:', error);
    }
  }, [sale.id]);

  const loadLatestBillingFromHistory = useCallback(async (history: BillingProps[]) => {
    try {
      // Ordenar por fecha de creación (más reciente primero) y tomar la primera
      const sortedHistory = history.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Más reciente primero
      });

      const latestBilling = sortedHistory[0];

      if (latestBilling) {
        console.log('📋 Cargando automáticamente la última facturación:', latestBilling.factura);

        setIsEditing(true);
        setIsDuplicating(false);
        setEditingBilling(latestBilling);
        setFacturacionId(latestBilling.facturacionId || null);

        // Convertir fecha correctamente
        let fechaFactura = undefined;
        if (latestBilling.fechaFactura) {
          try {
            if (typeof latestBilling.fechaFactura === 'string') {
              fechaFactura = dayjs(latestBilling.fechaFactura);
            } else {
              fechaFactura = dayjs(latestBilling.fechaFactura);
            }
            if (!fechaFactura.isValid()) {
              fechaFactura = undefined;
            }
          } catch (error) {
            fechaFactura = undefined;
          }
        }

        form.setFieldsValue({
          numeroFactura: latestBilling.factura || '',
          fechaFactura: fechaFactura,
          grr: latestBilling.grr || '',
          porcentajeRetencion: latestBilling.retencion || 0,
          porcentajeDetraccion: latestBilling.detraccion || 0,
          formaEnvioFactura: latestBilling.formaEnvioFactura || '',
          estado: latestBilling.estadoFacturacion ? latestBilling.estadoFacturacion.toString() : '1'
        });

        notification.info({
          message: 'Última facturación cargada',
          description: `Se ha cargado automáticamente la facturación ${latestBilling.factura} para edición.`
        });
      }
    } catch (error) {
      console.error('❌ Error loading latest billing from history:', error);
    }
  }, [form]);

  const loadExistingBilling = async () => {
    try {
      setLoading(true);
      const billing = await getBillingByOrdenCompraId(sale.id);
      if (billing && billing.facturacionId) {
        setFacturacionId(billing.facturacionId);

        // Convertir fecha correctamente - asegurar que sea tratada como fecha local
        let fechaFactura = undefined;
        if (billing.fechaFactura) {
          try {
            // Si viene como string, convertir a dayjs manteniendo la fecha local
            if (typeof billing.fechaFactura === 'string') {
              fechaFactura = dayjs(billing.fechaFactura); // Day.js maneja automáticamente la conversión local
            } else {
              fechaFactura = dayjs(billing.fechaFactura);
            }
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

  const duplicateBilling = (billing: BillingProps) => {
    setIsDuplicating(true);
    setIsEditing(false);
    setEditingBilling(null);
    setFacturacionId(null); // Limpiar el ID para crear una nueva facturación

    // Llenar el formulario con los datos de la facturación seleccionada
    let fechaFactura = undefined;
    if (billing.fechaFactura) {
      try {
        if (typeof billing.fechaFactura === 'string') {
          fechaFactura = dayjs(billing.fechaFactura);
        } else {
          fechaFactura = dayjs(billing.fechaFactura);
        }
        if (!fechaFactura.isValid()) {
          fechaFactura = undefined;
        }
      } catch (error) {
        fechaFactura = undefined;
      }
    }

    form.setFieldsValue({
      numeroFactura: '', // Dejar vacío para que el usuario ingrese uno nuevo
      fechaFactura: dayjs(), // Fecha actual por defecto
      grr: billing.grr || '',
      porcentajeRetencion: billing.retencion || 0,
      porcentajeDetraccion: billing.detraccion || 0,
      formaEnvioFactura: billing.formaEnvioFactura || '',
      estado: '1' // Estado por defecto
    });

    notification.success({
      message: 'Facturación duplicada',
      description: 'Los datos han sido copiados. Modifique los campos necesarios y guarde.'
    });
  };

  const editBilling = (billing: BillingProps) => {
    setIsEditing(true);
    setIsDuplicating(false);
    setEditingBilling(billing);
    setFacturacionId(billing.facturacionId || null);

    // Llenar el formulario con los datos de la facturación para editar
    let fechaFactura = undefined;
    if (billing.fechaFactura) {
      try {
        if (typeof billing.fechaFactura === 'string') {
          fechaFactura = dayjs(billing.fechaFactura);
        } else {
          fechaFactura = dayjs(billing.fechaFactura);
        }
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

    notification.info({
      message: 'Editando facturación',
      description: 'Modifique los campos necesarios y guarde los cambios.'
    });
  };

  const createNewBilling = useCallback(() => {
    setIsEditing(false);
    setIsDuplicating(false);
    setEditingBilling(null);
    setFacturacionId(null);

    // Limpiar completamente el formulario
    form.resetFields();
    form.setFieldsValue({
      fechaFactura: dayjs(), // Fecha actual por defecto
      estado: '1', // Estado por defecto
      numeroFactura: '', // Asegurar que esté vacío
      grr: '',
      porcentajeRetencion: 0,
      porcentajeDetraccion: 0,
      formaEnvioFactura: ''
    });

    notification.info({
      message: 'Nueva facturación',
      description: 'Complete los campos y guarde para crear una nueva facturación.'
    });
  }, [form]);

  const handleBack = useCallback(() => {
    navigate('/billing');
  }, [navigate]);

  const saveBilling = useCallback(async () => {
    await handleSave();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      const values = await form.validateFields();

      if (isDuplicating || (!isEditing && !facturacionId)) {
        // Crear nueva facturación (duplicación o primera vez)
        const billingData = {
          ordenCompraId: sale.id,
          factura: values.numeroFactura || '',
          fechaFactura: values.fechaFactura ? values.fechaFactura.toDate() : null,
          grr: values.grr || '',
          retencion: values.porcentajeRetencion || 0,
          detraccion: values.porcentajeDetraccion || 0,
          formaEnvioFactura: values.formaEnvioFactura || '',
          estado: parseInt(values.estado) || 1
        };

        const newBilling = await createBilling(billingData);

        const message = isDuplicating ? 'Facturación duplicada' : 'Facturación creada';
        const description = isDuplicating
          ? 'La facturación duplicada se ha guardado correctamente'
          : 'La nueva facturación se ha guardado correctamente';

        notification.success({
          message,
          description
        });

        // Recargar el historial y limpiar el estado
        await loadBillingHistory();
        setIsDuplicating(false);
        setIsEditing(false);
        setEditingBilling(null);
        setFacturacionId(null);

        // Limpiar el formulario para permitir crear otra facturación
        form.resetFields();
        form.setFieldsValue({
          fechaFactura: dayjs(),
          estado: '1'
        });

      } else if (isEditing && facturacionId) {
        // Actualizar facturación existente
        const updateData: any = {};

        if (values.numeroFactura !== undefined) updateData.factura = values.numeroFactura;
        if (values.fechaFactura) updateData.fechaFactura = values.fechaFactura.toDate();
        if (values.grr !== undefined) updateData.grr = values.grr;
        if (values.porcentajeRetencion !== undefined) updateData.retencion = values.porcentajeRetencion;
        if (values.porcentajeDetraccion !== undefined) updateData.detraccion = values.porcentajeDetraccion;
        if (values.formaEnvioFactura !== undefined) updateData.formaEnvioFactura = values.formaEnvioFactura;
        if (values.estado) updateData.estado = parseInt(values.estado);

        await patchBilling(facturacionId, updateData);

        notification.success({
          message: 'Facturación actualizada',
          description: 'Los cambios se han guardado correctamente'
        });

        // Recargar el historial y limpiar el estado de edición
        await loadBillingHistory();
        setIsEditing(false);
        setEditingBilling(null);
        setFacturacionId(null);

        // Limpiar el formulario
        form.resetFields();
        form.setFieldsValue({
          fechaFactura: dayjs(),
          estado: '1'
        });
      }

      // No navegar automáticamente - permitir que el usuario continue trabajando
      // navigate('/billing');
    } catch (error) {
      console.error('Error saving billing:', error);
      notification.error({
        message: 'Error al guardar',
        description: error instanceof Error ? error.message : 'No se pudo guardar la facturación'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDocuments = useCallback(async () => {
    try {
      setSavingDocuments(true);

      if (!cartaCciUrl && !cartaGarantiaUrl) {
        notification.warning({
          message: 'Sin documentos',
          description: 'Por favor selecciona al menos un documento para guardar'
        });
        return;
      }

      // Aquí puedes implementar la lógica para guardar los documentos
      // Por ejemplo, enviarlos al backend o guardarlos en el estado de la orden de compra

      notification.success({
        message: 'Documentos guardados',
        description: 'Los documentos se han guardado correctamente'
      });

    } catch (error) {
      console.error('Error saving documents:', error);
      notification.error({
        message: 'Error al guardar documentos',
        description: error instanceof Error ? error.message : 'No se pudieron guardar los documentos'
      });
    } finally {
      setSavingDocuments(false);
    }
  }, [cartaCciUrl, cartaGarantiaUrl]);

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
  interface BillingSectionProps {
    sale: SaleProps;
    billingHistory: BillingProps[];
    loading: boolean;
    isEditing: boolean;
    isDuplicating: boolean;
    form: any;
    onCreateNew: () => void;
    onSave: () => void;
    onLoadHistory: () => void;
  }

  const BillingSection = React.memo<BillingSectionProps>(({
    sale,
    billingHistory,
    loading,
    isEditing,
    isDuplicating,
    form,
    onCreateNew,
    onSave,
    onLoadHistory
  }) => {
    const formatRelativeTime = (date: string | Date | null | undefined) => {
      if (!date) return 'Sin fecha';

      const now = dayjs();
      const targetDate = dayjs(date);
      const diffInMinutes = now.diff(targetDate, 'minute');
      const diffInHours = now.diff(targetDate, 'hour');
      const diffInDays = now.diff(targetDate, 'day');

      if (diffInMinutes < 1) return 'Ahora mismo';
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
      if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
      if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays !== 1 ? 's' : ''}`;

      return targetDate.format('DD/MM/YYYY');
    };

    return (
      <>
        {/* Apartado de Documentos */}
        <Card sx={{
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
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
                📄 Documentos
              </Typography>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveDocuments}
                disabled={savingDocuments || (!cartaCciUrl && !cartaGarantiaUrl)}
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': { bgcolor: '#5a67d8' },
                  '&:disabled': {
                    bgcolor: '#cbd5e1',
                    color: '#94a3b8'
                  }
                }}
              >
                {savingDocuments ? 'Guardando...' : 'Guardar Documentos'}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#475569' }}>
                    Carta CCI
                  </Typography>
                  <SimpleFileUpload
                    label="Seleccionar archivo PDF"
                    accept="application/pdf"
                    value={cartaCciUrl}
                    onChange={(fileUrl) => {
                      setCartaCciUrl(fileUrl);
                      console.log('Carta CCI subida:', fileUrl);
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500, color: '#475569' }}>
                    Carta de Garantía
                  </Typography>
                  <SimpleFileUpload
                    label="Seleccionar archivo PDF"
                    accept="application/pdf"
                    value={cartaGarantiaUrl}
                    onChange={(fileUrl) => {
                      setCartaGarantiaUrl(fileUrl);
                      console.log('Carta de Garantía subida:', fileUrl);
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            {(cartaCciUrl || cartaGarantiaUrl) && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 1 }}>
                  Documentos seleccionados:
                </Typography>
                {cartaCciUrl && (
                  <Typography variant="body2" sx={{ color: '#475569', mb: 0.5 }}>
                    ✅ Carta CCI: Archivo seleccionado
                  </Typography>
                )}
                {cartaGarantiaUrl && (
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    ✅ Carta de Garantía: Archivo seleccionado
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Historial de Facturaciones - Carta Separada */}
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
                <ReceiptIcon sx={{ fontSize: 24 }} />
                Historial de Facturaciones
              </Typography>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': { bgcolor: '#5a67d8' }
                }}
                onClick={onCreateNew}
              >
                Nueva Facturación
              </Button>
            </Box>

            {billingHistory.length > 0 ? (
              <TableContainer sx={{
                bgcolor: '#f8fafc',
                borderRadius: 2,
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#e2e8f0' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Factura</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>GRR</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Retención</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Detracción</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Creado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billingHistory.map((billing) => (
                      <TableRow
                        key={billing.id}
                        sx={{
                          '&:hover': {
                            bgcolor: '#f1f5f9'
                          }
                        }}
                      >
                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>
                          {billing.factura || 'Sin número'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.fechaFactura ? dayjs(billing.fechaFactura).format('DD/MM/YYYY') : 'Sin fecha'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.grr || 'Sin GRR'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.retencion ? `${billing.retencion}%` : '0%'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.detraccion ? `${billing.detraccion}%` : '0%'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {formatRelativeTime(billing.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: '2px dashed #e2e8f0'
              }}>
                <ReceiptIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  No hay facturaciones
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                  Crea tu primera facturación usando el botón "Nueva Facturación"
                </Typography>
              </Box>
            )}

            <Typography variant="body2" sx={{ color: '#64748b', mt: 2, fontStyle: 'italic' }}>
              Historial de facturaciones creadas para esta orden de compra
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  });

  interface BillingFormSectionProps {
    form: any;
    isEditing: boolean;
    isDuplicating: boolean;
    loading: boolean;
    onSave: () => void;
  }

  const BillingFormSection = React.memo<BillingFormSectionProps>(({
    form,
    isEditing,
    isDuplicating,
    loading,
    onSave
  }) => {
    return (
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
              {isEditing && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 400,
                    color: '#667eea',
                    backgroundColor: '#e0e7ff',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ml: 1
                  }}
                >
                  EDITANDO
                </Typography>
              )}
              {isDuplicating && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 400,
                    color: '#10b981',
                    backgroundColor: '#d1fae5',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ml: 1
                  }}
                >
                  DUPLICANDO
                </Typography>
              )}
              {!isEditing && !isDuplicating && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 400,
                    color: '#f59e0b',
                    backgroundColor: '#fef3c7',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    ml: 1
                  }}
                >
                  NUEVA
                </Typography>
              )}
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
    );
  });

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
              <BillingSection
                sale={sale}
                billingHistory={billingHistory}
                loading={loading}
                isEditing={isEditing}
                isDuplicating={isDuplicating}
                form={form}
                onCreateNew={createNewBilling}
                onSave={saveBilling}
                onLoadHistory={loadBillingHistory}
              />

              {/* Formulario de Facturación */}
              <BillingFormSection
                form={form}
                isEditing={isEditing}
                isDuplicating={isDuplicating}
                loading={loading}
                onSave={saveBilling}
              />

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
                  {(changedOCFields.size > 0 || isEditing || isDuplicating) && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setIsDuplicating(false);
                        setEditingBilling(null);
                        setFacturacionId(null);
                        form.resetFields();
                        form.setFieldsValue({
                          fechaFactura: dayjs(),
                          estado: '1'
                        });
                        notification.info({
                          message: 'Modo cancelado',
                          description: 'Puede crear una nueva facturación.'
                        });
                      }}
                      disabled={savingOC}
                      sx={{
                        mr: 2,
                        borderColor: '#6b7280',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#4b5563',
                          bgcolor: '#f3f4f6'
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
                    {loading ? 'Guardando...' :
                      isDuplicating ? 'Duplicar Facturación' :
                        isEditing ? 'Actualizar Facturación' :
                          'Crear Facturación'}
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