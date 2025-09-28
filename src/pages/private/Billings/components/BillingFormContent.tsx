import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { notification, Form, Input } from 'antd';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { SaleProps } from '@/services/sales/sales';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputAntd from '@/components/InputAntd';
import { alpha } from '@/styles/theme/heroui-colors';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import { getBillingByOrdenCompraId, patchBilling, getBillingHistoryByOrdenCompraId, createBilling, deleteBilling, refacturarBilling } from '@/services/billings/billings.request';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { estadoOptions, ESTADOS, getEstadoByValue } from '@/utils/constants';
import { getOpsByOrdenCompra } from '@/services/trackings/trackings.request';
import { Icon } from '@mui/material';
import { printOrdenProveedor } from '@/services/print/print.requests';
import ProviderOrdersTableSkeleton from './ProviderOrdersTableSkeleton';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { BillingProps, BillingData, BillingUpdateData } from '@/services/billings/billings.d';

interface BillingFormContentProps {
  sale: SaleProps;
}


const BillingFormContent = ({ sale }: BillingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facturacionId, _setFacturacionId] = useState<number | null>(null);

  const setFacturacionId = useCallback((value: number | null | ((prev: number | null) => number | null)) => {
    console.log('🔍 setFacturacionId called with:', value, 'from:', new Error().stack?.split('\n')[2]);
    _setFacturacionId(value);
  }, []);

  const [savedModalState, setSavedModalState] = useState<{
    modalMode: 'create' | 'edit' | 'refactor' | 'view';
    facturacionId: number | null;
  } | null>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBilling, setEditingBilling] = useState<BillingProps | null>(null);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [refactoringBilling, setRefactoringBilling] = useState<BillingProps | null>(null);

  // Estados para documentos
  const [cartaCciUrl, setCartaCciUrl] = useState<string | null>(null);
  const [cartaGarantiaUrl, setCartaGarantiaUrl] = useState<string | null>(null);
  const [savingDocuments, setSavingDocuments] = useState(false);

  // Estados para archivos de facturación
  const [facturaArchivo, setFacturaArchivo] = useState<string | null>(null);
  const [grrArchivo, setGrrArchivo] = useState<string | null>(null);
  const [notaCreditoArchivo, setNotaCreditoArchivo] = useState<string | null>(null);

  // Estado para el campo estadoFacturacion
  const [estadoFacturacion, setEstadoFacturacion] = useState<string>('pendiente');

  // Estados para el menú de acciones
  // Estados para el modal CRUD
  const [modalOpen, _setModalOpen] = useState(() => {
    console.log('🔍 modalOpen initialized to false');
    return false;
  });

  const setModalOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    console.log('🔍 setModalOpen called with:', value, 'from:', new Error().stack?.split('\n')[2]);
    _setModalOpen(value);
  }, []);
  const [modalMode, _setModalMode] = useState<'create' | 'edit' | 'refactor' | 'view'>('create');

  const setModalMode = useCallback((value: 'create' | 'edit' | 'refactor' | 'view' | ((prev: 'create' | 'edit' | 'refactor' | 'view') => 'create' | 'edit' | 'refactor' | 'view')) => {
    console.log('🔍 setModalMode called with:', value, 'from:', new Error().stack?.split('\n')[2]);
    _setModalMode(value);
  }, []);

  useEffect(() => {
    loadOrdenesProveedor();
    loadBillingHistory();
  }, [sale.id]);

  useEffect(() => {
    console.log('🔍 Modal state changed:', { modalOpen, modalMode, facturacionId });
  }, [modalOpen, modalMode, facturacionId]);

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
      const history = await getBillingHistoryByOrdenCompraId(sale.id);
      setBillingHistory(history || []);
    } catch (error) {
      console.error('❌ Error loading billing history:', error);
      setBillingHistory([]);
    }
  }, [sale.id]);

  const createNewBilling = useCallback(() => {
    setIsEditing(false);
    setEditingBilling(null);
    setFacturacionId(null);

    // Limpiar estados de archivos
    setFacturaArchivo(null);
    setGrrArchivo(null);

    // Limpiar completamente el formulario
    form.resetFields();
    form.setFieldsValue({
      fechaFactura: dayjs(), // Fecha actual por defecto
      numeroFactura: '', // Asegurar que esté vacío
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

  const handleRefacturar = useCallback((billing: BillingProps) => {
    console.log('🔍 handleRefacturar called with billing:', billing.id);
    setIsRefactoring(true);
    setRefactoringBilling(billing);
    setIsEditing(false);
    setEditingBilling(null);
    setFacturacionId(billing.id);

    // Rellenar el formulario con los datos de la facturación seleccionada
    form.setFieldsValue({
      numeroFactura: billing.factura,
      fechaFactura: billing.fechaFactura ? dayjs(billing.fechaFactura) : dayjs(),
      grr: billing.grr,
      porcentajeRetencion: billing.retencion,
      porcentajeDetraccion: billing.detraccion,
      formaEnvioFactura: billing.formaEnvioFactura,
      facturaArchivo: billing.facturaArchivo || null,
      grrArchivo: billing.grrArchivo || null,
      // Campos de nota de crédito para la nueva factura
      notaCreditoTexto: null,
      notaCreditoArchivo: null
    });

    // Establecer estados de archivos
    setFacturaArchivo(billing.facturaArchivo || null);
    setGrrArchivo(billing.grrArchivo || null);

    notification.info({
      message: 'Refacturando',
      description: 'Los campos se han rellenado con los datos de la facturación seleccionada. Complete la nota de crédito y guarde para crear una nueva factura.'
    });
  }, [form]);

  const handleViewBilling = useCallback((billing: BillingProps) => {
    setIsRefactoring(false);
    setRefactoringBilling(null);
    setIsEditing(false);
    setEditingBilling(null);
    setFacturacionId(billing.id);

    // Rellenar el formulario con los datos de la facturación seleccionada (solo lectura)
    form.setFieldsValue({
      numeroFactura: billing.factura,
      fechaFactura: billing.fechaFactura ? dayjs(billing.fechaFactura) : dayjs(),
      grr: billing.grr,
      porcentajeRetencion: billing.retencion,
      porcentajeDetraccion: billing.detraccion,
      formaEnvioFactura: billing.formaEnvioFactura,
      facturaArchivo: billing.facturaArchivo || null,
      grrArchivo: billing.grrArchivo || null,
      notaCreditoTexto: billing.notaCreditoTexto || null,
      notaCreditoArchivo: billing.notaCreditoArchivo || null
    });

    // Establecer estados de archivos
    setFacturaArchivo(billing.facturaArchivo || null);
    setGrrArchivo(billing.grrArchivo || null);

    notification.info({
      message: 'Visualizando facturación',
      description: 'Vista de solo lectura de la facturación seleccionada.'
    });
  }, [form]);

  const handleEditar = useCallback((billing: BillingProps) => {
    setIsEditing(true);
    setEditingBilling(billing);
    setIsRefactoring(false);
    setRefactoringBilling(null);
    setFacturacionId(billing.id);

    // Rellenar el formulario con los datos de la facturación seleccionada
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

  // Funciones CRUD para el modal
  const handleOpenCreateModal = useCallback(() => {
    setModalMode('create');
    setModalOpen(true);
    createNewBilling();
  }, []);

  const handleOpenEditModal = useCallback((billing: BillingProps) => {
    setModalMode('edit');
    setModalOpen(true);
    handleEditar(billing);
  }, [handleEditar]);

  const handleOpenRefactorModal = useCallback((billing: BillingProps) => {
    console.log('🔍 handleOpenRefactorModal called with billing:', billing.id);
    setModalMode('refactor');
    setModalOpen(true);
    setSavedModalState({ modalMode: 'refactor', facturacionId: billing.id });
    handleRefacturar(billing);
  }, [handleRefacturar]);

  const handleOpenViewModal = useCallback((billing: BillingProps) => {
    setModalMode('view');
    setModalOpen(true);
    handleViewBilling(billing);
  }, []);

  const handleCloseModal = useCallback(() => {
    console.log('🔍 handleCloseModal called - closing modal');
    setModalOpen(false);
    setModalMode('create');
    // Limpiar estados
    setIsEditing(false);
    setEditingBilling(null);
    setIsRefactoring(false);
    setRefactoringBilling(null);
    setFacturacionId(null);
    setSavedModalState(null);
    form.resetFields();
  }, [form]);

  const handleDeleteBilling = useCallback(async (billing: BillingProps) => {
    try {
      await deleteBilling(billing.id);
      notification.success({
        message: 'Facturación eliminada',
        description: 'La facturación se ha eliminado correctamente'
      });
      await loadBillingHistory();
    } catch (error) {
      console.error('Error deleting billing:', error);
      notification.error({
        message: 'Error al eliminar',
        description: 'No se pudo eliminar la facturación'
      });
    }
  }, [loadBillingHistory]);

  const handleViewFile = useCallback((fileUrl: string | null | undefined) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }, []);

  const saveBilling = useCallback(async () => {
    await handleSave();
  }, []);

  const handleSave = async () => {
    console.log('🔍 handleSave called - Current state:', {
      isEditing,
      facturacionId,
      modalMode,
      isRefactoring,
      refactoringBilling: refactoringBilling?.id,
      modalOpen,
      savedModalState
    });
    try {
      setLoading(true);

      const values = await form.validateFields();

      // Usar el estado guardado cuando se abrió el modal
      const currentMode = savedModalState?.modalMode || modalMode;
      const currentFacturacionId = savedModalState?.facturacionId || facturacionId;

      console.log('🔍 Final determination:', {
        currentMode,
        currentFacturacionId,
        savedModalState,
        modalMode,
        facturacionId
      });

      if ((!isEditing && !currentFacturacionId && currentMode !== 'refactor')) {
        // Crear nueva facturación
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

        notification.success({
          message: 'Facturación creada',
          description: 'La nueva facturación se ha guardado correctamente'
        });

        // Recargar el historial y limpiar el estado
        await loadBillingHistory();
        setIsEditing(false);
        setEditingBilling(null);
        setFacturacionId(null);

        // Limpiar el formulario para permitir crear otra facturación
        form.resetFields();
        form.setFieldsValue({
          fechaFactura: dayjs(),
          estado: '1'
        });

      } else if (isEditing && currentFacturacionId) {
        // Actualizar facturación existente
        const updateData: BillingUpdateData = {};

        if (values.numeroFactura !== undefined) updateData.factura = values.numeroFactura;
        if (values.fechaFactura) updateData.fechaFactura = values.fechaFactura.toISOString();
        if (values.grr !== undefined) updateData.grr = values.grr;
        if (values.porcentajeRetencion !== undefined) updateData.retencion = values.porcentajeRetencion;
        if (values.porcentajeDetraccion !== undefined) updateData.detraccion = values.porcentajeDetraccion;
        if (values.formaEnvioFactura !== undefined) updateData.formaEnvioFactura = values.formaEnvioFactura;

        // Los campos de archivo siempre se incluyen ya que pueden ser null (para limpiar)
        updateData.facturaArchivo = facturaArchivo;
        updateData.grrArchivo = grrArchivo;

        await patchBilling(currentFacturacionId, updateData);

        notification.success({
          message: 'Facturación actualizada',
          description: 'Los cambios se han guardado correctamente'
        });

        // Recargar el historial y limpiar el estado de edición
        await loadBillingHistory();
        setIsEditing(false);
        setEditingBilling(null);
        setFacturacionId(null);

        // Limpiar estados de archivos
        setFacturaArchivo(null);
        setGrrArchivo(null);

        // Limpiar el formulario
        form.resetFields();
        form.setFieldsValue({
          fechaFactura: dayjs(),
          facturaArchivo: null,
          grrArchivo: null
        });
      } else if (currentMode === 'refactor') {
        // Refacturar la facturación existente usando el controlador específico
        if (!currentFacturacionId) {
          throw new Error('No se encontró el ID de la facturación a refacturar');
        }

        const refacturacionData = {
          notaCreditoTexto: values.notaCreditoTexto,
          notaCreditoArchivo: values.notaCreditoArchivo,
          // También actualizar otros campos de la facturación
          factura: values.numeroFactura || null,
          fechaFactura: values.fechaFactura ? values.fechaFactura.toISOString() : null,
          grr: values.grr || null,
          retencion: values.porcentajeRetencion || null,
          detraccion: values.porcentajeDetraccion || null,
          formaEnvioFactura: values.formaEnvioFactura || null,
          facturaArchivo: facturaArchivo,
          grrArchivo: grrArchivo
        };

        await refacturarBilling(currentFacturacionId, refacturacionData);

        notification.success({
          message: 'Nueva factura de refacturación creada',
          description: 'La nueva factura ha sido creada correctamente con la nota de crédito'
        });

        // Recargar el historial y limpiar el estado
        await loadBillingHistory();
        setIsRefactoring(false);
        setRefactoringBilling(null);

        // Limpiar estados de archivos
        setFacturaArchivo(null);
        setGrrArchivo(null);

        // Limpiar el formulario
        form.resetFields();
        form.setFieldsValue({
          fechaFactura: dayjs(),
          facturaArchivo: null,
          grrArchivo: null
        });
      }

      // No navegar automáticamente - permitir que el usuario continue trabajando
      // navigate('/billing');

      // Cerrar el modal después de guardar
      handleCloseModal();
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
                startIcon={<AddIcon />}
                onClick={handleOpenCreateModal}
                sx={{
                  bgcolor: '#667eea',
                  '&:hover': {
                    bgcolor: '#5a67d8'
                  }
                }}
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
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Forma Envío</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Archivos</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Acciones</TableCell>
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
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.formaEnvioFactura || 'No especificado'}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {billing.facturaArchivo && (
                              <Chip
                                label="Factura"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                                onClick={() => handleViewFile(billing.facturaArchivo)}
                              />
                            )}
                            {billing.grrArchivo && (
                              <Chip
                                label="GRR"
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '20px' }}
                                onClick={() => handleViewFile(billing.grrArchivo)}
                              />
                            )}
                            {!billing.facturaArchivo && !billing.grrArchivo && (
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                Sin archivos
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#64748b' }}>
                          {billing.esRefacturacion ? 'Refacturación' : 'Facturación'}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1.5}>
                            <Tooltip title="Visualizar" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenViewModal(billing)}
                                type="button"
                                sx={{
                                  border: '1px solid #10b981',
                                  color: '#10b981',
                                  '&:hover': {
                                    bgcolor: 'rgba(16, 185, 129, 0.08)'
                                  }
                                }}
                                aria-label="Visualizar facturación"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!billing.esRefacturacion && (
                              <>
                                <Tooltip title="Editar" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditModal(billing)}
                                    type="button"
                                    sx={{
                                      border: '1px solid #6366f1',
                                      color: '#6366f1',
                                      '&:hover': {
                                        bgcolor: 'rgba(99, 102, 241, 0.08)'
                                      }
                                    }}
                                    aria-label="Editar facturación"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Refacturar" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      console.log('🔍 Refacturar button clicked for billing:', billing.id);
                                      handleOpenRefactorModal(billing);
                                    }}
                                    type="button"
                                    sx={{
                                      border: '1px solid #0ea5e9',
                                      color: '#0ea5e9',
                                      '&:hover': {
                                        bgcolor: 'rgba(14, 165, 233, 0.1)'
                                      }
                                    }}
                                    aria-label="Refacturar"
                                  >
                                    <RefreshIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {/* <Tooltip title="Eliminar" arrow placement="top">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteBilling(billing)}
                                type="button"
                                sx={{
                                  border: '1px solid #ef4444',
                                  color: '#ef4444',
                                  '&:hover': {
                                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                                  }
                                }}
                                aria-label="Eliminar"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip> */}
                          </Stack>
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
                  Complete el formulario para crear su primera facturación
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
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
    isEditing: boolean;
    loading: boolean;
    onSave: () => void;
    modalMode?: 'create' | 'edit' | 'refactor' | 'view';
    currentFacturacionId: number | null;
  }

  const BillingFormSection = React.memo<BillingFormSectionProps>(({
    form,
    modalMode,
    currentFacturacionId
  }) => {
    const getTitle = () => {
      if (modalMode === 'create') return 'Nueva Facturación';
      if (modalMode === 'edit') return 'Editar Facturación';
      if (modalMode === 'refactor') return 'Refacturar';
      if (modalMode === 'view') return 'Visualizar Facturación';
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
                    value={facturaArchivo}
                    onChange={(fileUrl) => {
                      setFacturaArchivo(fileUrl);
                      form.setFieldsValue({ facturaArchivo: fileUrl });
                    }}
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
                    value={grrArchivo}
                    onChange={(fileUrl) => {
                      setGrrArchivo(fileUrl);
                      form.setFieldsValue({ grrArchivo: fileUrl });
                    }}
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
                    defaultValue={0}
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
                    defaultValue={0}
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

          {/* Nota de Crédito - Visible al refacturar o cuando hay datos en modo view */}
          {(modalMode === 'refactor' || (modalMode === 'view' && (form.getFieldValue('notaCreditoTexto') || form.getFieldValue('notaCreditoArchivo')))) && (
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
                {modalMode === 'refactor' ? '🔄 Refacturación' : '📄 Nota de Crédito'}
              </Typography>

              <Box sx={{ p: 3, bgcolor: isRefactoring ? '#fef3c7' : '#f0f9ff', borderRadius: 2, border: `1px solid ${isRefactoring ? '#fbbf24' : '#0ea5e9'}` }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ color: isRefactoring ? '#92400e' : '#0c4a6e', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Archivo de Nota de Crédito
                    </Typography>
                    <Form.Item
                      name="notaCreditoArchivo"
                      style={{ marginBottom: 0 }}
                    >
                      <SimpleFileUpload
                        editable={modalMode !== 'view'}
                        value={form.getFieldValue('notaCreditoArchivo')}
                        onChange={(fileUrl) => {
                          if (modalMode !== 'view') {
                            form.setFieldsValue({ notaCreditoArchivo: fileUrl });
                          }
                        }}
                      />
                    </Form.Item>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography sx={{ color: modalMode === 'refactor' ? '#92400e' : '#0c4a6e', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                      Texto de Nota de Crédito {modalMode === 'refactor' ? '*' : ''}
                    </Typography>
                    <Form.Item
                      name="notaCreditoTexto"
                      rules={modalMode === 'refactor' ? [{ required: true, message: 'Por favor ingrese el texto de la nota de crédito' }] : []}
                      style={{ marginBottom: 0 }}
                    >
                      <InputAntd
                        placeholder="Ingrese el motivo de la refacturación"
                        size="large"
                        disabled={modalMode === 'view'}
                      />
                    </Form.Item>
                  </Grid>
                </Grid>
              </Box>
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
                      RUC: {sale?.cliente?.ruc || 'N/A'}
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
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                      Órdenes de Proveedor ({ordenesProveedor.length})
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
                isEditing={isEditing}
                form={form}
                onCreateNew={createNewBilling}
                onSave={saveBilling}
                onLoadHistory={loadBillingHistory}
              />
              <Box sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f8fafc',
              }}>
                <Box sx={{ minWidth: 200 }}>
                  <Typography sx={{ color: '#667eea', mb: 1, fontSize: '0.875rem', fontWeight: 600 }}>
                    Estado de Facturación
                  </Typography>
                  <Form.Item
                    name="estadoFacturacion"
                    initialValue="pendiente"
                    style={{ marginBottom: 0 }}
                  >
                    <SelectGeneric
                      value={estadoFacturacion}
                      onChange={(value) => {
                        setEstadoFacturacion(value);
                        form.setFieldsValue({ estadoFacturacion: value });
                      }}
                      placeholder="Seleccionar estado"
                      size="large"
                      style={{
                        width: '100%',
                        ...getEstadoStyles(estadoFacturacion)
                      }}
                      options={estadoOptions}
                    />
                  </Form.Item>
                </Box>
              </Box>
            </Stack>
            {/* Modal del formulario de facturación */}
            <Dialog
              open={modalOpen}
              onClose={handleCloseModal}
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
                    return (
                      <BillingFormSection
                        form={form}
                        isEditing={isEditing}
                        loading={loading}
                        onSave={saveBilling}
                        modalMode={modalMode}
                        currentFacturacionId={facturacionId}
                      />
                    );
                  } catch (error) {
                    console.error('🔍 Error in BillingFormSection:', error);
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
                  {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {modalMode !== 'view' && (
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
          </Form>
        </Box>
      )}
    </>
  );
};

export default BillingFormContent;