import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
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
  Tabs,
  Tab,
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
  GetApp as DownloadIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { notification, Form, Input, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid';
import { SaleProps } from '@/services/sales/sales';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import heroUIColors, { alpha } from '@/styles/theme/heroui-colors';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import DatePickerAntd from '@/components/DatePickerAnt';
import { getOrderProvider, patchOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { createTransporteAsignado, updateTransporteAsignado } from '@/services/transporteAsignado/transporteAsignado.requests';
import { updateOrdenCompra, getOrdenCompraByTrackingId } from '@/services/trackings/trackings.request';
import { printOrdenProveedor } from '@/services/print/print.requests';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputAntd from '@/components/InputAntd';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';
import { getTransports } from '@/services/transports/transports.request';
import { getContactsByEntityType } from '@/services/contacts/contacts.requests';
import { getAlmacenes } from '@/services/almacen/almacen.requests';
import InputNumberAntd from '@/components/InputNumberAntd';
import PaymentsList from '@/components/PaymentsList';
import { updatePayments } from '@/services/payments/payments.service';
import { ESTADOS_SEGUIMIENTO, estadoSeguimientoBgMap } from '@/utils/constants';
import { TransportProps } from '@/services/transports/transports';
import { ContactProps } from '@/services/contacts/contacts';
import { TransporteAsignadoProps } from '@/services/transporteAsignado/transporteAsignado';
import { PaymentData } from '@/services/payments/payments.service';
import { Almacen } from '@/types/almacen.types';
import { RegionProps, ProvinceProps, DistrictProps } from '@/services/ubigeo/ubigeo';
import { useAppContext } from '@/context';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import { RolesEnum } from '@/services/users/user.enum';
import BillingHistory from '@/components/BillingHistory';
import { BillingProps } from '@/services/billings/billings';
import { getBillingHistoryByOrdenCompraId } from '@/services/billings/billings.request';

interface TrackingFormContentProps {
  sale: SaleProps;
}

type TransportePaymentItem = {
  date: Dayjs | null;
  bank: string;
  description: string;
  file: string | null;
  amount: string;
  status: boolean;
};

interface TransportePaymentsState {
  tipoPago: string;
  notaPago: string;
  payments: TransportePaymentItem[];
}

type TransporteFormData = {
  montoFletePagado: number;
  numeroFactura: string;
  archivoFactura: string | null;
  guiaRemision: string | null;
  guiaTransporte: string | null;
  grt: string;
};

const createDefaultPaymentsState = (): TransportePaymentsState => ({
  tipoPago: 'PENDIENTE',
  notaPago: '',
  payments: []
});

type PagoTransporte = {
  fechaPago?: string | Date | null;
  bancoPago?: string | null;
  descripcionPago?: string | null;
  archivoPago?: string | File | null;
  montoPago?: number | null;
  estadoPago?: boolean;
};

const mapPagosToPaymentItems = (pagos: (PagoTransporte | PaymentData)[]): TransportePaymentItem[] => {
  if (!Array.isArray(pagos)) {
    return [];
  }

  return pagos.map((pago) => ({
    date: pago?.fechaPago ? dayjs(pago.fechaPago) : null,
    bank: pago?.bancoPago || '',
    description: pago?.descripcionPago || '',
    file: typeof pago?.archivoPago === 'string' ? pago.archivoPago : null,
    amount: pago?.montoPago != null ? String(pago.montoPago) : '',
    status: Boolean(pago?.estadoPago)
  }));
};

const clonePaymentsState = (state: TransportePaymentsState): TransportePaymentsState => ({
  tipoPago: state.tipoPago,
  notaPago: state.notaPago,
  payments: state.payments.map(payment => ({
    ...payment,
    date: payment.date ? payment.date.clone() : null
  }))
});

const mapPaymentItemsToPayload = (payments: TransportePaymentItem[]): PaymentData[] => payments.map(payment => ({
  fechaPago: payment.date ? payment.date.toDate() : null,
  bancoPago: payment.bank,
  descripcionPago: payment.description,
  archivoPago: payment.file,
  montoPago: payment.amount ? Number(payment.amount) : 0,
  estadoPago: payment.status
}));

interface TransporteAsignadoUI extends TransporteAsignadoProps {
  montoFletePagado?: number;
  numeroFactura?: string;
  archivoFactura?: string | null;
  guiaRemision?: string | null;
  guiaTransporte?: string | null;
  archivoCotizacion?: string | null;
}

const scheduleFields = ['fechaRecepcion', 'fechaProgramada', 'fechaDespacho'] as const;

const getUbigeoName = (val: RegionProps | ProvinceProps | DistrictProps | string | undefined) => {
  if (!val) return undefined;
  return typeof val === 'string' ? val : val.name;
};

const TrackingFormContent = ({ sale }: TrackingFormContentProps) => {
  const [billingHistory, setBillingHistory] = useState<BillingProps[]>([]);

  useEffect(() => {
    let mounted = true;
    const loadHistory = async () => {
      try {
        const history = await getBillingHistoryByOrdenCompraId(sale.id);
        if (mounted) setBillingHistory(history || []);
      } catch (e) {
        console.error('Error al cargar historial de facturación:', e);
        if (mounted) setBillingHistory([]);
      }
    };
    if (sale?.id) loadHistory();
    return () => { mounted = false; };
  }, [sale?.id]);
  const { user } = useAppContext();
  const canEditSchedule = user?.role === RolesEnum.ADMIN || (user?.permisos || []).includes(PermissionsEnum.TRACKING);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ordenesProveedor, setOrdenesProveedor] = useState<ProviderOrderProps[]>([]);
  const [expandedContent, setExpandedContent] = useState<{ [key: string]: boolean }>({});
  const [originalValues, setOriginalValues] = useState<{ [key: string]: Record<string, unknown> }>({});
  const [changedFields, setChangedFields] = useState<{ [key: string]: Set<string> }>({});
  const [savingOP, setSavingOP] = useState<string | null>(null);
  const [savingCronograma, setSavingCronograma] = useState<string | null>(null);
  const [originalOCValues, setOriginalOCValues] = useState<Record<string, unknown>>({});
  const [changedOCFields, setChangedOCFields] = useState<Set<string>>(new Set());
  const [savingOC, setSavingOC] = useState(false);
  const [customRetornoValues, setCustomRetornoValues] = useState<{ [key: string]: string }>({});
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({});
  const [transporteModal, setTransporteModal] = useState<{
    open: boolean;
    mode: 'create' | 'view';
    opId: number | null;
    transporteData: TransporteAsignadoUI | null;
  }>({
    open: false,
    mode: 'create',
    opId: null,
    transporteData: null
  });
  const [transportCompanies, setTransportCompanies] = useState<TransportProps[]>([]);
  const [transportContacts, setTransportContacts] = useState<ContactProps[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [pagosModalData, setPagosModalData] = useState<{ open: boolean; entidad: TransporteAsignadoUI | null }>({
    open: false,
    entidad: null
  });
  const [transporteFormData, setTransporteFormData] = useState<TransporteFormData>({
    montoFletePagado: 0,
    numeroFactura: '',
    archivoFactura: null,
    guiaRemision: null,
    guiaTransporte: null,
    grt: '',
  });
  const [originalTransporteValues, setOriginalTransporteValues] = useState<{
    montoFletePagado: number;
    numeroFactura: string;
    archivoFactura: string | null;
    guiaRemision: string | null;
    guiaTransporte: string | null;
    grt: string;
  } | null>(null);
  const [changedTransporteFields, setChangedTransporteFields] = useState<Set<string>>(new Set());
  const [savingTransporte, setSavingTransporte] = useState(false);
  const [updatingCompletionOp, setUpdatingCompletionOp] = useState<number | null>(null);
  const [transportePaymentsState, setTransportePaymentsState] = useState<TransportePaymentsState>(createDefaultPaymentsState);
  const [originalTransportePaymentsState, setOriginalTransportePaymentsState] = useState<TransportePaymentsState | null>(null);
  const [transportePaymentsChanged, setTransportePaymentsChanged] = useState(false);
  const [savingTransportePayments, setSavingTransportePayments] = useState(false);

  useEffect(() => {
    loadProviderOrders();
    initializeOCValues();
    loadTransportCompanies();
  }, [sale.id]);

  useEffect(() => {
    if (transporteModal.transporteData) {
      const initialValues = {
        montoFletePagado: transporteModal.transporteData.montoFletePagado || 0,
        numeroFactura: transporteModal.transporteData.numeroFactura || '',
        archivoFactura: transporteModal.transporteData.archivoFactura || null,
        guiaRemision: transporteModal.transporteData.guiaRemision || null,
        guiaTransporte: transporteModal.transporteData.guiaTransporte || null,
        grt: transporteModal.transporteData.grt || '',
      };
      setTransporteFormData(initialValues);
      setOriginalTransporteValues(initialValues);
      setChangedTransporteFields(new Set());

      const basePaymentsState: TransportePaymentsState = {
        tipoPago: transporteModal.transporteData.estadoPago || 'PENDIENTE',
        notaPago: transporteModal.transporteData.notaPago || '',
        payments: mapPagosToPaymentItems(transporteModal.transporteData.pagos || [])
      };

      setTransportePaymentsState(clonePaymentsState(basePaymentsState));
      setOriginalTransportePaymentsState(clonePaymentsState(basePaymentsState));
      setTransportePaymentsChanged(false);
    } else {
      setTransportePaymentsState(createDefaultPaymentsState());
      setOriginalTransportePaymentsState(null);
      setTransportePaymentsChanged(false);
    }
  }, [transporteModal.transporteData]);

  const loadTransportCompanies = async () => {
    try {
      const [companies, almacenesData] = await Promise.all([
        getTransports(),
        getAlmacenes()
      ]);
      setTransportCompanies(companies);
      setAlmacenes(almacenesData);
    } catch (error) {
      console.error('Error loading transport data:', error);
    }
  };

  const updateTransporteField = (
    field: keyof TransporteFormData,
    value: TransporteFormData[typeof field]
  ) => {
    setTransporteFormData(prev => ({ ...prev, [field]: value }));

    // Detectar cambios
    if (originalTransporteValues) {
      const originalValue = originalTransporteValues[field as keyof typeof originalTransporteValues];
      const hasChanged = value !== originalValue;

      setChangedTransporteFields(prev => {
        const newSet = new Set(prev);
        if (hasChanged) {
          newSet.add(field as string);
        } else {
          newSet.delete(field as string);
        }
        return newSet;
      });
    }
  };

  const cancelTransporteChanges = () => {
    if (originalTransporteValues) {
      setTransporteFormData(originalTransporteValues);
      setChangedTransporteFields(new Set());
    }
  };

  const updateTransportePayments = (updater: (prev: TransportePaymentsState) => TransportePaymentsState) => {
    setTransportePaymentsState(prev => {
      const next = updater(prev);
      if (originalTransportePaymentsState) {
        const isChanged =
          next.tipoPago !== originalTransportePaymentsState.tipoPago ||
          next.notaPago !== originalTransportePaymentsState.notaPago;
        setTransportePaymentsChanged(isChanged);
      } else {
        setTransportePaymentsChanged(Boolean(next.tipoPago) || Boolean(next.notaPago));
      }
      return next;
    });
  };

  const handleTransporteTipoPagoChange = (value: string) => {
    updateTransportePayments(prev => ({
      ...prev,
      tipoPago: value
    }));
  };

  const handleTransporteNotaPagoChange = (value: string) => {
    updateTransportePayments(prev => ({
      ...prev,
      notaPago: value
    }));
  };

  const cancelTransportePaymentsChanges = () => {
    if (!originalTransportePaymentsState) {
      return;
    }
    setTransportePaymentsState(clonePaymentsState(originalTransportePaymentsState));
    setTransportePaymentsChanged(false);
  };

  const handleSaveTransportePayments = async () => {
    const transporteId = transporteModal.transporteData?.id;
    const currentOpId = transporteModal.opId;

    if (!transporteId || !transportePaymentsChanged) {
      return;
    }

    setSavingTransportePayments(true);
    try {
      const sanitizedNotaPago = transportePaymentsState.notaPago?.trim() || '';
      const payloadPayments = mapPaymentItemsToPayload(transportePaymentsState.payments);

      const response = await updatePayments({
        entityType: 'transporteAsignado',
        entityId: transporteId,
        payments: payloadPayments,
        tipoPago: transportePaymentsState.tipoPago,
        notaPago: sanitizedNotaPago
      });

      notification.success({
        message: 'Pagos actualizados',
        description: 'Se actualizaron los datos de tesorería del transporte'
      });

      const updatedPaymentsItems = mapPagosToPaymentItems(response?.payments || transporteModal.transporteData?.pagos || []);
      const nextPaymentsState: TransportePaymentsState = {
        tipoPago: response?.tipoPago ?? transportePaymentsState.tipoPago,
        notaPago: response?.notaPago ?? sanitizedNotaPago,
        payments: updatedPaymentsItems
      };

      setTransportePaymentsState(clonePaymentsState(nextPaymentsState));
      setOriginalTransportePaymentsState(clonePaymentsState(nextPaymentsState));
      setTransportePaymentsChanged(false);

      setTransporteModal(prev => {
        if (!prev.open || !prev.transporteData) {
          return prev;
        }

        const nextTransporteData = {
          ...prev.transporteData,
          estadoPago: nextPaymentsState.tipoPago,
          notaPago: nextPaymentsState.notaPago,
          pagos: response?.payments ?? prev.transporteData.pagos
        };

        return {
          ...prev,
          transporteData: nextTransporteData
        };
      });

      setOrdenesProveedor(prev => prev.map(op => {
        if (!currentOpId || op.id !== currentOpId) {
          return op;
        }

        return {
          ...op,
          transportesAsignados: op.transportesAsignados.map(transporte => {
            if (transporte.id !== transporteId) {
              return transporte;
            }

            return {
              ...transporte,
              estadoPago: nextPaymentsState.tipoPago,
              notaPago: nextPaymentsState.notaPago,
              pagos: response?.payments ?? transporte.pagos
            };
          })
        };
      }));
    } catch (error) {
      console.error('Error saving transporte payments:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron actualizar los pagos del transporte'
      });
    } finally {
      setSavingTransportePayments(false);
    }
  };

  const handleSaveTransporte = async () => {
    const currentTransporte = transporteModal.transporteData;
    const currentOpId = transporteModal.opId;
    if (!currentTransporte?.id || changedTransporteFields.size === 0) return;

    setSavingTransporte(true);
    try {
      const data: Record<string, unknown> = {};
      changedTransporteFields.forEach(fieldStr => {
        const field = fieldStr as keyof TransporteFormData;
        data[field] = transporteFormData[field];
      });

      const updatedTransporte = await updateTransporteAsignado(currentTransporte.id, data);
      const mergedTransporte = {
        ...currentTransporte,
        ...updatedTransporte,
      };
      const montoFletePagadoValue = mergedTransporte.montoFletePagado != null ? Number(mergedTransporte.montoFletePagado) : 0;
      const normalizedValues = {
        montoFletePagado: Number.isNaN(montoFletePagadoValue) ? 0 : montoFletePagadoValue,
        numeroFactura: mergedTransporte.numeroFactura || '',
        archivoFactura: mergedTransporte.archivoFactura ?? null,
        guiaRemision: mergedTransporte.guiaRemision ?? null,
        guiaTransporte: mergedTransporte.guiaTransporte ?? null,
        grt: mergedTransporte.grt || '',
      };

      notification.success({
        message: 'Éxito',
        description: 'Datos de transporte guardados correctamente',
      });

      setTransporteFormData(normalizedValues);
      setOriginalTransporteValues(normalizedValues);
      setChangedTransporteFields(new Set());

      setTransporteModal(prev => {
        if (!prev.open) return prev;
        return {
          ...prev,
          transporteData: mergedTransporte,
        };
      });

      const transporteId = mergedTransporte.id ?? currentTransporte.id;
      setOrdenesProveedor(prev => prev.map(op => {
        if (!currentOpId || op.id !== currentOpId) {
          return op;
        }
        return {
          ...op,
          transportesAsignados: op.transportesAsignados.map(transporte =>
            transporte.id === transporteId ? { ...transporte, ...mergedTransporte } : transporte
          )
        };
      }));
    } catch (error) {
      console.error('Error saving transporte:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron guardar los datos de transporte',
      });
    } finally {
      setSavingTransporte(false);
    }
  };

  const initializeOCValues = () => {
    const ocValues = {
      fechaMaxForm: sale.fechaMaxForm ? dayjs(sale.fechaMaxForm) : null,
      fechaEntregaOC: sale.fechaEntregaOc ? dayjs(sale.fechaEntregaOc) : null,
      documentoPeruCompras: sale.documentoPeruCompras || null,
      fechaPeruCompras: sale.fechaPeruCompras ? dayjs(sale.fechaPeruCompras) : null,
      cartaAmpliacion: sale.cartaAmpliacion || null,
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
      const newCustomRetornoValues: { [key: string]: string } = {};

      ops.forEach(op => {
        const opKey = `op_${op.id}`;
        let retornoValue: string | null = op.retornoMercaderia;

        // Si el valor comienza con "OTROS:", extraer el texto personalizado
        const retornoMercaderiaValue = op.retornoMercaderia;
        if (retornoMercaderiaValue != null) {
          const strValue = String(retornoMercaderiaValue);
          if (strValue.startsWith('OTROS: ')) {
            retornoValue = 'OTROS';
            newCustomRetornoValues[op.id.toString()] = strValue.replace('OTROS: ', '');
          }
        }

        initialValues[opKey] = {
          tipoEntrega: op.tipoEntrega,
          estadoOp: op.estadoOp,
          fechaEntrega: op.fechaEntrega ? dayjs(op.fechaEntrega) : null,
          fechaRecepcion: op.fechaRecepcion ? dayjs(op.fechaRecepcion) : null,
          fechaProgramada: op.fechaProgramada ? dayjs(op.fechaProgramada) : null,
          fechaDespacho: op.fechaDespacho ? dayjs(op.fechaDespacho) : null,
          cargoOea: op.cargoOea,
          retornoMercaderia: retornoValue,
          observaciones: op.observaciones,
          notaCobranzas: op.notaCobranzas
        };
      });

      setCustomRetornoValues(newCustomRetornoValues);
      setOriginalValues(initialValues);
      form.setFieldsValue(initialValues);
      setChangedFields({});
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

  const handleToggleOpCompleted = async (opId: number, value: boolean) => {
    setUpdatingCompletionOp(opId);
    try {
      const updated = await patchOrderProvider(opId, { isCompleted: value });
      setOrdenesProveedor(prev => prev.map(op => (op.id === opId ? { ...op, isCompleted: updated.isCompleted } : op)));
      notification.success({
        message: value ? 'OP completada' : 'OP marcada como pendiente',
        description: value ? 'La orden de proveedor fue marcada como completada.' : 'La orden de proveedor vuelve a estado pendiente.'
      });
    } catch (error) {
      console.error('Error al actualizar estado de OP:', error);
      notification.error({
        message: 'Error al actualizar',
        description: 'No se pudo actualizar el estado de la orden de proveedor'
      });
    } finally {
      setUpdatingCompletionOp(null);
    }
  };

  const serializeDateValue = (value: unknown) => {
    if (!value) {
      return null;
    }

    if (typeof value === 'object' && value !== null && 'toISOString' in value) {
      return (value as dayjs.Dayjs).toISOString();
    }

    if (typeof value === 'string') {
      return value;
    }

    return null;
  };

  const handleFieldChange = (opId: string, fieldName: string, value: unknown) => {
    const opKey = `op_${opId}`;
    const originalValue = originalValues[opKey]?.[fieldName];

    let isChanged;

    if (
      fieldName === 'fechaEntrega' ||
      fieldName === 'fechaRecepcion' ||
      fieldName === 'fechaProgramada' ||
      fieldName === 'fechaDespacho'
    ) {
      const originalDateStr = originalValue && typeof originalValue === 'object' && 'toISOString' in originalValue
        ? (originalValue as dayjs.Dayjs).toISOString()
        : originalValue ?? null;
      const currentDateStr = value && typeof value === 'object' && 'toISOString' in value
        ? (value as dayjs.Dayjs).toISOString()
        : value ?? null;
      isChanged = originalDateStr !== currentDateStr;
    } else {
      isChanged = JSON.stringify(originalValue) !== JSON.stringify(value);
    }

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

  const getCronogramaChangesCount = (opId: number) => {
    const opChanges = changedFields[opId.toString()];
    let count = 0;

    scheduleFields.forEach(field => {
      if (opChanges?.has(field)) {
        count += 1;
      }
    });

    if (changedOCFields.has('fechaMaxForm')) {
      count += 1;
    }

    return count;
  };

  const hasCronogramaChanges = (opId: number) => getCronogramaChangesCount(opId) > 0;

  const saveCronograma = async (opId: number) => {
    if (!hasCronogramaChanges(opId)) {
      notification.info({
        message: 'Sin cambios',
        description: 'No hay cambios en el cronograma para guardar'
      });
      return;
    }

    const opKey = `op_${opId}`;
    const currentValues = form.getFieldValue(opKey) || {};
    const opChangedSet = new Set(changedFields[opId.toString()] || []);

    setSavingCronograma(opId.toString());

    try {
      const schedulePayload: Record<string, unknown> = {};

      scheduleFields.forEach(field => {
        if (opChangedSet.has(field)) {
          const fieldValue = currentValues[field];
          schedulePayload[field] = serializeDateValue(fieldValue);
        }
      });

      const requests: Promise<unknown>[] = [];

      if (Object.keys(schedulePayload).length > 0) {
        requests.push(patchOrderProvider(opId, schedulePayload));
      }

      let fechaMaxFormValue: string | null = null;
      if (changedOCFields.has('fechaMaxForm')) {
        const ocValue = form.getFieldValue('fechaMaxForm');
        if (ocValue) {
          if (dayjs.isDayjs(ocValue)) {
            fechaMaxFormValue = (ocValue as dayjs.Dayjs).format('YYYY-MM-DD');
          } else if (typeof ocValue === 'string') {
            const d = dayjs(ocValue);
            fechaMaxFormValue = d.isValid() ? d.format('YYYY-MM-DD') : ocValue;
          } else {
            fechaMaxFormValue = null;
          }
        } else {
          fechaMaxFormValue = null;
        }
        requests.push(updateOrdenCompra(sale.id, { fechaMaxForm: fechaMaxFormValue }));
      }

      if (requests.length === 0) {
        notification.info({
          message: 'Sin cambios',
          description: 'No hay cambios en el cronograma para guardar'
        });
        return;
      }

      await Promise.all(requests);

      notification.success({
        message: 'Cronograma actualizado',
        description: 'Las fechas del cronograma se guardaron correctamente'
      });

      setChangedFields(prev => {
        const newChanged = { ...prev };
        const opKeyString = opId.toString();
        const updatedSet = new Set(newChanged[opKeyString] || []);
        scheduleFields.forEach(field => updatedSet.delete(field));

        if (updatedSet.size === 0) {
          delete newChanged[opKeyString];
        } else {
          newChanged[opKeyString] = updatedSet;
        }

        return newChanged;
      });

      setOriginalValues(prev => {
        const next = { ...prev };
        const opKeyString = `op_${opId}`;
        const existing = { ...(next[opKeyString] || {}) };

        scheduleFields.forEach(field => {
          const fieldValue = form.getFieldValue([opKeyString, field]);
          if (fieldValue && typeof fieldValue === 'object' && 'clone' in fieldValue) {
            existing[field] = (fieldValue as dayjs.Dayjs).clone();
          } else {
            existing[field] = fieldValue;
          }
        });

        next[opKeyString] = existing;
        return next;
      });

      if (changedOCFields.has('fechaMaxForm')) {
        setChangedOCFields(prev => {
          if (!prev.has('fechaMaxForm')) {
            return prev;
          }
          const next = new Set(prev);
          next.delete('fechaMaxForm');
          return next;
        });

        const currentFechaMaxForm = form.getFieldValue('fechaMaxForm');
        setOriginalOCValues(prev => ({
          ...prev,
          fechaMaxForm: currentFechaMaxForm && typeof currentFechaMaxForm === 'object' && 'clone' in currentFechaMaxForm
            ? (currentFechaMaxForm as dayjs.Dayjs).clone()
            : currentFechaMaxForm
        }));

        sale.fechaMaxForm = fechaMaxFormValue ?? '';
      }

      setOrdenesProveedor(prev => prev.map(op => {
        if (op.id !== opId) {
          return op;
        }

        const updatedFields: Record<string, unknown> = {};
        scheduleFields.forEach(field => {
          if (opChangedSet.has(field)) {
            const fieldValue = form.getFieldValue([`op_${opId}`, field]);
            updatedFields[field] = serializeDateValue(fieldValue);
          }
        });

        return {
          ...op,
          ...updatedFields
        };
      }));
    } catch (error) {
      console.error('Error al guardar cronograma:', error);
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudieron guardar las fechas del cronograma'
      });
    } finally {
      setSavingCronograma(null);
    }
  };

  const loadTransportContacts = async (transportId: number, existingContactId?: number) => {
    try {
      const contacts = await getContactsByEntityType('transporte', transportId);
      setTransportContacts(contacts);

      // Seleccionar contacto: existente si está disponible, sino destacado o primero
      let contactoSeleccionado;
      if (existingContactId && contacts.find(c => c.id === existingContactId)) {
        contactoSeleccionado = contacts.find(c => c.id === existingContactId);
      } else {
        const contactoDestacado = contacts.find(contact => contact.usuarioDestacado);
        contactoSeleccionado = contactoDestacado || contacts[0];
      }

      if (contactoSeleccionado) {
        // Establecer el valor del formulario
        form.setFieldsValue({
          contactoId: contactoSeleccionado.id
        });
      }
    } catch (error) {
      console.error('Error loading transport contacts:', error);
      setTransportContacts([]);
    }
  };



  const handleViewTransporte = (transporteAsignado: TransporteAsignadoUI) => {
    setTransporteModal({
      open: true,
      mode: 'view',
      opId: transporteAsignado.ordenProveedorId,
      transporteData: transporteAsignado
    });
    // Cargar contactos del transporte seleccionado para vista
    if (transporteAsignado.transporte?.id) {
      loadTransportContacts(transporteAsignado.transporte.id, transporteAsignado.contactoTransporte?.id);
    }
  };

  const handleOCFieldChange = (fieldName: string, value: unknown) => {
    const originalValue = originalOCValues[fieldName];

    // Comparar valores, teniendo en cuenta que dayjs objects requieren comparación especial
    let isChanged = false;
    if (fieldName === 'fechaEntregaOC' || fieldName === 'fechaPeruCompras' || fieldName === 'fechaMaxForm') {
      // Para campos de fecha-only, comparar como 'YYYY-MM-DD'
      const formatDateOnly = (val: unknown) => {
        if (!val) return null;
        if (dayjs.isDayjs(val)) return (val as dayjs.Dayjs).format('YYYY-MM-DD');
        if (typeof val === 'string') {
          const d = dayjs(val);
          return d.isValid() ? d.format('YYYY-MM-DD') : val;
        }
        return null;
      };
      const originalDateStr = formatDateOnly(originalValue);
      const currentDateStr = formatDateOnly(value);
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

        if (
          (fieldName === 'fechaEntrega' ||
            fieldName === 'fechaRecepcion' ||
            fieldName === 'fechaProgramada' ||
            fieldName === 'fechaDespacho') &&
          value &&
          typeof value === 'object' &&
          'toISOString' in value
        ) {
          value = value.toISOString();
        }

        // Para retornoMercaderia, si es "OTROS", usar el valor personalizado
        if (fieldName === 'retornoMercaderia' && value === 'OTROS') {
          const customValue = customRetornoValues[opId];
          value = customValue ? `OTROS: ${customValue}` : 'OTROS';
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

        if (fieldName === 'fechaEntregaOC' || fieldName === 'fechaPeruCompras' || fieldName === 'fechaMaxForm') {
          if (!value) {
            value = null;
          } else if (dayjs.isDayjs(value)) {
            value = (value as dayjs.Dayjs).format('YYYY-MM-DD');
          } else if (typeof value === 'string') {
            const d = dayjs(value);
            value = d.isValid() ? d.format('YYYY-MM-DD') : value;
          }
        }

        // Mapear nombres de campos del frontend al backend
        const fieldMapping: Record<string, string> = {
          fechaEntregaOC: 'fechaEntregaOc',
          fechaPeruCompras: 'fechaPeruCompras',
          fechaMaxForm: 'fechaMaxForm'
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

          if (fieldName === 'fechaEntregaOC' || fieldName === 'fechaPeruCompras' || fieldName === 'fechaMaxForm') {
            if (!value) {
              value = null;
            } else if (dayjs.isDayjs(value)) {
              value = (value as dayjs.Dayjs).format('YYYY-MM-DD');
            } else if (typeof value === 'string') {
              const d = dayjs(value);
              value = d.isValid() ? d.format('YYYY-MM-DD') : value;
            }
          }

          // Mapear nombres de campos del frontend al backend
          const fieldMapping: Record<string, string> = {
            fechaEntregaOC: 'fechaEntregaOc',
            fechaPeruCompras: 'fechaPeruCompras',
            fechaMaxForm: 'fechaMaxForm'
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

            if (
              (fieldName === 'fechaEntrega' ||
                fieldName === 'fechaRecepcion' ||
                fieldName === 'fechaProgramada' ||
                fieldName === 'fechaDespacho') &&
              value &&
              typeof value === 'object' &&
              'toISOString' in value
            ) {
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
            headerLeft={<Typography variant="body1" sx={{ fontWeight: 400, color: '#ffffff' }}>Fecha creación: {formattedDate(sale.createdAt)}</Typography>}
            headerRight={<Typography variant="body1" sx={{ fontWeight: 400, color: '#ffffff' }}>Fecha actualización: {formattedDate(sale.updatedAt)}</Typography>}
            resumeContent={
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#ffffff' }}>
                  {sale.codigoVenta}
                </Typography>
                <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                  {sale?.cliente?.razonSocial ?? '---'}
                </Typography>
                <Typography sx={{ fontWeight: 300, color: '#ffffff', opacity: 0.8, fontSize: '0.875rem' }}>
                  {sale?.cliente?.ruc ?? '---'}
                </Typography>
              </Box>
            }
          >
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
              {ordenesProveedor.map((op, index) => {
                const cronogramaChangesCount = getCronogramaChangesCount(op.id);
                const isSavingCronograma = savingCronograma === op.id.toString();
                const cronogramaDisabled = cronogramaChangesCount === 0 || isSavingCronograma;

                return (
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
                          checked={Boolean(op.isCompleted)}
                          onChange={(event) => handleToggleOpCompleted(op.id, event.target.checked)}
                          disabled={updatingCompletionOp === op.id}
                          color="success" />

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
                        {/* btn de edicio */}
                        <Tooltip title="Editar orden de proveedor">
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
                            onClick={() => window.open(`/provider-orders/${op.id}`, '_blank')}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        {/* btn de impresion */}
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
                        <Typography sx={{ color: 'white', fontSize: '0.875rem' }}>
                          Última actualización: {formattedDate(op.updatedAt)}
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
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  mb: 1
                                }}>
                                  <Typography variant="body1" color="text.secondary" sx={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}>
                                    <ScheduleIcon sx={{ color: '#3b82f6', fontSize: 14, mr: 1 }} />
                                    Cronograma de Fechas
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => saveCronograma(op.id)}
                                    sx={{
                                      display: cronogramaDisabled ? 'none' : 'inline-flex',
                                      bgcolor: '#3b82f6',
                                      '&:hover': {
                                        bgcolor: '#2563eb'
                                      },
                                      '&:disabled': {
                                        bgcolor: '#cbd5f5',
                                        color: '#1e3a8a'
                                      },
                                      fontSize: '0.75rem',
                                      px: 2,
                                      py: 0.5,
                                      textTransform: 'none'
                                    }}
                                  >
                                    {isSavingCronograma
                                      ? 'Guardando...'
                                      : cronogramaChangesCount > 0
                                        ? `Guardar cronograma (${cronogramaChangesCount})`
                                        : 'Guardar cronograma'}
                                  </Button>
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid size={{ xs: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                        Fecha Máxima de Entrega
                                      </Typography>
                                      <Form.Item
                                        name="fechaMaxForm"
                                        initialValue={sale.fechaMaxForm ? dayjs(sale.fechaMaxForm) : null}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <DatePickerAntd
                                          placeholder="Seleccionar fecha"
                                          onChange={(value) => handleOCFieldChange('fechaMaxForm', value)}
                                        />
                                      </Form.Item>
                                    </Box>
                                  </Grid>
                                  <Grid size={{ xs: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                        Fecha Recepción
                                      </Typography>
                                      <Form.Item
                                        name={[`op_${op.id}`, 'fechaRecepcion']}
                                        initialValue={op.fechaRecepcion ? dayjs(op.fechaRecepcion) : null}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <DatePickerAntd
                                          placeholder="Seleccionar fecha y hora"
                                          showTime={{ format: 'HH:mm' }}
                                          onChange={(value) => handleFieldChange(op.id.toString(), 'fechaRecepcion', value)}
                                        />
                                      </Form.Item>
                                    </Box>
                                  </Grid>
                                  <Grid size={{ xs: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                        Fecha Programada
                                      </Typography>
                                      <Form.Item
                                        name={[`op_${op.id}`, 'fechaProgramada']}
                                        initialValue={op.fechaProgramada ? dayjs(op.fechaProgramada) : null}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <DatePickerAntd
                                          placeholder="Seleccionar fecha"
                                          disabled={!canEditSchedule}
                                          onChange={(value) => handleFieldChange(op.id.toString(), 'fechaProgramada', value)}
                                        />
                                      </Form.Item>
                                    </Box>
                                  </Grid>
                                  <Grid size={{ xs: 6, md: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                                        Fecha Despacho
                                      </Typography>
                                      <Form.Item
                                        name={[`op_${op.id}`, 'fechaDespacho']}
                                        initialValue={op.fechaDespacho ? dayjs(op.fechaDespacho) : null}
                                        style={{ marginBottom: 0 }}
                                      >
                                        <DatePickerAntd
                                          placeholder="Seleccionar fecha"
                                          disabled={!canEditSchedule}
                                          onChange={(value) => handleFieldChange(op.id.toString(), 'fechaDespacho', value)}
                                        />
                                      </Form.Item>
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
                                          maxWidth: 500,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
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

                        {/* Transportes Asignados de la OP */}
                        {op.transportesAsignados && op.transportesAsignados.length > 0 && (
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
                                  <LocalShippingIcon sx={{ color: '#10b981', fontSize: 14, mr: 1 }} />
                                  Transportes Asignados ({op.transportesAsignados.length})
                                </Typography>
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
                                        Razón Social
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        p: 1.5,
                                        borderBottom: '2px solid #e5e7eb'
                                      }}>
                                        RUC
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        p: 1.5,
                                        borderBottom: '2px solid #e5e7eb'
                                      }}>
                                        Destino
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        p: 1.5,
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'right'
                                      }}>
                                        Flete
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        p: 1.5,
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'right'
                                      }}>
                                        Tipo Pago
                                      </TableCell>
                                      <TableCell sx={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#374151',
                                        p: 1.5,
                                        borderBottom: '2px solid #e5e7eb',
                                        textAlign: 'center',
                                        width: '120px'
                                      }}>
                                        Acciones
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {op.transportesAsignados.map((transporteAsignado, idx: number) => (
                                      <TableRow key={transporteAsignado.id} sx={{
                                        '&:nth-of-type(odd)': { bgcolor: '#fafafa' },
                                        '&:hover': { bgcolor: '#f1f5f9' }
                                      }}>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          p: 1.5,
                                          fontWeight: 500,
                                          color: '#1f2937'
                                        }}>
                                          {transporteAsignado.codigoTransporte}
                                        </TableCell>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          p: 1.5,
                                          fontWeight: 500,
                                          color: '#1f2937'
                                        }}>
                                          {transporteAsignado.transporte?.razonSocial || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          p: 1.5,
                                          color: '#6b7280'
                                        }}>
                                          {transporteAsignado.transporte?.ruc || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          p: 1.5,
                                          color: '#6b7280'
                                        }}>
                                          {transporteAsignado.tipoDestino}
                                        </TableCell>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 600,
                                          p: 1.5,
                                          textAlign: 'right'
                                        }}>
                                          {transporteAsignado.montoFlete !== null && transporteAsignado.montoFlete !== undefined
                                            ? formatCurrency(parseFloat(String(transporteAsignado.montoFlete)))
                                            : 'N/A'
                                          }
                                        </TableCell>
                                        <TableCell sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 600,
                                          p: 1.5,
                                          color: heroUIColors.secondary[500],
                                          textAlign: 'right'
                                        }}>
                                          {transporteAsignado.estadoPago || 'N/A'}
                                        </TableCell>
                                        <TableCell sx={{
                                          p: 1,
                                          textAlign: 'center'
                                        }}>
                                          <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Ver transporte">
                                              <IconButton
                                                size="small"
                                                sx={{
                                                  color: '#10b981',
                                                  '&:hover': { bgcolor: '#f0fdf4' }
                                                }}
                                                onClick={() => handleViewTransporte(transporteAsignado)}
                                              >
                                                <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Stack>
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
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'flex-start' }}>
                                  <Box sx={{ flex: 2 }}>
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
                                  </Box>

                                  {/* Campo de texto personalizado cuando se selecciona "OTROS" */}
                                  {form.getFieldValue([`op_${op.id}`, 'retornoMercaderia']) === 'OTROS' && (
                                    <Box sx={{ flex: 1 }}>
                                      <Form.Item style={{ marginBottom: 0 }}>
                                        <InputAntd
                                          placeholder="Especificar otro tipo"
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
                                    </Box>
                                  )}
                                </Box>
                              </Grid>

                              {/* Tercera fila: Observaciones */}
                              <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" sx={{
                                  fontWeight: 600,
                                  mb: 1.5,
                                  color: '#374151',
                                  fontSize: '0.875rem',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em'
                                }}>
                                  Observaciones
                                </Typography>
                                <Form.Item
                                  name={[`op_${op.id}`, 'observaciones']}
                                  initialValue={op.observaciones}
                                  style={{ marginBottom: 0 }}
                                >
                                  <TextArea
                                    placeholder="Ingrese observaciones adicionales"
                                    rows={3}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange(op.id.toString(), 'observaciones', e.target.value)}
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
                );
              })}
            </Stack>
          )}

          <Box sx={{ mt: 3 }}>
            <BillingHistory billings={billingHistory} readOnly={true} />
          </Box>

          {/* Sección OC Conforme */}
          <Card
            sx={{
              bgcolor: '#1e293b',
              borderRadius: 2,
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

            {/* Selector de Estado de Seguimiento */}
            <Box sx={{ minWidth: 250 }}>
              <Form.Item
                name="estadoRolSeguimiento"
                initialValue={sale.estadoRolSeguimiento || 'PENDIENTE'}
                style={{ marginBottom: 0 }}
              >
                <Select
                  size='large'
                  onChange={(value) => handleOCFieldChange('estadoRolSeguimiento', value)}
                  style={{ width: '100%' }}
                  dropdownStyle={{
                    padding: '8px 0'
                  }}
                >
                  {Object.values(ESTADOS_SEGUIMIENTO).map(estado => {
                    const color = estadoSeguimientoBgMap[estado.key];
                    return (
                      <Select.Option key={estado.key} value={estado.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: color,
                              boxShadow: `0 0 8px ${color}80`
                            }}
                          />
                          <span>{estado.label}</span>
                        </Box>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Box>
          </Box>

          {/* Botones de acción - Centrados debajo */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mt: 3
          }}>
            {changedOCFields.size > 0 && (
              <Button
                variant="outlined"
                onClick={cancelOCChanges}
                disabled={savingOC}
                sx={{
                  minWidth: 200,
                  height: 48,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
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
                minWidth: 250,
                height: 48,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
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
          </Box>
        </Stack>
      </Form>


      <Modal
        open={transporteModal.open}
        onClose={() => setTransporteModal({ open: false, mode: 'create', opId: null, transporteData: null })}
        sx={{ overflow: 'auto' }}
      >
        <MuiBox sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '1000px' },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e5e7eb',
          p: 0,
        }}>
          {/* Header del Modal */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 4,
            pb: 3,
            borderBottom: '1px solid #e5e7eb',
            borderRadius: '12px 12px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 32, color: 'black' }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Detalles de Transporte
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Información completa del servicio de transporte asignado
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setTransporteModal({ open: false, mode: 'create', opId: null, transporteData: null })}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 4 }}>
            {/* Pestañas mejoradas */}
            <Box sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 4,
              '& .MuiTabs-root': {
                minHeight: 48,
              },
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                minWidth: 120,
                '&.Mui-selected': {
                  color: '#667eea',
                  fontWeight: 600,
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                bgcolor: '#667eea',
              }
            }}>
              <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
                <Tab
                  icon={<Business sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Información Básica"
                />
                <Tab
                  icon={<SettingsIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Información Avanzada"
                />
                <Tab
                  icon={<PaymentIcon sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                  label="Pagos"
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            {(() => {
              if (activeTab === 0) {
                return (
                  <Box>
                    <Grid container spacing={4}>
                      {/* Empresa de Transporte */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#374151',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Empresa de Transporte
                        </Typography>
                        <Box sx={{
                          p: 2,
                          bgcolor: '#f8fafc',
                          borderRadius: 1,
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {transporteModal.transporteData?.transporte?.razonSocial || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                            RUC: {transporteModal.transporteData?.transporte?.ruc || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            {getUbigeoName(transporteModal.transporteData?.transporte?.departamento) || 'N/A'} - {getUbigeoName(transporteModal.transporteData?.transporte?.provincia) || 'N/A'} - {getUbigeoName(transporteModal.transporteData?.transporte?.distrito) || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Contacto */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#374151',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Contacto
                        </Typography>
                        <Box sx={{
                          p: 2,
                          bgcolor: '#f8fafc',
                          borderRadius: 1,
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {transporteModal.transporteData?.contactoTransporte?.nombre || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', mt: 0.5 }}>
                            Cargo: {transporteModal.transporteData?.contactoTransporte?.cargo || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Teléfono: {transporteModal.transporteData?.contactoTransporte?.telefono || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                            Email: {transporteModal.transporteData?.contactoTransporte?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Tipo de Destino */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#374151',
                          fontSize: '0.875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Tipo de Destino
                        </Typography>
                        <Box sx={{
                          p: 2,
                          bgcolor: '#f8fafc',
                          borderRadius: 1,
                          border: '1px solid #e2e8f0'
                        }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {transporteModal.transporteData?.tipoDestino === 'AGENCIA' ? 'Agencia' :
                              transporteModal.transporteData?.tipoDestino === 'CLIENTE' ? 'Cliente' :
                                transporteModal.transporteData?.tipoDestino === 'ALMACEN' ? 'Almacén' : 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Almacén (solo si tipoDestino es ALMACEN) */}
                      {transporteModal.transporteData?.tipoDestino === 'ALMACEN' && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: '#374151',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Almacén
                          </Typography>
                          <Box sx={{
                            p: 2,
                            bgcolor: '#f8fafc',
                            borderRadius: 1,
                            border: '1px solid #e2e8f0'
                          }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                              {almacenes.find(a => a.id === transporteModal.transporteData?.almacenId)?.nombre || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{
                          display: 'flex',
                          gap: 3,
                          flexWrap: 'nowrap',
                          overflowX: 'auto'
                        }}>
                          <Box sx={{
                            minWidth: 260,
                            flex: '1 1 50%'
                          }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 600,
                              mb: 2,
                              color: '#374151',
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Archivo de Cotización
                            </Typography>
                            <Box sx={{
                              p: 2,
                              bgcolor: '#f8fafc',
                              borderRadius: 1,
                              border: '1px solid #e2e8f0'
                            }}>
                              {transporteModal.transporteData?.archivoCotizacion ? (
                                <Button
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => {
                                    const fileUrl = transporteModal.transporteData?.archivoCotizacion ?? null;
                                    if (fileUrl) {
                                      window.open(fileUrl, '_blank');
                                    }
                                  }}
                                  sx={{
                                    borderColor: '#10b981',
                                    color: '#10b981',
                                    '&:hover': {
                                      borderColor: '#059669',
                                      bgcolor: 'rgba(16, 185, 129, 0.04)',
                                    }
                                  }}
                                >
                                  Ver Archivo
                                </Button>
                              ) : (
                                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                                  Sin archivo de cotización
                                </Typography>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{
                            minWidth: 260,
                            flex: '1 1 50%'
                          }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 600,
                              mb: 2,
                              color: '#374151',
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em'
                            }}>
                              Flete Cotizado
                            </Typography>
                            <Box sx={{
                              p: 2,
                              bgcolor: '#f8fafc',
                              borderRadius: 1,
                              border: '1px solid #e2e8f0'
                            }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: '#10b981', fontSize: '1.1rem' }}>
                                {transporteModal.transporteData?.montoFlete ? formatCurrency(parseFloat(String(transporteModal.transporteData.montoFlete))) : 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              }

              if (activeTab === 1) {
                return (
                  <Box>
                    {/* Sección de Costos */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        '&::before': {
                          content: '""',
                          width: 4,
                          height: 20,
                          bgcolor: '#667eea',
                          borderRadius: 2,
                        }
                      }}>
                        💰 Información de Costos
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 3,
                        bgcolor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid #f3f4f6'
                      }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{
                            p: 2,
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                          }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              Flete Cotizado
                            </Typography>
                            <InputNumberAntd
                              isCurrency
                              disabled
                              value={transporteModal.transporteData?.montoFlete || 0}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{
                            p: 2,
                            borderRadius: 1,
                            transition: 'all 0.2s ease',
                          }}>
                            <Typography variant="body2" sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                              Flete Pagado
                            </Typography>
                            <InputNumberAntd
                              isCurrency
                              value={transporteFormData.montoFletePagado}
                              onChange={(value) => updateTransporteField('montoFletePagado', Number(value) || 0)}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Sección de Documentos */}
                    <Box>
                      <Typography variant="h6" sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: '#1f2937',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        '&::before': {
                          content: '""',
                          width: 4,
                          height: 20,
                          bgcolor: '#667eea',
                          borderRadius: 2,
                        }
                      }}>
                        📄 Documentos y Facturación
                      </Typography>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flexWrap: 'wrap',
                        gap: 3,
                        bgcolor: '#f9fafb',
                        borderRadius: 2,
                        border: '1px solid #f3f4f6'
                      }}>
                        <Box sx={{
                          p: 3,
                          flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' },
                          minWidth: { xs: '100%', md: 'calc(50% - 24px)' }
                        }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: '#374151',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            📋 Número de Factura
                          </Typography>
                          <InputAntd
                            placeholder="Ingrese número de factura"
                            value={transporteFormData.numeroFactura}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTransporteField('numeroFactura', e.target.value)}
                          />
                        </Box>
                        <Box sx={{
                          p: 3,
                          flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' },
                          minWidth: { xs: '100%', md: 'calc(50% - 24px)' }
                        }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: '#374151',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            📄 Archivo de Factura
                          </Typography>
                          <SimpleFileUpload
                            value={transporteFormData.archivoFactura}
                            onChange={(file) => updateTransporteField('archivoFactura', file)}
                            accept="application/pdf"
                          />
                        </Box>
                        <Box sx={{
                          p: 3,
                          flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' },
                          minWidth: { xs: '100%', md: 'calc(50% - 24px)' }
                        }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: '#374151',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            🔢 Número de Guía (GRT)
                          </Typography>
                          <InputAntd
                            placeholder="Ingrese número de guía (GRT)"
                            value={transporteFormData.grt}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTransporteField('grt', e.target.value)}
                          />
                        </Box>
                        <Box sx={{
                          p: 3,
                          flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' },
                          minWidth: { xs: '100%', md: 'calc(50% - 24px)' }
                        }}>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: '#374151',
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            🚛 Archivo de guía
                          </Typography>
                          <SimpleFileUpload
                            value={transporteFormData.guiaRemision}
                            onChange={(file) => updateTransporteField('guiaRemision', file)}
                            accept="application/pdf"
                          />
                        </Box>
                        {/* Submit form */}
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          {changedTransporteFields.size > 0 && (
                            <Button
                              variant="outlined"
                              onClick={cancelTransporteChanges}
                              disabled={savingTransporte}
                              sx={{
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                '&:hover': {
                                  borderColor: '#9ca3af',
                                  backgroundColor: 'rgba(243, 244, 246, 0.5)',
                                }
                              }}
                            >
                              Cancelar
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveTransporte}
                            disabled={savingTransporte || changedTransporteFields.size === 0}
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
                            {savingTransporte ? 'Guardando...' : 'Guardar Cambios'}
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              }

              if (activeTab === 2) {
                return (
                  <Box>
                    <PaymentsList
                      title="Pagos del Transporte"
                      payments={transportePaymentsState.payments}
                      tipoPago={transportePaymentsState.tipoPago}
                      notaPago={transportePaymentsState.notaPago}
                      mode="readonly"
                      montoTotal={transporteModal.transporteData?.montoFlete ? Number(transporteModal.transporteData.montoFlete) : 0}
                      onTipoPagoChange={handleTransporteTipoPagoChange}
                      onNotaPagoChange={handleTransporteNotaPagoChange}
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      {transportePaymentsChanged && (
                        <Button
                          variant="outlined"
                          onClick={cancelTransportePaymentsChanges}
                          disabled={savingTransportePayments}
                          sx={{
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            '&:hover': {
                              borderColor: '#9ca3af',
                              backgroundColor: 'rgba(243, 244, 246, 0.5)'
                            }
                          }}
                        >
                          Cancelar
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        onClick={handleSaveTransportePayments}
                        disabled={!transportePaymentsChanged || savingTransportePayments}
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
                        {savingTransportePayments ? 'Guardando...' : 'Guardar Pagos'}
                      </Button>
                    </Box>
                  </Box>
                );
              }

              return null;
            })()}
          </Box>
        </MuiBox>
      </Modal>
    </Box>
  );
};

export default TrackingFormContent;
