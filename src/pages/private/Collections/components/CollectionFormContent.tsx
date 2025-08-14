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
  IconButton,
  Chip
} from '@mui/material';
import {
  Save,
  Business,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { notification, Spin, Form, Input, DatePicker, Select, Modal, Row, Col } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  getGestionesCobranza,
  updateCobranzaFields,
  createGestionCobranza,
  updateGestionCobranza,
  deleteGestionCobranza,
  getCobranzaByOrdenCompra,
  type GestionCobranza,
  type CobranzaData
} from '@/services/cobranza/cobranza.service';
import { heroUIColors } from '@/components/ui';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import DatePickerAntd from '@/components/DatePickerAnt';

interface CollectionFormContentProps {
  sale: SaleProps;
}

const estadosCobranzaOptions = [
  { label: 'Normal', value: 'NORMAL' },
  { label: 'REQ - Requerimiento', value: 'REQ' },
  { label: 'PC1 - Primer Cobro', value: 'PC1' },
  { label: 'PC2 - Segundo Cobro', value: 'PC2' },
  { label: 'PC3 - Tercer Cobro', value: 'PC3' },
  { label: 'CI - Carta de Intimación', value: 'CI' },
  { label: 'RP - Reclamo Patrimonial', value: 'RP' },
  { label: 'DJ - Demanda Judicial', value: 'DJ' }
];

const etapasSiafOptions = [
  { label: 'COM', value: 'COM' },
  { label: 'DEV', value: 'DEV' },
  { label: 'PAG', value: 'PAG' },
  { label: 'SSIAF', value: 'SSIAF' },
  { label: 'RES', value: 'RES' },
  { label: 'GIR', value: 'GIR' },
  { label: 'GIR-F', value: 'GIR-F' },
  { label: 'GIR-V', value: 'GIR-V' },
  { label: 'GIR-A', value: 'GIR-A' },
  { label: 'GIR-R', value: 'GIR-R' }
];

const tipoCobranzaOptions = [
  { label: 'Gestión telefónica', value: 'TELEFONICA' },
  { label: 'Visita presencial', value: 'PRESENCIAL' },
  { label: 'Correo electrónico', value: 'EMAIL' },
  { label: 'Carta notarial', value: 'CARTA_NOTARIAL' },
  { label: 'Reunión coordinación', value: 'REUNION' }
];

