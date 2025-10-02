import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Modal,
  Box as MuiBox,
  Switch,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Business,
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  LocalShipping as LocalShippingIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { notification, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import { SaleProps } from '@/services/sales/sales';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import heroUIColors, { alpha } from '@/styles/theme/heroui-colors';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import DatePickerAntd from '@/components/DatePickerAnt';
import { getOrderProvider, patchOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { updateOrdenCompra, getOrdenCompraByTrackingId } from '@/services/trackings/trackings.request';
import { printOrdenProveedor } from '@/services/print/print.requests';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputAntd from '@/components/InputAntd';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';

interface TrackingFormContentProps {
  sale: SaleProps;
}

const TrackingFormContent = ({ sale }: TrackingFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [expandedContent, setExpandedContent] = useState<{ [key: string]: boolean }>({});
  const [originalValues, setOriginalValues] = useState<{ [key: string]: Record<string, unknown> }>({});
  const [changedFields, setChangedFields] = useState<{ [key: string]: Set<string> }>({});
  const [savingOP, setSavingOP] = useState<string | null>(null);
  const [originalOCValues, setOriginalOCValues] = useState<Record<string, unknown>>({});
  const [changedOCFields, setChangedOCFields] = useState<Set<string>>(new Set());
  const [savingOC, setSavingOC] = useState(false);
  const [customRetornoValues, setCustomRetornoValues] = useState<{ [key: string]: string }>({});
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadProviderOrders();
    initializeOCValues();
  }, [sale.id]);

  const initializeOCValues = () => {
    const ocValues = {
      fechaEntregaOC: sale.fechaEntregaOc ? dayjs(sale.fechaEntregaOc) : null,
      documentoPeruCompras: sale.documentoPeruCompras || null,
      fechaPeruCompras: sale.fechaPeruCompras ? dayjs(sale.fechaPeruCompras) : null,
    };
    setOriginalOCValues(ocValues);

    // Establecer valores iniciales en el formulario
    form.setFieldsValue(ocValues);
  };

  const loadProviderOrders = async () => {
    try {
      setLoading(true);
      const ops = await getOrderProvider(sale.id);
      setOrdenesProveedor(ops);

      const initialValues: { [key: string]: Record<string, unknown> } = {};
      ops.forEach(op => {
        const opKey = `op_${op.id}`;
        let retornoValue: string | null = op.retornoMercaderia;
        let customValue = '';

        // Si el valor comienza con "OTROS:", extraer el texto personalizado
        const retornoMercaderiaValue = op.retornoMercaderia;
        if (retornoMercaderiaValue != null) {
          const strValue = String(retornoMercaderiaValue);
          if (strValue.startsWith('OTROS: ')) {
            retornoValue = 'OTROS';
            customValue = strValue.replace('OTROS: ', '');
            setCustomRetornoValues(prev => ({
              ...prev,
              [op.id.toString()]: customValue
            }));
          }
        }

        initialValues[opKey] = {
          tipoEntrega: op.tipoEntrega,
          estadoOp: op.estadoOp,
          fechaEntrega: op.fechaEntrega ? dayjs(op.fechaEntrega) : null,
          cargoOea: op.cargoOea,
          retornoMercaderia: retornoValue
        };
      });
      setOriginalValues(initialValues);
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

  const reloadOCData = async () => {
    try {
      const updatedSale = await getOrdenCompraByTrackingId(sale.id);
      // Actualizar el estado local con los nuevos datos
      Object.assign(sale, updatedSale);
      // Reinicializar los valores del formulario con los datos actualizados
      initializeOCValues();
      // Limpiar campos de cambios
      setChangedOCFields(new Set());
    } catch (error) {
      console.error('Error al recargar datos de la OC:', error);
      notification.error({
        message: 'Error al recargar datos',
        description: 'No se pudieron recargar los datos de la OC'
      });
    }
  };

  const handleBack = () => {
    navigate('/tracking');
  };


  const handleToggleContent = (opId: string) => {
    setExpandedContent(prev => ({
      ...prev,
      [opId]: !prev[opId]
    }));
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

  const handleFieldChange = (opId: string, fieldName: string, value: unknown) => {
    const opKey = `op_${opId}`;
    const originalValue = originalValues[opKey]?.[fieldName];

    const isChanged = JSON.stringify(originalValue) !== JSON.stringify(value);

    setChangedFields(prev => {
      const newChangedFields = { ...prev };
      if (!newChangedFields[opId]) {
        newChangedFields[opId] = new Set();
      }

      if (isChanged) {
        newChangedFields[opId].add(fieldName);
      } else {
        newChangedFields[opId].delete(fieldName);
      }

      if (newChangedFields[opId].size === 0) {
        delete newChangedFields[opId];
      }

      return newChangedFields;
    });
  };

  const handleOCFieldChange = (fieldName: string, value: unknown) => {
    const originalValue = originalOCValues[fieldName];

    // Comparar valores, teniendo en cuenta que dayjs objects requieren comparación especial
    let isChanged = false;
    if (fieldName === 'fechaEntregaOC' || fieldName === 'fechaPeruCompras') {
      // Para campos de fecha, comparar como string ISO
      const originalDateStr = originalValue && typeof originalValue === 'object' && 'toISOString' in originalValue
        ? (originalValue as dayjs.Dayjs).toISOString()
        : null;
      const currentDateStr = value && typeof value === 'object' && 'toISOString' in value
        ? (value as dayjs.Dayjs).toISOString()
        : null;
      isChanged = originalDateStr !== currentDateStr;
    } else {
      // Para otros campos, usar comparación JSON
      isChanged = JSON.stringify(originalValue) !== JSON.stringify(value);
    }

    console.log(`📝 Campo OC "${fieldName}" cambió:`, { original: originalValue, nuevo: value, isChanged });

    setChangedOCFields(prev => {
      const newChangedFields = new Set(prev);
      if (isChanged) {
        newChangedFields.add(fieldName);
      } else {
        newChangedFields.delete(fieldName);
      }
      return newChangedFields;
    });
  };


  const saveOPChanges = async (opId: string) => {
    try {
      setSavingOP(opId);
      const opKey = `op_${opId}`;
      const currentValues = form.getFieldValue(opKey);
      const changedFieldsForOP = changedFields[opId];

      if (!changedFieldsForOP || changedFieldsForOP.size === 0) {
        notification.info({
          message: 'Sin cambios',
          description: 'No hay cambios para guardar en esta OP'
        });
        return;
      }

      const dataToSend: Record<string, unknown> = {};
      changedFieldsForOP.forEach(fieldName => {
        let value = currentValues[fieldName];

        if (fieldName === 'fechaEntrega' && value) {
          value = value.toISOString();
        }

        dataToSend[fieldName] = value;
      });

      await patchOrderProvider(parseInt(opId), dataToSend);

      notification.success({
        message: 'OP actualizada',
        description: `Se guardaron ${changedFieldsForOP.size} cambios en la OP`
      });

      setChangedFields(prev => {
        const newChangedFields = { ...prev };
        delete newChangedFields[opId];
        return newChangedFields;
      });

      await loadProviderOrders();
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar la OP'
      });
      console.error('Error saving OP changes:', error);
    } finally {
      setSavingOP(null);
    }
  };

  const cancelOPChanges = (opId: string) => {
    const opKey = `op_${opId}`;
    const originalValue = originalValues[opKey];

    if (originalValue) {
      form.setFieldsValue({
        [opKey]: originalValue
      });
    }

    setChangedFields(prev => {
      const newChangedFields = { ...prev };
      delete newChangedFields[opId];
      return newChangedFields;
    });

    notification.info({
      message: 'Cambios cancelados',
      description: 'Se restauraron los valores originales'
    });
  };

  const saveOCChanges = async () => {
    try {
      setSavingOC(true);

      if (changedOCFields.size === 0) {
        notification.info({
          message: 'Sin cambios',
          description: 'No hay cambios para guardar en la OC'
        });
        return;
      }

      const currentValues = form.getFieldsValue();
      const dataToSend: Record<string, unknown> = {};

      changedOCFields.forEach(fieldName => {
        let value = currentValues[fieldName];

        if (fieldName === 'fechaEntregaOC' && value) {
          value = value.toISOString();
        }
        if (fieldName === 'fechaPeruCompras' && value) {
          value = value.toISOString();
        }

        // Mapear nombres de campos del frontend al backend
        const fieldMapping: Record<string, string> = {
          fechaEntregaOC: 'fechaEntregaOc',
          fechaPeruCompras: 'fechaPeruCompras'
        };

        dataToSend[fieldMapping[fieldName] || fieldName] = value;
      });

      console.log('📋 Guardando datos de OC Conforme:', dataToSend);
      await updateOrdenCompra(sale.id, dataToSend);

      notification.success({
        message: 'OC actualizada',
        description: `Se guardaron ${changedOCFields.size} cambios en la OC`
      });

      setChangedOCFields(new Set());

      // Recargar los datos de la OC desde el backend
      await reloadOCData();
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar la OC'
      });
      console.error('Error saving OC changes:', error);
    } finally {
      setSavingOC(false);
    }
  };

  const cancelOCChanges = () => {
    form.setFieldsValue(originalOCValues);
    setChangedOCFields(new Set());

    notification.info({
      message: 'Cambios cancelados',
      description: 'Se restauraron los valores originales de la OC'
    });
  };

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);
      console.log('Guardando seguimiento:', values);

      // Guardar cambios de OC Conforme si hay cambios
      if (changedOCFields.size > 0) {
        const ocData: Record<string, unknown> = {};

        changedOCFields.forEach(fieldName => {
          let value = values[fieldName];

          if (fieldName === 'fechaEntregaOC' && value && typeof value === 'object' && 'toISOString' in value) {
            value = (value as dayjs.Dayjs).toISOString();
          }
          if (fieldName === 'fechaPeruCompras' && value && typeof value === 'object' && 'toISOString' in value) {
            value = (value as dayjs.Dayjs).toISOString();
          }

          // Mapear nombres de campos del frontend al backend
          const fieldMapping: Record<string, string> = {
            fechaEntregaOC: 'fechaEntregaOc',
            fechaPeruCompras: 'fechaPeruCompras'
          };

          ocData[fieldMapping[fieldName] || fieldName] = value;
        });

        console.log('📋 Datos de OC Conforme:', ocData);
        await updateOrdenCompra(sale.id, ocData);
      }

      // Guardar cambios de OPs si hay cambios
      const opsData = [];
      for (const op of ordenesProveedor) {
        const opKey = `op_${op.id}`;
        const changedFieldsForOP = changedFields[op.id.toString()];

        if (changedFieldsForOP && changedFieldsForOP.size > 0 && values[opKey]) {
          const opData: Record<string, unknown> = {};
          const opValues = values[opKey] as Record<string, unknown>;

          changedFieldsForOP.forEach(fieldName => {
            let value = opValues[fieldName];

            if (fieldName === 'fechaEntrega' && value && typeof value === 'object' && 'toISOString' in value) {
              value = (value as dayjs.Dayjs).toISOString();
            }

            opData[fieldName] = value;
          });

          opsData.push({
            id: op.id,
            ...opData
          });

          console.log(`🏭 Datos de OP ${op.id}:`, opData);
        }
      }

      // Guardar todas las OPs con cambios
      for (const opData of opsData) {
        await patchOrderProvider(opData.id, opData);
      }

      const totalChanges = changedOCFields.size + opsData.length;

      notification.success({
        message: 'Seguimiento actualizado',
        description: `Se guardaron ${totalChanges} cambios en total`
      });

      // Limpiar estados de cambios
      setChangedOCFields(new Set());
      setChangedFields({});

      // Recargar datos
      await loadProviderOrders();
      initializeOCValues();

      navigate('/tracking');
    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo actualizar el seguimiento'
      });
      console.error('Error saving tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProviderOrderFormSkeleton />
    );
  }

  return (
    <Box>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Stack spacing={3}>
          {/* Header de la OC */}
          <StepItemContent
            showHeader
            showSearchButton={false}
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



          {ordenesProveedor.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No hay órdenes de proveedor registradas para esta orden de compra
              </Typography>
            </Box>
          ) : (
            <Stack spacing={3}>
              <Box sx={{ textAlign: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: 'white', borderRadius: 2, py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: heroUIColors.primary, textAlign: 'center' }}>
                  Órdenes de Proveedor ({ordenesProveedor.length})
                </Typography>
              </Box>
              {ordenesProveedor.map((op, index) => (
                <StepItemContent
                  key={op.id}
                  showHeader
                  ResumeIcon={AssignmentIcon}
                  color="#3b82f6"
                  headerLeft={sale.empresa?.razonSocial || 'Empresa N/A'}
                  resumeContent={
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                          {op.codigoOp || `OP-${op.id}`}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                          {op.proveedor?.razonSocial || 'Proveedor N/A'}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, color: '#d1d5db', fontSize: '0.875rem' }}>
                          RUC: {op.proveedor?.ruc || 'RUC N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'flex-start' }}>
                        <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '0.875rem' }}>
                          {op.contactoProveedor?.cargo || 'Contacto'}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, color: '#d1d5db', fontSize: '0.875rem' }}>
                          Nombre: {op.contactoProveedor?.nombre || 'N/A'}
                        </Typography>
                        <Typography sx={{ fontWeight: 500, color: '#d1d5db', fontSize: '0.875rem' }}>
                          Teléfono: {op.contactoProveedor?.telefono || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  showSearchButton={false}
                  resumeButtons={
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end'
                    }}>

                      <Switch
                        // checked={op.isCompleted}
                        checkedIcon={<CheckIcon />} />

                      {/* Separador visual */}
                      <Box sx={{
                        width: '1px',
                        height: '24px',
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        mx: 0.5
                      }} />

                      {/* Botones de acción rápida */}
                      <Tooltip title="Ver/ocultar detalles">
                        <IconButton
                          size="small"
                          sx={{
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: 1.5,
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                          onClick={() => handleToggleContent(op.id.toString())}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Imprimir orden de proveedor">
                        <IconButton
                          size="small"
                          sx={{
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: 1.5,
                            color: 'white',
                            width: 36,
                            height: 36,
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                          onClick={() => handlePrintOP(op)}
                        >
                          <PrintIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  headerRight={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ color: 'white', fontSize: '0.875rem', mr: 1 }}>
                        Fecha de creación: {formattedDate(op.createdAt)}
                      </Typography>
                    </Box>
                  }
                >
                  {expandedContent[op.id.toString()] && (
                    <>
                      <Box sx={{ mb: 3 }}>
                        {/* Información del proveedor y cronograma de fechas en la misma fila */}
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          <Grid size={{ xs: 12, md: 12 }}>
                            <Box sx={{
                              bgcolor: '#f8fafc',
                              borderRadius: 2,
                              p: 2.5,
                              border: '1px solid #e2e8f0',
                              height: '100%'
                            }}>
                              <Typography variant="body2" color="text.secondary" sx={{
                                mb: 2,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                textAlign: 'left'
                              }}>
                                <ScheduleIcon sx={{ color: '#3b82f6', fontSize: 14, mr: 1 }} />
                                Cronograma de Fechas
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                      Fecha Máxima de Entrega
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#dc2626', fontSize: '1rem' }}>
                                      {formattedDate(sale.fechaMaxForm) || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                      Recepción
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
                                      {formattedDate(op.fechaRecepcion) || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                      Programada
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#7c3aed', fontSize: '1rem' }}>
                                      {formattedDate(op.fechaProgramada) || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid size={{ xs: 6, md: 3 }}>
                                  <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                      Despacho
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1rem' }}>
                                      {formattedDate(op.fechaDespacho) || 'N/A'}
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Productos de la OP */}
                      {op.productos && op.productos.length > 0 && (
                        <Grid size={12}>
                          <Box sx={{
                            bgcolor: '#f8fafc',
                            borderRadius: 2,
                            p: 2.5,
                            mb: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                          }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 2
                            }}>
                              <Typography variant="body2" color="text.secondary" sx={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                textAlign: 'left'
                              }}>
                                <InventoryIcon sx={{ color: '#10b981', fontSize: 14, mr: 1 }} />
                                Productos ({op.productos.length})
                              </Typography>
                              <Chip
                                label={`Total: ${formatCurrency(op.productos.reduce((sum, p) => sum + parseFloat(p.total || '0'), 0))}`}
                                size="small"
                                sx={{
                                  bgcolor: '#dcfce7',
                                  color: '#166534',
                                  fontWeight: 600,
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>

                            <TableContainer sx={{
                              borderRadius: 2,
                              border: '1px solid #e2e8f0',
                              overflow: 'hidden',
                              mt: 1
                            }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb'
                                    }}>
                                      Código
                                    </TableCell>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb'
                                    }}>
                                      Descripción
                                    </TableCell>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb',
                                      textAlign: 'center'
                                    }}>
                                      U.Medida
                                    </TableCell>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb',
                                      textAlign: 'center'
                                    }}>
                                      Cantidad
                                    </TableCell>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb',
                                      textAlign: 'right'
                                    }}>
                                      P. Unitario
                                    </TableCell>
                                    <TableCell sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 700,
                                      color: '#374151',
                                      p: 1.5,
                                      borderBottom: '2px solid #e5e7eb',
                                      textAlign: 'right'
                                    }}>
                                      Total
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {op.productos.map((producto, idx: number) => (
                                    <TableRow
                                      key={idx}
                                      sx={{
                                        '&:nth-of-type(odd)': { bgcolor: '#f9fafb' },
                                        '&:hover': { bgcolor: '#f3f4f6' },
                                        transition: 'background-color 0.2s ease'
                                      }}
                                    >
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        p: 1.5,
                                        fontWeight: 600,
                                        color: '#1f2937'
                                      }}>
                                        {producto.codigo || 'N/A'}
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        p: 1.5,
                                        maxWidth: 200,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {producto.descripcion || 'N/A'}
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        p: 1.5,
                                        textAlign: 'center',
                                        fontWeight: 500,
                                        color: '#6b7280'
                                      }}>
                                        {producto.unidadMedida || 'N/A'}
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        p: 1.5,
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#1f2937'
                                      }}>
                                        {producto.cantidad || 'N/A'}
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        p: 1.5,
                                        textAlign: 'right',
                                        fontWeight: 500,
                                        color: '#6b7280'
                                      }}>
                                        {formatCurrency(parseFloat(producto.precioUnitario || '0'))}
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        p: 1.5,
                                        color: '#10b981',
                                        textAlign: 'right'
                                      }}>
                                        {formatCurrency(parseFloat(producto.total || '0'))}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </Grid>
                      )}

                      {/* FORMULARIO DE SEGUIMIENTO PARA CADA OP */}
                      <Grid size={12}>
                        <Box sx={{
                          bgcolor: '#ffffff',
                          borderRadius: 3,
                          p: 4,
                          mt: 3,
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                          {/* Header del formulario */}
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 3,
                            pb: 2,
                            borderBottom: '2px solid #f1f5f9'
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{
                                bgcolor: '#10b981',
                                borderRadius: '50%',
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <EditIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="h6" sx={{
                                  fontWeight: 700,
                                  color: '#1e293b',
                                  mb: 0.5,
                                  fontSize: '1.125rem'
                                }}>
                                  Formulario de Seguimiento
                                </Typography>
                                <Typography variant="body2" sx={{
                                  color: '#6b7280',
                                  fontWeight: 500,
                                  fontSize: '0.875rem'
                                }}>
                                  OP {index + 1} - {op.codigoOp || `OP-${op.id}`}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {changedFields[op.id.toString()] && changedFields[op.id.toString()].size > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Tooltip title={`Guardar ${changedFields[op.id.toString()].size} cambios`}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => saveOPChanges(op.id.toString())}
                                      disabled={savingOP === op.id.toString()}
                                      startIcon={<SaveIcon />}
                                      sx={{
                                        bgcolor: '#10b981',
                                        '&:hover': {
                                          bgcolor: '#059669'
                                        },
                                        '&:disabled': {
                                          bgcolor: '#6b7280'
                                        },
                                        fontSize: '0.75rem',
                                        px: 2,
                                        py: 0.5,
                                        minWidth: 'auto'
                                      }}
                                    >
                                      {savingOP === op.id.toString() ? 'Guardando...' : `Guardar (${changedFields[op.id.toString()].size})`}
                                    </Button>
                                  </Tooltip>

                                  <Tooltip title="Cancelar cambios">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => cancelOPChanges(op.id.toString())}
                                      disabled={savingOP === op.id.toString()}
                                      sx={{
                                        borderColor: '#d1d5db',
                                        color: '#6b7280',
                                        minWidth: 'auto',
                                        px: 1,
                                        py: 0.5,
                                        '&:hover': {
                                          borderColor: '#9ca3af',
                                          backgroundColor: alpha('#f3f4f6', 0.5),
                                        },
                                        '&:disabled': {
                                          borderColor: '#d1d5db',
                                          color: '#9ca3af'
                                        }
                                      }}
                                    >
                                      <CancelIcon sx={{ fontSize: 16 }} />
                                    </Button>
                                  </Tooltip>
                                </Box>
                              )}
                            </Box>
                          </Box>

                          {/* Campos del formulario */}
                          <Grid container spacing={3}>
                            {/* Primera fila: Tipo de Entrega, Estado OP, Fecha Entrega */}
                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Tipo de Entrega
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'tipoEntrega']}
                                initialValue={op.tipoEntrega}
                                style={{ marginBottom: 0 }}
                              >
                                <SelectGeneric
                                  placeholder="Seleccionar tipo"
                                  options={[
                                    { value: 'PARCIAL', label: 'Parcial' },
                                    { value: 'TOTAL', label: 'Total' }
                                  ]}
                                  onChange={(value) => handleFieldChange(op.id.toString(), 'tipoEntrega', value)}
                                />
                              </Form.Item>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Estado OP
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'estadoOp']}
                                initialValue={op.estadoOp}
                                style={{ marginBottom: 0 }}
                              >
                                <SelectGeneric
                                  placeholder="Seleccionar estado"
                                  options={[
                                    { value: 'RECHAZADO', label: 'Rechazado' },
                                    { value: 'CONFORME', label: 'Conforme' },
                                    { value: 'OBSERVADO', label: 'Observado' }
                                  ]}
                                  onChange={(value) => handleFieldChange(op.id.toString(), 'estadoOp', value)}
                                />
                              </Form.Item>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Fecha de Entrega
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'fechaEntrega']}
                                initialValue={op.fechaEntrega ? dayjs(op.fechaEntrega) : null}
                                style={{ marginBottom: 0 }}
                              >
                                <DatePickerAntd
                                  placeholder="Seleccionar fecha"
                                  onChange={(value) => handleFieldChange(op.id.toString(), 'fechaEntrega', value)}
                                />
                              </Form.Item>
                            </Grid>

                            {/* Segunda fila: Cargo OEA, Retorno de Mercadería */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Cargo OEA
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'cargoOea']}
                                initialValue={op.cargoOea}
                                style={{ marginBottom: 0 }}
                              >
                                <InputAntd
                                  placeholder="Ingrese cargo OEA"
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(op.id.toString(), 'cargoOea', e.target.value)}
                                />
                              </Form.Item>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Retorno de Mercadería
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Form.Item
                                  name={[`op_${op.id}`, 'retornoMercaderia']}
                                  initialValue={op.retornoMercaderia}
                                  style={{ marginBottom: 0 }}
                                >
                                  <SelectGeneric
                                    placeholder="Seleccionar retorno"
                                    options={[
                                      { value: 'NINGUNO', label: 'Ninguno' },
                                      { value: 'ENTIDAD', label: 'Entidad' },
                                      { value: 'TRANSPORTE', label: 'Transporte' },
                                      { value: 'ALMACEN_LIMA', label: 'Almacén Lima' },
                                      { value: 'ALMACEN_HUANCAYO', label: 'Almacén Huancayo' },
                                      { value: 'OTROS', label: 'Otros' }
                                    ]}
                                    onChange={(value) => {
                                      handleFieldChange(op.id.toString(), 'retornoMercaderia', value);
                                      // Limpiar valor personalizado si no es "OTROS"
                                      if (value !== 'OTROS') {
                                        setCustomRetornoValues(prev => {
                                          const newValues = { ...prev };
                                          delete newValues[op.id.toString()];
                                          return newValues;
                                        });
                                      }
                                    }}
                                  />
                                </Form.Item>

                                {/* Campo de texto personalizado cuando se selecciona "OTROS" */}
                                {form.getFieldValue([`op_${op.id}`, 'retornoMercaderia']) === 'OTROS' && (
                                  <Form.Item style={{ marginBottom: 0 }}>
                                    <InputAntd
                                      placeholder="Especificar otro tipo de retorno"
                                      value={customRetornoValues[op.id.toString()] || ''}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = e.target.value;
                                        setCustomRetornoValues(prev => ({
                                          ...prev,
                                          [op.id.toString()]: value
                                        }));
                                        // Actualizar el valor real que se guardará
                                        handleFieldChange(op.id.toString(), 'retornoMercaderia', `OTROS: ${value}`);
                                      }}
                                    />
                                  </Form.Item>
                                )}
                              </Box>
                            </Grid>

                            {/* Tercera fila: Nota de Observaciones */}
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Nota de Observaciones
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'notaObservaciones']}
                                initialValue={op.notaObservaciones}
                                style={{ marginBottom: 0 }}
                              >
                                <TextArea
                                  placeholder="Ingrese observaciones adicionales"
                                  rows={3}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(op.id.toString(), 'notaObservaciones', e.target.value)}
                                />
                              </Form.Item>
                            </Grid>

                            {/* Cuarta fila: Nota de Cobranzas */}
                            <Grid size={{ xs: 12 }}>
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                mb: 1.5,
                                color: '#374151',
                                fontSize: '0.875rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                              }}>
                                Nota de Cobranzas
                              </Typography>
                              <Form.Item
                                name={[`op_${op.id}`, 'notaCobranzas']}
                                initialValue={op.notaCobranzas}
                                style={{ marginBottom: 0 }}
                              >
                                <TextArea
                                  placeholder="Ingrese información de cobranzas"
                                  rows={3}
                                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(op.id.toString(), 'notaCobranzas', e.target.value)}
                                />
                              </Form.Item>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </>
                  )}
                </StepItemContent>
              ))}
            </Stack>
          )}

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

              {/* Los 4 campos en una fila */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Fecha Entrega OC
                  </Typography>
                  <Form.Item
                    name="fechaEntregaOC"
                    rules={[{ required: true, message: 'Fecha requerida' }]}
                    style={{ marginBottom: 0 }}
                    initialValue={sale.fechaEntregaOc ? dayjs(sale.fechaEntregaOc) : null}
                  >
                    <DatePickerAntd
                      placeholder="Seleccionar fecha"
                      onChange={(value) => handleOCFieldChange('fechaEntregaOC', value)}
                    />
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Cargo de Entrega OC PERU COMPRAS
                  </Typography>
                  <Form.Item
                    name="documentoPeruCompras"
                    initialValue={sale.documentoPeruCompras}
                  >
                    <SimpleFileUpload
                      onChange={(file) => handleOCFieldChange('documentoPeruCompras', file)}
                      accept="application/pdf"
                    />
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Fecha Perú Compras
                  </Typography>
                  <Form.Item
                    name="fechaPeruCompras"
                    style={{ marginBottom: 0 }}
                    initialValue={sale.fechaPeruCompras ? dayjs(sale.fechaPeruCompras) : null}
                  >
                    <DatePickerAntd
                      placeholder="Seleccionar fecha"
                      onChange={(value) => handleOCFieldChange('fechaPeruCompras', value)}
                    />
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                  <Typography sx={{ color: 'white', mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                    Carta de Ampliación
                  </Typography>
                  <Form.Item
                    name="cartaAmpliacion"
                    initialValue={sale.cartaAmpliacion}
                  >
                    <SimpleFileUpload
                      onChange={(file) => handleOCFieldChange('cartaAmpliacion', file)}
                      accept="application/pdf"
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
                onClick={saveOCChanges}
                disabled={savingOC}
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

      {/* Modal de Resumen de Transportes */}
      <Modal
        open={Object.values(openModal).some(Boolean)}
        onClose={() => setOpenModal({})}
        aria-labelledby="resumen-modal-title"
        aria-describedby="resumen-modal-description"
      >
        <MuiBox sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'auto',
        }}>
          <Box sx={{ p: 4 }}>
            <Typography id="resumen-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
              Resumen de Transportes - OP {ordenesProveedor.find(op => openModal[op.id.toString()])?.codigoOp || ''}
            </Typography>

            {(() => {
              const currentOp = ordenesProveedor.find(op => openModal[op.id.toString()]);
              if (!currentOp) return null;

              return (
                <Box>
                  {/* Transportes Asignados Existentes */}
                  {currentOp.transportesAsignados && currentOp.transportesAsignados.length > 0 ? (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                        Transportes Asignados
                      </Typography>
                      <Grid container spacing={2}>
                        {currentOp.transportesAsignados.map((transporteAsignado) => (
                          <Grid size={{ xs: 12, md: 6 }} key={transporteAsignado.id}>
                            <Box sx={{
                              bgcolor: '#f8fafc',
                              borderRadius: 2,
                              p: 2.5,
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                              height: '100%'
                            }}>
                              <Typography variant="body2" color="text.secondary" sx={{
                                mb: 1.5,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                textAlign: 'left'
                              }}>
                                <LocalShippingIcon sx={{ color: '#10b981', fontSize: 14, mr: 1 }} />
                                {transporteAsignado.transporte?.razonSocial || 'N/A'}
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  Código: {transporteAsignado.codigoTransporte}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  RUC: {transporteAsignado.transporte?.ruc || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  Destino: {transporteAsignado.tipoDestino} - {transporteAsignado.direccion}
                                </Typography>
                                {transporteAsignado.montoFlete !== null && transporteAsignado.montoFlete !== undefined && (
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', fontSize: '0.75rem' }}>
                                    Flete: {formatCurrency(parseFloat(String(transporteAsignado.montoFlete)))}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        No hay transportes asignados para esta OP
                      </Typography>
                    </Box>
                  )}

                  {/* Formulario para Agregar Nuevo Transporte */}
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
                      Agregar Nuevo Transporte
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
                          Número de Factura
                        </Typography>
                        <InputAntd
                          placeholder="Ingrese número de factura"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
                          Archivo de Factura
                        </Typography>
                        <SimpleFileUpload
                          accept="application/pdf"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
                          Guía de Remisión
                        </Typography>
                        <SimpleFileUpload
                          accept="application/pdf"
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#374151' }}>
                          Guía de Transporte
                        </Typography>
                        <SimpleFileUpload
                          accept="application/pdf"
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                      <Button onClick={() => setOpenModal({})} variant="outlined">
                        Cancelar
                      </Button>
                      <Button variant="contained" sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
                        Agregar Transporte
                      </Button>
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </Box>
        </MuiBox>
      </Modal>
    </Box>
  );
};

export default TrackingFormContent;
