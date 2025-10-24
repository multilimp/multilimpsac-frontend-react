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
  Chip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Save,
  Business,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  GetApp as DownloadIcon,
  EditOutlined,
  VisibilityOutlined,
  ViewList,
  ViewModule,
  People
} from '@mui/icons-material';
import { notification, Spin, Form, Input, DatePicker, Select, Modal, Row, Col, Checkbox } from 'antd';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  getGestionesCobranza,
  updateCobranzaFields,
  assignCobrador,
  createGestionCobranza,
  updateGestionCobranza,
  deleteGestionCobranza,
  getCobranzaByOrdenCompra,
  type GestionCobranza,
  type CobranzaData
} from '@/services/cobranza/cobranza.service';
import { uploadFile } from '@/services/files/file.requests';
import {
  getArchivosAdjuntosByOrdenCompra,
  createArchivoAdjunto,
  updateArchivoAdjunto,
  deleteArchivoAdjunto
} from '@/services/archivosAdjuntos/archivosAdjuntos.requests';
import { type ArchivoAdjunto } from '@/services/archivosAdjuntos/archivosAdjuntos.d';
import { getUsers } from '@/services/users/users.request';
import { type UserProps } from '@/services/users/users.d';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import { useAppContext } from '@/context';
import { heroUIColors } from '@/components/ui';
import InputAntd from '@/components/InputAntd';
import SelectGeneric from '@/components/selects/SelectGeneric';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import apiClient from '@/services/apiClient';

interface CollectionFormContentProps {
  sale: SaleProps;
}

const estadosCobranzaOptions = [
  { label: 'REQ - Requerimiento', value: 'REQ' },
  { label: 'REIT1 - Reiterativo 1', value: 'REIT1' },
  { label: 'REIT2 - Reiterativo 2', value: 'REIT2' },
  { label: 'OCI - Org. control institucional', value: 'OCI' },
  { label: 'PC - Peru Compras', value: 'PC' },
  { label: 'MAXIMA AUTORIDAD - Entidad', value: 'MAXIMA_AUTORIDAD' },
  { label: 'CARTA NOTARIAL', value: 'CARTA_NOTARIAL' },
  { label: 'DENUNCIA JUDICIAL', value: 'DENUNCIA_JUDICIAL' }
];

// Opciones para el selector de Estado de Cobranza (Rol) usando enum EstadoRol
const estadosCobranzaRolOptions = [
  { label: 'En Proceso', value: 'EN_PROCESO' },
  { label: 'Completo', value: 'COMPLETO' },
];

const etapasSiafOptions = [
  { label: 'COM', value: 'COM' },
  { label: 'DEV', value: 'DEV' },
  { label: 'PAG', value: 'PAG' },
  { label: 'SSIAF', value: 'SSIAF' },
  { label: 'RES', value: 'RES' },
  { label: 'DEV-F', value: 'DEV-F' },
  { label: 'GIR-F', value: 'GIR-F' },
  { label: 'GIR-V', value: 'GIR-V' },
  { label: 'GIR-A', value: 'GIR-A' },
  { label: 'GIR-R', value: 'GIR-R' }
];

const tipoCobranzaOptions = [
  { label: 'Cobranza Especial', value: 'ESPECIAL' },
  { label: 'Cobranza Normal', value: 'NORMAL' }
];

const tipoGestionOptions = [
  { label: 'Gestión telefónica', value: 'TELEFONICA' },
  { label: 'Visita presencial', value: 'PRESENCIAL' },
  { label: 'Correo electrónico', value: 'EMAIL' },
  { label: 'Carta notarial', value: 'CARTA_NOTARIAL' },
  { label: 'Reunión coordinación', value: 'REUNION' }
];

const porcentajeRetencionOptions = [
  { label: '0%', value: 0 },
  { label: '3%', value: 3 }
];

const porcentajeDetraccionOptions = [
  { label: '0%', value: 0 },
  { label: '4%', value: 4 },
  { label: '9%', value: 9 },
  { label: '10%', value: 10 }
];