export const CollectionFormContent = ({ sale }: CollectionFormContentProps) => {
  const [form] = Form.useForm();
  const [gestionForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gestiones, setGestiones] = useState<GestionCobranza[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGestion, setEditingGestion] = useState<GestionCobranza | null>(null);
  const [gestionesLoading, setGestionesLoading] = useState(false);
  const [originalCobranzaData, setOriginalCobranzaData] = useState<CobranzaData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPenalidad, setCurrentPenalidad] = useState(0);

  // Cálculos automáticos
  const importeTotal = parseFloat(sale.montoVenta || '0');
  const porcentajeRetencion = parseFloat(sale.facturacion?.retencion?.toString() || '0');
  const porcentajeDetraccion = parseFloat(sale.facturacion?.detraccion?.toString() || '0');
  const valorRetencion = (importeTotal * porcentajeRetencion / 100).toFixed(2);
  const valorDetraccion = (importeTotal * porcentajeDetraccion / 100).toFixed(2);
  
  // Calcular neto cobrado usando la penalidad actual del estado
  const netoCobrado = (importeTotal - parseFloat(valorRetencion) - parseFloat(valorDetraccion) - currentPenalidad).toFixed(2);  useEffect(() => {
    loadInitialData();
  }, [sale.id]);

  // Efecto para recalcular valores cuando cambia la penalidad
  useEffect(() => {
    const subscription = form.getFieldsValue();
    // Este efecto se ejecutará cuando el formulario cambie
  }, [form]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Cargar datos de cobranza
      const cobranzaData = await getCobranzaByOrdenCompra(sale.id);

      // Guardar datos originales para comparación
      setOriginalCobranzaData(cobranzaData);

      // Configurar el formulario con los datos
      form.setFieldsValue({
        etapaSiaf: cobranzaData.etapaSiaf || '',
        fechaSiaf: cobranzaData.fechaSiaf ? dayjs(cobranzaData.fechaSiaf) : null,
        penalidad: cobranzaData.penalidad || '',
        estadoCobranza: cobranzaData.estadoCobranza || '',
        fechaEstadoCobranza: cobranzaData.fechaEstadoCobranza ? dayjs(cobranzaData.fechaEstadoCobranza) : null,
      });

      // Inicializar penalidad para cálculo de neto cobrado
      setCurrentPenalidad(parseFloat(cobranzaData.penalidad || '0'));

      // Cargar gestiones
      await loadGestiones();

    } catch (error) {
      console.error('Error loading collection data:', error);
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar los datos de cobranza'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGestiones = async () => {
    try {
      setGestionesLoading(true);
      const gestionesData = await getGestionesCobranza(sale.id);
      setGestiones(gestionesData);
    } catch (error) {
      console.error('Error loading gestiones:', error);
      notification.error({
        message: 'Error al cargar gestiones',
        description: 'No se pudieron cargar las gestiones de cobranza'
      });
      setGestiones([]); // Inicializar como array vacío en caso de error
    } finally {
      setGestionesLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/collections');
  };

  /**
   * Compara los valores actuales con los originales y retorna solo los campos que cambiaron
   */
  const getChangedFields = (currentValues: CollectionFormValues): Partial<CobranzaData> => {
    if (!originalCobranzaData) return {};

    const changedFields: Partial<CobranzaData> = {};

    // Comparar etapaSiaf
    const currentEtapaSiaf = currentValues.etapaSiaf || '';
    const originalEtapaSiaf = originalCobranzaData.etapaSiaf || '';
    if (currentEtapaSiaf !== originalEtapaSiaf) {
      changedFields.etapaSiaf = currentEtapaSiaf;
    }

    // Comparar fechaSiaf
    const currentFechaSiaf = currentValues.fechaSiaf ? currentValues.fechaSiaf.format('YYYY-MM-DD') : '';
    const originalFechaSiaf = originalCobranzaData.fechaSiaf ? dayjs(originalCobranzaData.fechaSiaf).format('YYYY-MM-DD') : '';
    if (currentFechaSiaf !== originalFechaSiaf) {
      changedFields.fechaSiaf = currentFechaSiaf || undefined;
    }

    // Comparar penalidad
    const currentPenalidad = currentValues.penalidad || '';
    const originalPenalidad = originalCobranzaData.penalidad || '';
    if (currentPenalidad !== originalPenalidad) {
      changedFields.penalidad = currentPenalidad;
    }

    // Comparar estadoCobranza
    const currentEstadoCobranza = currentValues.estadoCobranza || '';
    const originalEstadoCobranza = originalCobranzaData.estadoCobranza || '';
    if (currentEstadoCobranza !== originalEstadoCobranza) {
      changedFields.estadoCobranza = currentEstadoCobranza;
    }

    // Comparar fechaEstadoCobranza
    const currentFechaEstadoCobranza = currentValues.fechaEstadoCobranza ? currentValues.fechaEstadoCobranza.format('YYYY-MM-DD') : '';
    const originalFechaEstadoCobranza = originalCobranzaData.fechaEstadoCobranza ? dayjs(originalCobranzaData.fechaEstadoCobranza).format('YYYY-MM-DD') : '';
    if (currentFechaEstadoCobranza !== originalFechaEstadoCobranza) {
      changedFields.fechaEstadoCobranza = currentFechaEstadoCobranza || undefined;
    }

    return changedFields;
  };

  /**
   * Detecta si hay cambios en el formulario comparando con los datos originales
   * y actualiza los valores calculados
   */
  const checkForChanges = () => {
    const currentValues = form.getFieldsValue();
    const changedFields = getChangedFields(currentValues);
    const hasChangesNow = Object.keys(changedFields).length > 0;
    setHasChanges(hasChangesNow);
    
    // Actualizar penalidad para recalcular neto cobrado en tiempo real
    const newPenalidad = parseFloat(currentValues.penalidad || '0');
    setCurrentPenalidad(newPenalidad);
  };

  interface CollectionFormValues {
    etapaSiaf?: string;
    fechaSiaf?: Dayjs | null;
    penalidad?: string;
    estadoCobranza?: string;
    fechaEstadoCobranza?: Dayjs | null;
  }

  const handleFinish = async (values: CollectionFormValues) => {
    try {
      setLoading(true);

      // Obtener solo los campos que cambiaron
      const changedFields = getChangedFields(values);

      // Si no hay cambios, no hacer la petición
      if (Object.keys(changedFields).length === 0) {
        notification.info({
          message: 'Sin cambios',
          description: 'No se detectaron cambios en los datos de cobranza'
        });
        setLoading(false);
        return;
      }

      console.log('Campos que cambiaron:', changedFields);

      await updateCobranzaFields(sale.id, changedFields);
      
      // Actualizar los datos originales con los nuevos valores
      setOriginalCobranzaData(prev => ({ ...prev, ...changedFields }));

      notification.success({
        message: 'Cobranza actualizada',
        description: `Se actualizaron ${Object.keys(changedFields).length} campo(s) correctamente`
      });
      navigate('/collections');

    } catch (error) {
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar la información de cobranza'
      });
      console.error('Error saving collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGestion = () => {
    setEditingGestion(null);
    gestionForm.resetFields();
    setModalVisible(true);
  };

  const handleEditGestion = (gestion: GestionCobranza) => {
    setEditingGestion(gestion);
    gestionForm.setFieldsValue({
      ...gestion,
      fechaGestion: gestion.fechaGestion ? dayjs(gestion.fechaGestion) : undefined
    });
    setModalVisible(true);
  };

  interface GestionFormValues {
    fechaGestion?: Dayjs | null;
    notaGestion?: string;
    estadoCobranza?: string;
    tipoCobranza?: string;
    voucherPagoUrl?: string;
    pagoConformeTesoreria?: boolean;
    cartaAmpliacionUrl?: string;
    capturaEnvioDocumentoUrl?: string;
    archivosAdjuntosNotasGestion?: string;
    documentosRegistrados?: string;
    notaEspecialEntrega?: string;
  }

  const handleSaveGestion = async (values: GestionFormValues) => {
    try {
      const gestionData: Partial<GestionCobranza> = {
        ordenCompraId: sale.id,
        fechaGestion: values.fechaGestion ? values.fechaGestion.format('YYYY-MM-DD') : '',
        notaGestion: values.notaGestion || '',
        estadoCobranza: values.estadoCobranza || '',
        tipoCobranza: values.tipoCobranza || '',
        voucherPagoUrl: values.voucherPagoUrl || '',
        pagoConformeTesoreria: values.pagoConformeTesoreria || false,
        cartaAmpliacionUrl: values.cartaAmpliacionUrl || '',
        capturaEnvioDocumentoUrl: values.capturaEnvioDocumentoUrl || '',
        archivosAdjuntosNotasGestion: values.archivosAdjuntosNotasGestion || '',
        documentosRegistrados: values.documentosRegistrados || '',
        notaEspecialEntrega: values.notaEspecialEntrega || '',
        usuarioId: 1 // TODO: Obtener del contexto de usuario
      };

      if (editingGestion) {
        // Editar gestión existente
        const updatedGestion = await updateGestionCobranza(editingGestion.id!, gestionData);
        const updatedGestiones = gestiones.map(g =>
          g.id === editingGestion.id ? updatedGestion : g
        );
        setGestiones(updatedGestiones);
      } else {
        // Agregar nueva gestión
        const newGestion = await createGestionCobranza(gestionData as Omit<GestionCobranza, 'id' | 'createdAt' | 'updatedAt'>);
        setGestiones([newGestion, ...gestiones]);
      }

      setModalVisible(false);
      gestionForm.resetFields();

      notification.success({
        message: 'Gestión guardada',
        description: 'La gestión se ha guardado correctamente'
      });
    } catch (error) {
      notification.error({
        message: 'Error al guardar gestión',
        description: 'No se pudo guardar la gestión'
      });
      console.error('Error saving gestion:', error);
    }
  };

  const handleDeleteGestion = (id: number) => {
    Modal.confirm({
      title: '¿Eliminar gestión?',
      content: '¿Está seguro de que desea eliminar esta gestión?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteGestionCobranza(id);
          setGestiones(gestiones.filter(g => g.id !== id));
          notification.success({
            message: 'Gestión eliminada',
            description: 'La gestión se ha eliminado correctamente'
          });
        } catch (error) {
          notification.error({
            message: 'Error al eliminar gestión',
            description: 'No se pudo eliminar la gestión'
          });
          console.error('Error deleting gestion:', error);
        }
      }
    });
  };

  const getEstadoLabel = (estado: string) => {
    const option = estadosCobranzaOptions.find(opt => opt.value === estado);
    return option ? option.label : estado;
  };

  const getTipoLabel = (tipo: string) => {
    const option = tipoCobranzaOptions.find(opt => opt.value === tipo);
    return option ? option.label : tipo;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Spin spinning={loading}>
        {/* Barra Negra de OP */}
        <StepItemContent
          showHeader={true}
          color="#1071d1ff"
          ResumeIcon={Business}
          headerLeft={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ fontWeight: 600, color: heroUIColors.primary }}>
                {sale.empresa?.razonSocial}  -  RUC: {sale.empresa?.ruc}
              </Typography>
            </Stack>
          }
          headerRight={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ fontWeight: 600, color: heroUIColors.primary }}>
                Fecha registro: {sale.createdAt ? formattedDate(sale.createdAt) : '-'}
              </Typography>
            </Stack>
          }
          resumeContent={
            <Stack direction="column" alignItems="left">
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'gray' }}>
                Gestión de Cobranza
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
                {sale.codigoVenta}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>
                {sale.cliente?.razonSocial} - RUC: {sale.cliente?.ruc}
              </Typography>
            </Stack>
          }
          showSearchButton={false}
          children={
            <Box sx={{ my: 1 }}>
              {/* Grid minimalista - Exactamente 3 columnas */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 1.5,
                mb: 2
              }}>
                {/* Card 1: SIAF */}
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
                      SIAF
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale.siaf || 'No registrado'}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Card 2: Fecha SIAF */}
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
                      Fecha SIAF
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale.fechaSiaf ? formattedDate(sale.fechaSiaf) : 'No registrado'}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Card 3: Unidad Ejecutora */}
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
                      Unidad Ejecutora
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale.cliente?.codigoUnidadEjecutora || 'No asignado'}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Card 4: Factura */}
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
                      Número Factura
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale?.facturacion?.factura || 'Pendiente'}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Card 5: Fecha Factura */}
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
                      Fecha Factura
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale?.facturacion?.fechaFactura ? formattedDate(sale?.facturacion?.fechaFactura) : 'No registrado'}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Card 6: Fecha Entrega OC */}
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
                      Fecha Entrega OC
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.9rem' }}>
                      {sale?.fechaEntregaOc ? formattedDate(sale?.fechaEntregaOc) : 'No registrado'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

              {/* Sección de documentos - Solo si hay documentos disponibles */}
              {(sale?.documentoPeruCompras || sale?.documentoOce || sale?.documentoOcf) && (
                <Box sx={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Typography variant="caption" sx={{ 
                    color: '#BDBDBD', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    mb: 1,
                    pl: 1,
                    display: 'block'
                  }}>
                    DOCUMENTOS DISPONIBLES
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 1
                  }}>
                    {/* Perú Compras */}
                    {sale?.documentoPeruCompras && (
                      <Card sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid #e0e0e0',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: 'none'
                      }}>
                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 }, width: '100%' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                                PERÚ COMPRAS
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.85rem' }}>
                                Documento disponible
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => window.open(sale.documentoPeruCompras, '_blank')}
                              sx={{
                                color: '#424242',
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                              }}
                              title="Ver documento Perú Compras"
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {/* OCE */}
                    {sale?.documentoOce && (
                      <Card sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid #e0e0e0',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: 'none'
                      }}>
                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 }, width: '100%' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                                DOCUMENTO OCE
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.85rem' }}>
                                OCE disponible
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => window.open(sale.documentoOce, '_blank')}
                              sx={{
                                color: '#424242',
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                              }}
                              title="Ver documento OCE"
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {/* OCF */}
                    {sale?.documentoOcf && (
                      <Card sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        border: '1px solid #e0e0e0',
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        boxShadow: 'none'
                      }}>
                        <CardContent sx={{ py: 1, px: 1.5, '&:last-child': { pb: 1 }, width: '100%' }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                                DOCUMENTO OCF
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#424242', fontSize: '0.85rem' }}>
                                OCF disponible
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => window.open(sale.documentoOcf, '_blank')}
                              sx={{
                                color: '#424242',
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                              }}
                              title="Ver documento OCF"
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          }
        >
        </StepItemContent>
        
        {/* mostrar productos de oc */}
        { sale.productos && sale.productos.length > 0 && (
          <Card sx={{ my: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  OP PERÚ COMPRAS
                </Typography>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Codigo</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Marca</TableCell>
                      <TableCell>Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sale.productos.map((producto) => (
                      <TableRow key={producto.codigo}>
                        <TableCell>{producto.codigo}</TableCell>
                        <TableCell>{producto.descripcion}</TableCell>
                        <TableCell>{producto.marca}</TableCell>
                        <TableCell>{producto.cantidad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {/* Gestiones - Grid 3x3 */}
        <Card sx={{ my: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <MoneyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Gestiones de Cobranza
              </Typography>
            </Stack>

            <Form form={form} layout="vertical" onFinish={handleFinish} onValuesChange={checkForChanges}>
              <Row gutter={[24, 16]}>
                {/* Fila 1 */}
                <Col span={8}>
                  <Form.Item
                    label="Importe Total OC"
                    name="importeTotal"
                    initialValue={formatCurrency(parseInt(sale.montoVenta, 10))}
                  >
                    <InputAntd disabled style={{ backgroundColor: '#f5f5f5' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Etapa SIAF" name="etapaSiaf">
                    <SelectGeneric placeholder="Seleccionar etapa" options={etapasSiafOptions} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Fecha SIAF" name="fechaSiaf">
                    <DatePickerAntd placeholder="Seleccionar fecha" />
                  </Form.Item>
                </Col>

                {/* Fila 2 */}
                <Col span={8}>
                  <Form.Item 
                    label={porcentajeRetencion > 0 ? `Retención ${porcentajeRetencion}%` : 'Retención 0%'} 
                  >
                    <InputAntd 
                      disabled 
                      placeholder="0.00" 
                      value={formatCurrency(parseFloat(valorRetencion))}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label={porcentajeDetraccion > 0 ? `Detracción ${porcentajeDetraccion}%` : 'Detracción 0%'} 
                  >
                    <InputAntd 
                      disabled 
                      placeholder="0.00" 
                      value={formatCurrency(parseFloat(valorDetraccion))}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Penalidad (S/)" name="penalidad">
                    <InputAntd placeholder="0.00" />
                  </Form.Item>
                </Col>

                {/* Fila 3 */}
                <Col span={8}>
                  <Form.Item label="Neto Cobrado">
                    <InputAntd 
                      disabled 
                      placeholder="0.00" 
                      value={formatCurrency(parseFloat(netoCobrado))}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Estado de Cobranza Morosa" name="estadoCobranza">
                    <SelectGeneric placeholder="Seleccionar estado" options={estadosCobranzaOptions} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Fecha Estado de Cobranzas" name="fechaEstadoCobranza">
                    <DatePickerAntd placeholder="Seleccionar fecha" />
                  </Form.Item>
                </Col>
              </Row>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={handleBack}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={() => form.submit()}
                  startIcon={<Save />}
                  disabled={loading || !hasChanges}
                  color={hasChanges ? "primary" : "inherit"}
                >
                  {hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
                </Button>
              </Box>
            </Form>
          </CardContent>
        </Card>

        {/* Historial de Gestiones */}
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historial de Gestiones
                </Typography>
              </Stack>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddGestion}
                size="small"
              >
                Nueva Gestión
              </Button>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Nota</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gestionesLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Spin />
                      </TableCell>
                    </TableRow>
                  ) : gestiones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          No hay gestiones registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    gestiones.map((gestion) => (
                      <TableRow key={gestion.id} hover>
                        <TableCell>
                          {gestion.fechaGestion ? formattedDate(gestion.fechaGestion) : '-'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {gestion.usuario?.nombre || 'Usuario no disponible'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getTipoLabel(gestion.tipoCobranza)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getEstadoLabel(gestion.estadoCobranza)}
                            size="small"
                            color={gestion.estadoCobranza === 'NORMAL' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {gestion.notaGestion || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditGestion(gestion)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteGestion(gestion.id!)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Spin>

      {/* Modal para gestiones */}
      <Modal
        title={editingGestion ? 'Editar Gestión' : 'Nueva Gestión'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={gestionForm}
          layout="vertical"
          onFinish={handleSaveGestion}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fecha de Gestión"
                name="fechaGestion"
                rules={[{ required: true, message: 'Seleccione una fecha' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tipo de Cobranza"
                name="tipoCobranza"
                rules={[{ required: true, message: 'Seleccione un tipo' }]}
              >
                <Select options={tipoCobranzaOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Estado de Cobranza"
                name="estadoCobranza"
                rules={[{ required: true, message: 'Seleccione un estado' }]}
              >
                <Select options={estadosCobranzaOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Nota de Gestión"
            name="notaGestion"
            rules={[{ required: true, message: 'Ingrese una nota' }]}
          >
            <Input.TextArea rows={4} placeholder="Detalle de la gestión realizada..." />
          </Form.Item>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={() => setModalVisible(false)}>
              Cancelar
            </Button>
            <Button
              style={{ backgroundColor: '#1976d2', color: 'white' }}
              onClick={() => gestionForm.submit()}
            >
              {editingGestion ? 'Actualizar' : 'Crear'} Gestión
            </Button>
          </Box>
        </Form>
      </Modal>
    </Box>
  );
};

export default CollectionFormContent;
