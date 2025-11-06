import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Chip,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Print,
  Save as SaveIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { notification, Form, Select, Input } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { SaleProps } from '@/services/sales/sales';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import { alpha } from '@/styles/theme/heroui-colors';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { patchBilling, getBillingHistoryByOrdenCompraId, createBilling, deleteBilling } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { estadoOptions, ESTADOS, getEstadoByValue, estadoBgMap } from '@/utils/constants';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { printOrdenProveedor } from '@/services/print/print.requests';
import { patchSale } from '@/services/sales/sales.request';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { BillingProps, BillingData, BillingUpdateData } from '@/services/billings/billings.d';
import RefactorBillingModal from './RefactorBillingModal';
import BillingHistory from '@/components/BillingHistory';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, setFacturacionId] = useState<number | null>(null);

  const [savedModalState, setSavedModalState] = useState<{
    modalMode: 'create' | 'edit' | 'view';
    facturacionId: number | null;
  } | null>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);

  const [refactorModalOpen, setRefactorModalOpen] = useState(false);
  const [billingToRefactor, setBillingToRefactor] = useState<BillingProps | null>(null);

  const [cartaCciUrl, setCartaCciUrl] = useState<string | null>(null);
  const [cartaGarantiaUrl, setCartaGarantiaUrl] = useState<string | null>(null);
  const [savingDocuments, setSavingDocuments] = useState(false);

  const [estadoFacturacion, setEstadoFacturacion] = useState<string>(sale.estadoFacturacion || ESTADOS.PENDIENTE.value);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

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

  const createNewBilling = useCallback(() => {
    setFacturacionId(null);

    form.resetFields();
    form.setFieldsValue({
      fechaFactura: dayjs(),
      numeroFactura: '',
      grr: '',
      porcentajeRetencion: 0,
      porcentajeDetraccion: 0,
      formaEnvioFactura: '',
      facturaArchivo: null,
      grrArchivo: null
    });

    notification.info({
      message: 'Nueva facturación',
      description: 'Complete los campos y guarde para crear una nueva facturación.'
    });
  }, [form]);

  const handleViewBilling = useCallback((billing: BillingProps) => {
    setFacturacionId(billing.id);

    form.setFieldsValue({
      numeroFactura: billing.factura,
      fechaFactura: billing.fechaFactura ? dayjs.utc(billing.fechaFactura) : dayjs(),
      grr: billing.grr,
      porcentajeRetencion: billing.retencion,
      porcentajeDetraccion: billing.detraccion,
      formaEnvioFactura: billing.formaEnvioFactura,
      facturaArchivo: billing.facturaArchivo || null,
      grrArchivo: billing.grrArchivo || null,
      notaCreditoTexto: billing.notaCreditoTexto || null,
      notaCreditoArchivo: billing.notaCreditoArchivo || null,
      motivoRefacturacion: billing.motivoRefacturacion || null,
    });

    notification.info({
      message: 'Visualizando facturación',
      description: 'Vista de solo lectura de la facturación seleccionada.'
    });
  }, [form]);

  // Funciones CRUD para el modal
  const handleOpenCreateModal = useCallback(() => {
    setSavedModalState({ modalMode: 'create', facturacionId: null });
    setModalMode('create');
    setModalOpen(true);
    createNewBilling();
  }, [createNewBilling]);

  const handleOpenEditModal = useCallback((billing: BillingProps) => {
    setSavedModalState({ modalMode: 'edit', facturacionId: billing.id });
    setModalMode('edit');
    setModalOpen(true);

    setFacturacionId(billing.id);

    form.setFieldsValue({
      numeroFactura: billing.factura,
      fechaFactura: billing.fechaFactura ? dayjs(billing.fechaFactura) : dayjs(),
      grr: billing.grr,
      porcentajeRetencion: billing.retencion,
      porcentajeDetraccion: billing.detraccion,
      formaEnvioFactura: billing.formaEnvioFactura,
      facturaArchivo: billing.facturaArchivo || null,
      grrArchivo: billing.grrArchivo || null
    });

    notification.info({
      message: 'Editando facturación',
      description: 'Los campos se han rellenado con los datos de la facturación seleccionada. Realice los cambios y guarde.'
    });
  }, [form]);

  const handleOpenRefactorModal = useCallback((billing: BillingProps) => {
    setBillingToRefactor(billing);
    setRefactorModalOpen(true);
  }, []);

  const handleCloseRefactorModal = useCallback(() => {
    setRefactorModalOpen(false);
    setBillingToRefactor(null);
  }, []);

  const handleRefactorSuccess = useCallback(async () => {
    await loadBillingHistory();
    handleCloseRefactorModal();
  }, [loadBillingHistory]);

  const handleOpenViewModal = useCallback((billing: BillingProps) => {
    setSavedModalState({ modalMode: 'view', facturacionId: billing.id });
    setModalMode('view');
    setModalOpen(true);
    handleViewBilling(billing);
  }, [handleViewBilling]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setModalMode('create');
    setSavedModalState(null);
    setFacturacionId(null);
    form.resetFields();
  }, [form]);

  const handleViewFile = useCallback((fileUrl: string | null | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }, []);

  const saveBilling = useCallback(async () => {
    await handleSave();
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

  // Función para procesar cada acción de facturación
  const processBillingAction = async (
    mode: 'create' | 'edit' | 'view',
    facturacionId: number | null,
    values: any
  ) => {
    switch (mode) {
      case 'create':
        return await handleCreateBilling(values);

      case 'edit':
        if (!facturacionId) throw new Error('ID de facturación requerido para editar');
        return await handleUpdateBilling(facturacionId, values);

      default:
        throw new Error(`Modo no soportado: ${mode}`);
    }
  };

  // Función específica para crear nueva facturación
  const handleCreateBilling = async (values: any) => {
    const billingData: BillingData = {
      ordenCompraId: sale.id,
      factura: values.numeroFactura || null,
      fechaFactura: values.fechaFactura ? values.fechaFactura.toISOString() : null,
      grr: values.grr || null,
      retencion: values.porcentajeRetencion || 0,
      detraccion: values.porcentajeDetraccion || 0,
      formaEnvioFactura: values.formaEnvioFactura || null,
      facturaArchivo: values.facturaArchivo,
      grrArchivo: values.grrArchivo,
    };

    const newBilling = await createBilling(billingData);
    return { type: 'created', data: newBilling };
  };

  // Función específica para actualizar facturación existente
  const handleUpdateBilling = async (facturacionId: number, values: any) => {
    const updateData: BillingUpdateData = {};

    if (values.numeroFactura !== undefined) updateData.factura = values.numeroFactura;
    if (values.fechaFactura) updateData.fechaFactura = values.fechaFactura.toISOString();
    if (values.grr !== undefined) updateData.grr = values.grr;
    if (values.porcentajeRetencion !== undefined) updateData.retencion = values.porcentajeRetencion;
    if (values.porcentajeDetraccion !== undefined) updateData.detraccion = values.porcentajeDetraccion;
    if (values.formaEnvioFactura !== undefined) updateData.formaEnvioFactura = values.formaEnvioFactura;

    // Los campos de archivo siempre se incluyen ya que pueden ser null (para limpiar)
    updateData.facturaArchivo = values.facturaArchivo;
    updateData.grrArchivo = values.grrArchivo;

    const updatedBilling = await patchBilling(facturacionId, updateData);
    return { type: 'updated', data: updatedBilling };
  };

  // Función para manejar el éxito del guardado
  const handleSaveSuccess = async (result: any, mode: string) => {
    // Mensajes específicos por tipo de acción
    const messages = {
      created: {
        message: 'Facturación creada',
        description: 'La nueva facturación se ha guardado correctamente'
      },
      updated: {
        message: 'Facturación actualizada',
        description: 'Los cambios se han guardado correctamente'
      },
      refactored: {
        message: 'Nueva factura de refacturación creada',
        description: 'La nueva factura ha sido creada correctamente con la nota de crédito'
      }
    };

    const messageConfig = messages[result.type as keyof typeof messages] || {
      message: 'Operación completada',
      description: 'La operación se realizó correctamente'
    };

    notification.success(messageConfig);

    // Acciones comunes
    await loadBillingHistory();
    resetFormState();

    // Limpiar savedModalState después de guardar exitosamente
    setSavedModalState(null);

    // Cerrar el modal después de guardar
    handleCloseModal();
  };

  // Función para manejar errores del guardado
  const handleSaveError = (error: any) => {
    console.error('Error saving billing:', error instanceof Error ? error.message : String(error));
    notification.error({
      message: 'Error al guardar',
      description: error instanceof Error ? error.message : 'No se pudo guardar la facturación'
    });
  };

  // Función para resetear el estado del formulario
  const resetFormState = () => {
    setFacturacionId(null);

    form.resetFields();
    form.setFieldsValue({
      fechaFactura: dayjs(),
      facturaArchivo: null,
      grrArchivo: null
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const currentMode = savedModalState?.modalMode || modalMode;
      const currentFacturacionId = savedModalState?.facturacionId || facturacionId;

      // Determinar qué acción realizar
      const result = await processBillingAction(currentMode, currentFacturacionId, values);

      // Manejar el resultado común
      await handleSaveSuccess(result, currentMode);

    } catch (error) {
      handleSaveError(error);
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

      const documentData: Record<string, any> = {};

      if (cartaCciUrl) {
        documentData.cartaCci = cartaCciUrl;
      }

      if (cartaGarantiaUrl) {
        documentData.cartaGarantia = cartaGarantiaUrl;
      }

      await patchSale(sale.id, documentData);

      notification.success({
        message: 'Documentos guardados',
        description: 'Los documentos se han guardado correctamente en la orden de compra'
      });

    } catch (error) {
      console.error('Error saving documents:', error instanceof Error ? error.message : String(error));
      notification.error({
        message: 'Error al guardar documentos',
        description: error instanceof Error ? error.message : 'No se pudieron guardar los documentos'
      });
    } finally {
      setSavingDocuments(false);
    }
  }, [cartaCciUrl, cartaGarantiaUrl, sale.id]);

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
    sale: SaleProps;
    billingHistory: BillingProps[];
    loading: boolean;
    form: any;
    onCreateNew: () => void;
    onSave: () => void;
    onLoadHistory: () => void;
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
              {(cartaCciUrl || cartaGarantiaUrl) && (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveDocuments}
                  disabled={savingDocuments}
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
              )}
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

        <BillingHistory
          billings={billingHistory}
          readOnly={false}
          onCreateNew={handleOpenCreateModal}
          onRefactor={handleOpenRefactorModal}
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

  interface BillingFormSectionProps {
    form: any;
    loading: boolean;
    onSave: () => void;
    modalMode?: 'create' | 'edit' | 'view';
    currentFacturacionId: number | null;
  }

  const BillingFormSection = React.memo<BillingFormSectionProps>(({
    form,
    modalMode,
  }) => {
    const isViewMode = modalMode === 'view';
    const isCreateMode = modalMode === 'create';

    const getTitle = () => {
      if (isCreateMode) return 'Nueva Facturación';
      if (modalMode === 'edit') return 'Editar Facturación';
      if (isViewMode) return 'Visualizar Facturación';
      return 'FACTURACIÓN';
    };

    return (
      <Card
        sx={{
          bgcolor: '#ffffff',
          borderRadius: modalMode ? 0 : 3,
          overflow: 'hidden',
          boxShadow: modalMode ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #667eea', pb: 3 }}>
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
              {getTitle()}
            </Typography>
          </Box>

          {/* Información de Facturación */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Número de Factura *
                </Typography>
                <Form.Item
                  name="numeroFactura"
                  rules={[{ required: true, message: 'Número de factura requerido' }]}
                  style={{ marginBottom: 0 }}
                >
                  <InputAntd
                    placeholder="Ingrese número de factura"
                    size="large"
                    disabled={modalMode === 'view'}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Archivo de Factura
                </Typography>
                <Form.Item
                  name="facturaArchivo"
                  style={{ marginBottom: 0 }}
                >
                  <SimpleFileUpload
                    editable={modalMode !== 'view'}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Número de GRR
                </Typography>
                <Form.Item
                  name="grr"
                  style={{ marginBottom: 0 }}
                >
                  <InputAntd
                    placeholder="Ingrese número de GRR"
                    size="large"
                    disabled={modalMode === 'view'}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Archivo de GRR
                </Typography>
                <Form.Item
                  name="grrArchivo"
                  style={{ marginBottom: 0 }}
                >
                  <SimpleFileUpload
                    editable={modalMode !== 'view'}
                  />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>

          {/* Información de Facturación */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 3 }}>
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
                    disabled={modalMode === 'view'}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Retención
                </Typography>
                <Form.Item
                  name="porcentajeRetencion"
                  style={{ marginBottom: 0 }}
                  initialValue={0}
                >
                  <SelectGeneric
                    size="large"
                    style={{ width: '100%' }}
                    disabled={modalMode === 'view'}
                    options={[
                      { value: 0, label: '0%' },
                      { value: 3, label: '3%' }
                    ]}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Detracción
                </Typography>
                <Form.Item
                  name="porcentajeDetraccion"
                  style={{ marginBottom: 0 }}
                  initialValue={0}
                >
                  <SelectGeneric
                    size="large"
                    style={{ width: '100%' }}
                    disabled={modalMode === 'view'}
                    options={[
                      { value: 0, label: '0%' },
                      { value: 4, label: '4%' },
                      { value: 9, label: '9%' },
                      { value: 10, label: '10%' }
                    ]}
                  />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                  Forma de Envío
                </Typography>
                <Form.Item
                  name="formaEnvioFactura"
                  style={{ marginBottom: 0 }}
                >
                  <InputAntd
                    placeholder="Ej: Correo electrónico, Físico"
                    size="large"
                    disabled={modalMode === 'view'}
                  />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>

          {/* Nota de Crédito - Solo visible en modo view si hay datos */}
          {(isViewMode && (form.getFieldValue('notaCreditoTexto') || form.getFieldValue('notaCreditoArchivo'))) && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#475569',
                  fontWeight: 600,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Nota de Crédito
              </Typography>

              <Box sx={{ p: 3, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #0ea5e9' }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ color: '#0c4a6e', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Archivo de Nota de Crédito
                    </Typography>
                    <Form.Item
                      name="notaCreditoArchivo"
                      style={{ marginBottom: 0 }}
                    >
                      <SimpleFileUpload editable={false} />
                    </Form.Item>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ color: '#0c4a6e', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Texto de Nota de Crédito
                    </Typography>
                    <Form.Item
                      name="notaCreditoTexto"
                      style={{ marginBottom: 0 }}
                    >
                      <InputAntd
                        placeholder="Sin nota de crédito"
                        size="large"
                        disabled={true}
                      />
                    </Form.Item>
                  </Grid>
                </Grid>
              </Box>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography>
                    Motivo de Refacturación
                  </Typography>
                </Box>
                <Form.Item
                  name="motivoRefacturacion"
                  style={{ marginBottom: 0 }}
                >
                  <Input.TextArea rows={4} readOnly style={{ borderRadius: 8 }} />
                </Form.Item>
              </Grid>
            </Box>

          )}
        </CardContent>
      </Card>
    );
  });

  // Función para obtener estilos del estado
  const getEstadoStyles = (estadoValue: string) => {
    const estado = getEstadoByValue(estadoValue);
    if (!estado) {
      return {
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        color: '#374151'
      };
    }

    return {
      backgroundColor: alpha(estado.color, 0.1),
      borderColor: estado.color,
      color: estado.color,
      fontWeight: 600,
      boxShadow: `0 0 0 1px ${alpha(estado.color, 0.2)}`
    };
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
                sale={sale}
                billingHistory={billingHistory}
                loading={loading}
                form={form}
                onCreateNew={createNewBilling}
                onSave={saveBilling}
                onLoadHistory={loadBillingHistory}
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
            {/* Modal del formulario de facturación */}
            <Dialog
              open={modalOpen}
              onClose={(event, reason) => {
                // Solo permitir cerrar con el botón, no con clic fuera o ESC
                if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                  return;
                }
                handleCloseModal();
              }}
              maxWidth="md"
              fullWidth
              sx={{
                '& .MuiDialog-paper': {
                  borderRadius: 3,
                  maxHeight: '90vh'
                }
              }}
            >
              <DialogContent sx={{ p: 0 }}>
                {(() => {
                  try {
                    const currentMode = savedModalState?.modalMode || modalMode;
                    const currentFacturacionId = savedModalState?.facturacionId || facturacionId;

                    return (
                      <BillingFormSection
                        form={form}
                        loading={loading}
                        onSave={saveBilling}
                        modalMode={currentMode}
                        currentFacturacionId={currentFacturacionId}
                      />
                    );
                  } catch (error) {
                    console.error('🔍 Error in BillingFormSection:', error instanceof Error ? error.message : String(error));
                    return <div>Error en el formulario</div>;
                  }
                })()}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                  onClick={handleCloseModal}
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  {(savedModalState?.modalMode || modalMode) === 'view' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {(savedModalState?.modalMode || modalMode) !== 'view' && (
                  <Button
                    onClick={saveBilling}
                    variant="contained"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: '#667eea',
                      '&:hover': {
                        bgcolor: '#5a67d8'
                      }
                    }}
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </Button>
                )}
              </DialogActions>
            </Dialog>

            {/* Modal Simple de Refacturación */}
            <RefactorBillingModal
              open={refactorModalOpen}
              billing={billingToRefactor}
              ordenCompraId={sale.id}
              onClose={handleCloseRefactorModal}
              onSuccess={handleRefactorSuccess}
            />
          </Form>
        </Box>
      )}
    </>
  );
};

export default BillingFormContent;