// Opciones para cobradores (se generan dinámicamente)
const getCobradorOptions = (cobradores: UserProps[]) => {
  return cobradores.map(cobrador => ({
    label: cobrador.nombre,
    value: cobrador.id
  }));
};

export const CollectionFormContent = ({ sale }: CollectionFormContentProps) => {
  const [form] = Form.useForm();
  const [gestionForm] = Form.useForm();
  const [cobradorForm] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [gestiones, setGestiones] = useState<GestionCobranza[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGestion, setEditingGestion] = useState<GestionCobranza | null>(null);
  const [gestionesLoading, setGestionesLoading] = useState(false);
  const [originalCobranzaData, setOriginalCobranzaData] = useState<CobranzaData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPenalidad, setCurrentPenalidad] = useState(0);

  // Estados para la galería de archivos
  const [galleryFiles, setGalleryFiles] = useState<ArchivoAdjunto[]>([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Estados para edición de archivos
  const [editingFile, setEditingFile] = useState<ArchivoAdjunto | null>(null);
  const [newFileName, setNewFileName] = useState('');

  // Estado para el drawer de contactos
  const [contactsDrawerOpen, setContactsDrawerOpen] = useState(false);

  // Estados para promedio de cobranza editable
  const [promedioEditable, setPromedioEditable] = useState<number | null>(null);
  const [editandoPromedio, setEditandoPromedio] = useState(false);
  const [promedioLocal, setPromedioLocal] = useState<number | null>(sale.cliente?.promedioCobranza ? Number(sale.cliente.promedioCobranza) : null);

  // Función para guardar solo el cobrador
  const handleCobradorFinish = async (values: { cobradorId?: number }) => {
    try {
      setLoading(true);

      const changedFields: Partial<CobranzaData> = {};

      // Comparar cobradorId
      const currentCobradorId = values.cobradorId || undefined;
      const originalCobradorId = originalCobranzaData?.cobradorId || undefined;

      if (currentCobradorId !== originalCobradorId) {
        changedFields.cobradorId = currentCobradorId;

        await updateCobranzaFields(sale.id, changedFields);

        // Actualizar los datos originales
        setOriginalCobranzaData(prev => ({ ...prev, ...changedFields }));

        notification.success({
          message: 'Cobrador actualizado',
          description: 'El cobrador asignado se ha actualizado correctamente'
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error al guardar cobrador',
        description: 'No se pudo actualizar el cobrador asignado'
      });
      console.error('Error saving cobrador:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para asignar cobrador usando endpoint específico
  const handleAssignCobrador = async (cobradorId: number | null) => {
    try {
      setLoading(true);

      const updatedCobranza = await assignCobrador(sale.id, cobradorId);

      // Actualizar los datos originales
      setOriginalCobranzaData(prev => ({ ...prev, cobradorId: cobradorId || undefined }));

      notification.success({
        message: cobradorId ? 'Cobrador asignado' : 'Cobrador removido',
        description: cobradorId ? 'El cobrador ha sido asignado correctamente' : 'El cobrador ha sido removido correctamente'
      });
    } catch (error) {
      notification.error({
        message: 'Error al asignar cobrador',
        description: 'No se pudo asignar el cobrador seleccionado'
      });
      console.error('Error assigning cobrador:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar promedio de cobranza
  const handleSavePromedio = async () => {
    if (promedioEditable === null || !sale.cliente?.id) return;

    try {
      setLoading(true);
      await apiClient.put(`/ventas/cliente/${sale.cliente.id}/promedio-cobranza`, {
        promedioCobranza: promedioEditable
      });

      notification.success({
        message: 'Promedio actualizado',
        description: 'El promedio de cobranza se ha actualizado correctamente'
      });

      // Actualizar el promedio local para reflejar el cambio en la UI
      setPromedioLocal(promedioEditable);
      setEditandoPromedio(false);
    } catch (error) {
      notification.error({
        message: 'Error al guardar promedio',
        description: 'No se pudo actualizar el promedio de cobranza'
      });
      console.error('Error saving promedio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Estados para porcentajes editables de retención y detracción
  const [porcentajeRetencionEditable, setPorcentajeRetencionEditable] = useState<number>(
    parseFloat(sale.facturacion?.retencion?.toString() || '0')
  );
  const [porcentajeDetraccionEditable, setPorcentajeDetraccionEditable] = useState<number>(
    parseFloat(sale.facturacion?.detraccion?.toString() || '0')
  );
  const [hasFacturacionChanges, setHasFacturacionChanges] = useState(false);

  // Estados para cobradores
  const [cobradores, setCobradores] = useState<UserProps[]>([]);
  const [loadingCobradores, setLoadingCobradores] = useState(false);

  // Cálculos automáticos
  const importeTotal = parseFloat(sale.montoVenta || '0');
  const valorRetencion = (importeTotal * porcentajeRetencionEditable / 100).toFixed(2);
  const valorDetraccion = (importeTotal * porcentajeDetraccionEditable / 100).toFixed(2);

  // Calcular neto cobrado usando la penalidad actual del estado
  const netoCobrado = (importeTotal - parseFloat(valorRetencion) - parseFloat(valorDetraccion) - currentPenalidad).toFixed(2); useEffect(() => {
    loadInitialData();
  }, [sale.id]);

  // Efecto para detectar cambios en porcentajes editables
  useEffect(() => {
    const originalRetencion = parseFloat(sale.facturacion?.retencion?.toString() || '0');
    const originalDetraccion = parseFloat(sale.facturacion?.detraccion?.toString() || '0');

    const hasRetencionChanged = porcentajeRetencionEditable !== originalRetencion;
    const hasDetraccionChanged = porcentajeDetraccionEditable !== originalDetraccion;

    setHasFacturacionChanges(hasRetencionChanged || hasDetraccionChanged);
  }, [porcentajeRetencionEditable, porcentajeDetraccionEditable, sale.facturacion]);

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
        // Nuevo: estado de cobranza rol
        estadoCobranzaRol: cobranzaData.estadoCobranzaRol || 'PENDIENTE',
      });

      // Configurar formulario de cobrador
      cobradorForm.setFieldsValue({
        cobradorId: cobranzaData.cobradorId || undefined,
      });

      // Inicializar penalidad para cálculo de neto cobrado
      setCurrentPenalidad(parseFloat(cobranzaData.penalidad || '0'));

      // Cargar gestiones
      await loadGestiones();

      // Cargar archivos adjuntos
      await loadArchivosAdjuntos();

      // Cargar cobradores
      await loadCobradores();

      // Calcular promedio de cobranza del cliente
      await calcularPromedioCobranza();

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

  const loadCobradores = async () => {
    try {
      setLoadingCobradores(true);
      const allUsers = await getUsers();
      // Filtrar usuarios que tienen permiso de collections o jefe de cobranzas
      const cobradoresFiltrados = allUsers.filter(user =>
        (user.permisos?.includes(PermissionsEnum.COLLECTIONS) || user.permisos?.includes(PermissionsEnum.JEFECOBRANZAS)) && user.estado
      );
      setCobradores(cobradoresFiltrados);
    } catch (error) {
      console.error('Error loading cobradores:', error);
      notification.error({
        message: 'Error al cargar cobradores',
        description: 'No se pudieron cargar los usuarios con permiso de cobranzas'
      });
    } finally {
      setLoadingCobradores(false);
    }
  };

  const calcularPromedioCobranza = async () => {
    if (!sale.cliente?.id) return;

    try {
      // Llamar al endpoint para calcular el promedio
      await apiClient.get(`/ventas/cliente/${sale.cliente.id}/promedio-cobranza`);
      // No necesitamos hacer nada con la respuesta, ya que se actualiza en la BD
    } catch (error) {
      console.error('Error calculando promedio de cobranza:', error);
      // No mostrar notificación de error ya que es un cálculo en background
    }
  };

  const loadArchivosAdjuntos = async () => {
    try {
      setLoadingFiles(true);
      const archivos = await getArchivosAdjuntosByOrdenCompra(sale.id);
      setGalleryFiles(archivos);
    } catch (error) {
      console.error('Error loading archivos adjuntos:', error);
      notification.error({
        message: 'Error al cargar archivos',
        description: 'No se pudieron cargar los archivos adjuntos'
      });
    } finally {
      setLoadingFiles(false);
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
    setContactsDrawerOpen(true);
  };

  const handleCancel = () => {
    // Resetear formulario a valores originales
    if (originalCobranzaData) {
      form.setFieldsValue({
        etapaSiaf: originalCobranzaData.etapaSiaf || '',
        fechaSiaf: originalCobranzaData.fechaSiaf ? dayjs(originalCobranzaData.fechaSiaf) : null,
        penalidad: originalCobranzaData.penalidad || '',
        estadoCobranza: originalCobranzaData.estadoCobranza || '',
        fechaEstadoCobranza: originalCobranzaData.fechaEstadoCobranza ? dayjs(originalCobranzaData.fechaEstadoCobranza) : null,
        // Nuevo: estado de cobranza rol
        estadoCobranzaRol: originalCobranzaData.estadoCobranzaRol || 'PENDIENTE',
      });
    }

    // Resetear porcentajes editables a valores originales
    setPorcentajeRetencionEditable(parseFloat(sale.facturacion?.retencion?.toString() || '0'));
    setPorcentajeDetraccionEditable(parseFloat(sale.facturacion?.detraccion?.toString() || '0'));

    // Resetear estado de cambios
    setHasChanges(false);
    setHasFacturacionChanges(false);

    notification.info({
      message: 'Cambios cancelados',
      description: 'Los cambios han sido revertidos'
    });
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

    // Comparar estadoCobranzaRol
    const currentEstadoCobranzaRol = currentValues.estadoCobranzaRol || '';
    const originalEstadoCobranzaRol = originalCobranzaData.estadoCobranzaRol || '';
    if (currentEstadoCobranzaRol !== originalEstadoCobranzaRol) {
      changedFields.estadoCobranzaRol = currentEstadoCobranzaRol;
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
    // Nuevo: estado de cobranza rol
    estadoCobranzaRol?: string;
  }

  const handleFinish = async (values: CollectionFormValues) => {
    try {
      setLoading(true);

      // Verificar si hay cambios de facturación
      if (hasFacturacionChanges) {
        notification.warning({
          message: 'Cambios de Facturación Detectados',
          description: 'Los porcentajes de retención y detracción modificados requieren actualización manual en el sistema de facturación. Los cambios de cobranza se guardarán normalmente.',
          duration: 8
        });
      }

      // Obtener solo los campos que cambiaron
      const changedFields = getChangedFields(values);

      // Si no hay cambios en cobranza, mostrar mensaje apropiado
      if (Object.keys(changedFields).length === 0) {
        if (hasFacturacionChanges) {
          notification.info({
            message: 'Solo cambios de facturación',
            description: 'Los cambios de retención y detracción requieren actualización manual en el sistema de facturación'
          });
        } else {
          notification.info({
            message: 'Sin cambios',
            description: 'No se detectaron cambios en los datos de cobranza'
          });
        }
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

    // Convertir arrays a strings para el formulario
    const archivosAdjuntosStr = Array.isArray(gestion.archivosAdjuntosNotasGestion)
      ? gestion.archivosAdjuntosNotasGestion.join(', ')
      : gestion.archivosAdjuntosNotasGestion || '';

    const documentosRegStr = Array.isArray(gestion.documentosRegistrados)
      ? gestion.documentosRegistrados.join(', ')
      : gestion.documentosRegistrados || '';

    gestionForm.setFieldsValue({
      ...gestion,
      fechaGestion: gestion.fechaGestion ? dayjs(gestion.fechaGestion) : undefined,
      archivosAdjuntosNotasGestion: archivosAdjuntosStr,
      documentosRegistrados: documentosRegStr
    });
    setModalVisible(true);
  };

  interface GestionFormValues {
    fechaGestion?: Dayjs | null;
    notaGestion?: string;
    capturaEnvioDocumentoUrl?: string;
  }

  const handleSaveGestion = async (values: GestionFormValues) => {
    try {
      const gestionData: Partial<GestionCobranza> = {
        ordenCompraId: sale.id,
        fechaGestion: values.fechaGestion ? values.fechaGestion.format('YYYY-MM-DD') : '',
        notaGestion: values.notaGestion || '',
        capturaEnvioDocumentoUrl: values.capturaEnvioDocumentoUrl || '',
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

  // Funciones para la galería de archivos
  const handleOpenGallery = () => {
    setGalleryModalOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryModalOpen(false);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    try {
      const uploadedFiles: ArchivoAdjunto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileUrl = await uploadFile(file);

        // Crear registro en la base de datos
        const archivoAdjunto = await createArchivoAdjunto({
          ordenCompraId: sale.id,
          nombre: file.name,
          url: fileUrl,
          tipo: file.type,
          tamano: file.size
        });

        uploadedFiles.push(archivoAdjunto);
      }

      setGalleryFiles(prev => [...prev, ...uploadedFiles]);
      notification.success({
        message: 'Archivos subidos',
        description: `${uploadedFiles.length} archivo(s) subido(s) correctamente`
      });
    } catch (error) {
      notification.error({
        message: 'Error al subir archivos',
        description: 'No se pudieron subir algunos archivos'
      });
      console.error('Error uploading files:', error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    Modal.confirm({
      title: '¿Eliminar archivo?',
      content: '¿Está seguro de que desea eliminar este archivo?',
      okText: 'Eliminar',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteArchivoAdjunto(fileId);
          setGalleryFiles(prev => prev.filter(file => file.id !== fileId));
          notification.success({
            message: 'Archivo eliminado',
            description: 'El archivo se ha eliminado correctamente'
          });
        } catch (error) {
          notification.error({
            message: 'Error al eliminar archivo',
            description: 'No se pudo eliminar el archivo'
          });
          console.error('Error deleting file:', error);
        }
      }
    });
  };

  // Funciones para edición de archivos
  const handleOpenEditModal = (file: ArchivoAdjunto) => {
    setEditingFile(file);
    setNewFileName(file.nombre);
  };

  const handleSaveFileName = async () => {
    if (!editingFile || !newFileName.trim()) return;

    try {
      await updateArchivoAdjunto(editingFile.id, { nombre: newFileName.trim() });
      notification.success({
        message: 'Nombre actualizado',
        description: 'El nombre del archivo se ha actualizado correctamente'
      });
      setEditingFile(null);
      setNewFileName('');
      // Refrescar la lista de archivos
      await loadArchivosAdjuntos();
    } catch (error) {
      notification.error({
        message: 'Error al actualizar nombre',
        description: 'No se pudo actualizar el nombre del archivo'
      });
      console.error('Error updating file name:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setNewFileName('');
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <PdfIcon />;
    return <DocumentIcon />;
  };

  const getEstadoLabel = (estado: string) => {
    const option = estadosCobranzaOptions.find(opt => opt.value === estado);
    return option ? option.label : estado;
  };

  const getTipoLabel = (tipo: string) => {
    const option = tipoCobranzaOptions.find(opt => opt.value === tipo);
    return option ? option.label : tipo;
  };

  const getTipoGestionLabel = (tipo: string) => {
    const option = tipoGestionOptions.find(opt => opt.value === tipo);
    return option ? option.label : tipo;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Asignación de Cobrador - Solo visible para usuarios con permiso de jefe de cobranzas */}
      {user.permisos?.includes(PermissionsEnum.JEFECOBRANZAS) && (
        <Card sx={{ mb: 3, width: '100%' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Business color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Asignación de Cobrador
                </Typography>
              </Stack>
            </Stack>

            <Form
              form={cobradorForm}
              layout="vertical"
              onFinish={handleCobradorFinish}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Cobrador Asignado" name="cobradorId">
                    <SelectGeneric
                      placeholder="Seleccionar cobrador"
                      options={getCobradorOptions(cobradores)}
                      loading={loadingCobradores}
                      allowClear
                      onChange={(value) => handleAssignCobrador(value || null)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </CardContent>
        </Card>
      )}

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
          resumeButtons={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={handleBack}
              >
                Ver Contactos
              </Button>
            </Stack>
          }
          resumeContent={
            <Stack direction="column" alignItems="left">
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'gray' }}>
                Gestión de Cobranza
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
                  {sale.codigoVenta}
                </Typography>
                <Chip
                  label={sale.multipleFuentesFinanciamiento ? 'MÚLTIPLES FUENTES DE FINANCIAMIENTO' : 'FUENTE ÚNICA DE FINANCIAMIENTO'}
                  size="small"
                  sx={{
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: '20px',
                    '& .MuiChip-label': {
                      padding: '0 8px'
                    }
                  }}
                />
              </Stack>
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
        {sale.productos && sale.productos.length > 0 && (
          <Card sx={{ my: 3, width: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <ReceiptIcon color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    OP PERÚ COMPRAS
                  </Typography>
                </Stack>
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
        <Card sx={{ my: 3, width: '100%' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <MoneyIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Gestiones de Cobranza
                </Typography>
              </Stack>
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
                    label={`Retención ${porcentajeRetencionEditable}%`}
                  >
                    <Stack direction="row" spacing={1}>
                      <SelectGeneric
                        placeholder="Seleccionar %"
                        options={porcentajeRetencionOptions}
                        value={porcentajeRetencionEditable}
                        onChange={(value) => setPorcentajeRetencionEditable(value || 0)}
                        style={{ width: '120px' }}
                      />
                      <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600, color: 'primary.main' }}>
                        = {formatCurrency(parseFloat(valorRetencion))}
                      </Typography>
                    </Stack>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label={`Detracción ${porcentajeDetraccionEditable}%`}
                  >
                    <Stack direction="row" spacing={1}>
                      <SelectGeneric
                        placeholder="Seleccionar %"
                        options={porcentajeDetraccionOptions}
                        value={porcentajeDetraccionEditable}
                        onChange={(value) => setPorcentajeDetraccionEditable(value || 0)}
                        style={{ width: '120px' }}
                      />
                      <Typography variant="body2" sx={{ alignSelf: 'center', fontWeight: 600, color: 'primary.main' }}>
                        = {formatCurrency(parseFloat(valorDetraccion))}
                      </Typography>
                    </Stack>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Penalidad (S/)" name="penalidad">
                    <InputAntd placeholder="0.00" />
                  </Form.Item>
                </Col>

                {/* Fila 3 */}
                <Col span={8}>
                  <Form.Item label="Neto a Cobrar">
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
                  <Form.Item label="Fecha de Cobranza" name="fechaEstadoCobranza">
                    <DatePickerAntd placeholder="Seleccionar fecha" />
                  </Form.Item>
                </Col>
                {/* Nueva fila: Estado de Cobranza (Rol) */}
                <Col span={8}>
                  <Form.Item label="Estado de Cobranza (Rol)" name="estadoCobranzaRol">
                    <SelectGeneric placeholder="Seleccionar estado" options={estadosCobranzaRolOptions} />
                  </Form.Item>
                </Col>
              </Row>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {(hasChanges || hasFacturacionChanges) && (
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => form.submit()}
                    startIcon={<Save />}
                    disabled={loading || (!hasChanges && !hasFacturacionChanges)}
                    color={(hasChanges || hasFacturacionChanges) ? "primary" : "inherit"}
                  >
                    {(hasChanges || hasFacturacionChanges) ? 'Guardar Cambios' : 'Sin Cambios'}
                  </Button>
                </Box>
              </Box>
            </Form>
          </CardContent>
        </Card>

        {/* Historial de Gestiones */}
        <Card sx={{ my: 3, width: '100%' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ReceiptIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Historial de Gestiones
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOpenGallery}
                  size="small"
                  color="secondary"
                >
                  Galería ({galleryFiles.length})
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddGestion}
                  size="small"
                >
                  Nueva Gestión
                </Button>
              </Stack>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Documentos</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%' }}>Nota</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '25%', textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gestionesLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Spin />
                      </TableCell>
                    </TableRow>
                  ) : gestiones.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary">
                          No hay gestiones registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    gestiones.map((gestion) => (
                      <TableRow key={gestion.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {gestion.fechaGestion ? formattedDate(gestion.fechaGestion) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="column" spacing={0.5}>
                            {gestion.voucherPagoUrl && (
                              <Chip
                                label="Voucher"
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => window.open(gestion.voucherPagoUrl, '_blank')}
                                style={{ cursor: 'pointer' }}
                              />
                            )}
                            {gestion.cartaAmpliacionUrl && (
                              <Chip
                                label="Carta Amp."
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={() => window.open(gestion.cartaAmpliacionUrl, '_blank')}
                                style={{ cursor: 'pointer' }}
                              />
                            )}
                            {gestion.capturaEnvioDocumentoUrl && (
                              <Chip
                                label="Captura Envío"
                                size="small"
                                variant="outlined"
                                color="info"
                                onClick={() => window.open(gestion.capturaEnvioDocumentoUrl, '_blank')}
                                style={{ cursor: 'pointer' }}
                              />
                            )}
                            {(!gestion.voucherPagoUrl && !gestion.cartaAmpliacionUrl && !gestion.capturaEnvioDocumentoUrl) && (
                              <Typography variant="caption" color="text.secondary">
                                Sin documentos
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 150 }}>
                            {gestion.notaGestion || '-'}
                          </Typography>
                          {gestion.notaEspecialEntrega && (
                            <Typography variant="caption" color="primary" sx={{ display: 'block', fontStyle: 'italic' }}>
                              Especial: {gestion.notaEspecialEntrega.substring(0, 30)}...
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditGestion(gestion)}
                              title="Editar gestión"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteGestion(gestion.id!)}
                              title="Eliminar gestión"
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
        width={800}
      >
        <Form
          form={gestionForm}
          layout="vertical"
          onFinish={handleSaveGestion}
        >
          {/* Fecha de Gestión */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Fecha de Gestión"
                name="fechaGestion"
                rules={[{ required: true, message: 'Seleccione una fecha' }]}
              >
                <DatePickerAntd size="small" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Nota de gestión */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Nota de Gestión"
                name="notaGestion"
                rules={[{ required: true, message: 'Ingrese una nota' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Detalle de la gestión realizada..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Captura de envío de documento */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Captura Envío Documento"
                name="capturaEnvioDocumentoUrl"
                tooltip="Captura de envío de documento + PDF según requerimientos"
              >
                <SimpleFileUpload />
              </Form.Item>
            </Col>
          </Row>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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

      {/* Modal de Galería de Archivos */}
      <Modal
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUploadIcon />
            <Typography variant="h6">Galería de Archivos</Typography>
          </Box>
        }
        open={galleryModalOpen}
        onCancel={handleCloseGallery}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <Box sx={{ p: 2 }}>
          {/* Upload Area */}
          <Box
            sx={{
              border: '2px dashed #d0d0d0',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 3,
              backgroundColor: uploadingFiles ? '#f5f5f5' : '#fafafa',
              transition: 'all 0.3s ease'
            }}
          >
            <input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
              id="file-upload"
              disabled={uploadingFiles}
            />
            <label htmlFor="file-upload" style={{ cursor: uploadingFiles ? 'not-allowed' : 'pointer' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: uploadingFiles ? '#ccc' : '#1976d2' }} />
                <Typography variant="h6" color={uploadingFiles ? 'text.secondary' : 'primary'}>
                  {uploadingFiles ? 'Subiendo archivos...' : 'Haz clic para seleccionar archivos'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Puedes seleccionar múltiples archivos a la vez
                </Typography>
              </Box>
            </label>
          </Box>

          {/* Files Display */}
          {galleryFiles.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Archivos Adjuntos ({galleryFiles.length})
                </Typography>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(event, newView) => {
                    if (newView !== null) {
                      setViewMode(newView);
                    }
                  }}
                  size="small"
                >
                  <ToggleButton value="grid" aria-label="vista cuadrícula">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="table" aria-label="vista tabla">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {viewMode === 'grid' ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: 2,
                    maxHeight: 400,
                    overflowY: 'auto'
                  }}
                >
                  {galleryFiles.map((file, index) => (
                    <Card key={file.id || `file-grid-${index}`} sx={{ position: 'relative' }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Box sx={{ mb: 1 }}>
                          {getFileIcon(file.tipo)}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }} noWrap title={file.nombre}>
                          {file.nombre}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => window.open(file.url, '_blank')}
                            title="Ver archivo"
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleOpenEditModal(file)}
                            title="Editar nombre"
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteFile(file.id)}
                            title="Eliminar archivo"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Subida</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: 150 }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {galleryFiles.map((file, index) => (
                        <TableRow key={file.id || `file-table-${index}`} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getFileIcon(file.tipo)}
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {file.nombre}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={file.tipo.split('/')[1]?.toUpperCase() || file.tipo}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {file.createdAt ? formattedDate(file.createdAt) : 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => window.open(file.url, '_blank')}
                              title="Ver archivo"
                            >
                              <VisibilityOutlined fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleOpenEditModal(file)}
                              title="Editar nombre"
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteFile(file.id)}
                              title="Eliminar archivo"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {galleryFiles.length === 0 && !uploadingFiles && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ImageIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No hay archivos adjuntos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sube tus primeros archivos usando el área de arriba
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Modal de edición de nombre de archivo */}
      <Modal
        title="Editar nombre del archivo"
        open={!!editingFile}
        onOk={handleSaveFileName}
        onCancel={handleCancelEdit}
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Box sx={{ p: 2 }}>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Nuevo nombre del archivo"
            maxLength={255}
            style={{ width: '100%' }}
          />
        </Box>
      </Modal>

      {/* Drawer de Contactos */}
      {contactsDrawerOpen && sale.cliente?.id && (
        <ContactsDrawer
          handleClose={() => setContactsDrawerOpen(false)}
          tipo={ContactTypeEnum.CLIENTE}
          referenceId={sale.cliente.id}
          title={`${sale.cliente.razonSocial} - ${sale.cliente.ruc}`}
          readOnly={true}
        />
      )}

      {/* Promedio de Cobranza del Cliente */}
      <Card sx={{ my: 3, width: '100%' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Business color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Promedio de Cobranza
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2
          }}>
            {/* Promedio en días */}
            <Card sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 }, width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    Promedio de Cobranza
                  </Typography>
                  {!editandoPromedio && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        setPromedioEditable(promedioLocal || 0);
                        setEditandoPromedio(true);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                {editandoPromedio ? (
                  <Box sx={{ mt: 1 }}>
                    <Input
                      type="number"
                      value={promedioEditable || 0}
                      onChange={(e) => setPromedioEditable(Number(e.target.value) || 0)}
                      placeholder="Días"
                      min={0}
                      style={{ width: '100%', marginBottom: 8 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSavePromedio}
                        disabled={loading}
                      >
                        Guardar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setEditandoPromedio(false)}
                      >
                        Cancelar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', mt: 0.5 }}>
                      {promedioLocal !== null
                        ? `${Math.round(promedioLocal)} días`
                        : '0'
                      }
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Tiempo promedio de cobro
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Estado del promedio */}
            <Card sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e0e0e0',
              minHeight: '80px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'none'
            }}>
              <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  Clasificación
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mt: 0.5,
                    color: promedioLocal !== null
                      ? promedioLocal <= 30
                        ? '#4caf50' // Verde para buen promedio
                        : promedioLocal <= 60
                          ? '#ff9800' // Naranja para promedio regular
                          : '#f44336' // Rojo para mal promedio
                      : '#757575'
                  }}
                >
                  {promedioLocal !== null
                    ? promedioLocal <= 30
                      ? 'Excelente'
                      : promedioLocal <= 60
                        ? 'Regular'
                        : 'Requiere Atención'
                    : 'Sin datos'
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  Basado en histórico de pagos
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CollectionFormContent;
