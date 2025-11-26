import { Fragment, useState, useEffect } from 'react';
import { Form, notification, Spin, Input, InputNumber, Select } from 'antd';
import { Business, Delete, Add, Inventory, LocalShipping, Print, ArrowBack } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  Grid,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Chip,
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SelectCompanies from '@/components/selects/SelectCompanies';
import DatePickerAntd from '@/components/DatePickerAnt';
import { SaleProps } from '@/services/sales/sales';
import SelectContactsByProvider from '@/components/selects/SelectContactsByProvider';
import { createOrderProvider, updateOrderProvider, getOrderProvider, patchOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { uploadFile } from '@/services/files/file.requests';
import { printOrdenProveedor } from '@/services/print/print.requests';
import { useNavigate } from 'react-router-dom';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import PaymentsList from '@/components/PaymentsList';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ProviderProps } from '@/services/providers/providers';

dayjs.extend(utc);
import ProviderSelectorModal from '../../Providers/components/ProviderSelectorModal';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import TransportsSection, { getEmptyTransformRecord } from './TransportsSection';
import { usePayments } from '@/hooks/usePayments';
import InputNumberAntd from '@/components/InputNumberAntd';
import { getPrivateSaleData } from '@/services/sales/sales.request';
import { ESTADOS, estadoBgMap, EstadoVentaType } from '@/utils/constants';
import { useAppContext } from '@/context';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import { RolesEnum } from '@/services/users/user.enum';
import SelectGeneric from '@/components/selects/SelectGeneric';

interface ProviderOrderFormContentProps {
  sale: SaleProps;
  orderData?: ProviderOrderProps;
  isEditing?: boolean;
  fromTreasury?: boolean;
  targetSection?: string | null;
}

type ProductRecord = {
  codigo: string;
  descripcion: string;
  uMedida: string;
  cantidadAlmacen: string;
  cantidadCliente: string;
  cantidad: string; // Campo calculado: cantidadAlmacen + cantidadCliente
  precioUnitario: string;
  total: string;
};

type PagoRecord = {
  date: dayjs.Dayjs | null;
  bank: string;
  description: string;
  file: File | string | null;
  amount: string;
  status: boolean;
};

const getEmptyProductRecord = (): ProductRecord => ({
  codigo: '',
  descripcion: '',
  uMedida: 'UND',
  cantidadAlmacen: '0',
  cantidadCliente: '0',
  cantidad: '0', // Será calculado automáticamente
  precioUnitario: '',
  total: '',
});

const requiredField = { required: true, message: 'Requerido' };

// Función factory para crear validador de fecha de recepción
const createReceptionDateValidator = (originalDate: dayjs.Dayjs | null) => {
  return (_: unknown, value: dayjs.Dayjs | null) => {
    if (!value) {
      return Promise.resolve();
    }

    // Si el valor es igual al original (ya guardado), no validar
    if (originalDate && value.isSame(originalDate)) {
      return Promise.resolve();
    }

    // Usar hora local explícitamente
    const now = dayjs().local();
    const valueLocal = value.local();

    // Si es un día anterior, rechazar
    if (valueLocal.startOf('day').isBefore(now.startOf('day'))) {
      return Promise.reject(new Error('La fecha de recepción no puede ser menor a hoy'));
    }

    // Si es el mismo día, validar que la hora no sea menor a la actual
    if (valueLocal.startOf('day').isSame(now.startOf('day')) && valueLocal.isBefore(now)) {
      return Promise.reject(new Error('La hora de recepción no puede ser menor a la hora actual'));
    }

    return Promise.resolve();
  };
};

const disablePastReceptionDate = (current: any): boolean => {
  if (!current) return false;
  // Usar hora local explícitamente
  const now = dayjs().local();
  return current.local().startOf('day').isBefore(now.startOf('day'));
};

// Función para calcular automáticamente cantidad total y total del producto
const calculateProductTotals = (form: any, fieldName: number) => {
  setTimeout(() => {
    const productos = form.getFieldValue('productos') || [];
    const producto = productos[fieldName];
    if (producto) {
      const cantidadAlmacen = Number(producto.cantidadAlmacen) || 0;
      const cantidadCliente = Number(producto.cantidadCliente) || 0;
      const cantidadTotal = cantidadAlmacen + cantidadCliente;
      const precioUnitario = Number(producto.precioUnitario) || 0;
      const total = cantidadTotal * precioUnitario; // Sin redondeo

      // Actualizar cantidad total y total del producto
      form.setFieldValue(['productos', fieldName, 'cantidad'], cantidadTotal);
      form.setFieldValue(['productos', fieldName, 'total'], total);
    }
  }, 100);
}; const ProviderOrderFormContent = ({ sale, orderData, isEditing, fromTreasury, targetSection }: ProviderOrderFormContentProps) => {
  const { user } = useAppContext();
  const canEditSchedule = user?.role === RolesEnum.ADMIN || (user?.permisos || []).includes(PermissionsEnum.TRACKING);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);
  const { companies } = useGlobalInformation();

  // Estado para el selector de estado OP
  const [estadoRolOp, setEstadoRolOp] = useState<EstadoVentaType>(orderData?.estadoRolOp || 'PENDIENTE');

  // Estado para datos de venta privada
  const [privateSaleData, setPrivateSaleData] = useState<{
    tipoEntrega?: string;
    nombreAgencia?: string;
    destinoFinal?: string;
    nombreEntidad?: string;
    estadoPago?: string;
    notaPago?: string;
  } | null>(null);

  const [selectedCompany, setSelectedCompany] = useState<{ id: number; razonSocial: string; ruc: string } | null>(null);

  // Estado para lista de órdenes de proveedor de la misma OC
  const [providerOrders, setProviderOrders] = useState<ProviderOrderProps[]>([]);

  const empresaValue = Form.useWatch('empresa', form);

  const { handlePaymentsUpdate } = usePayments({
    entityType: 'ordenProveedor',
    entityId: orderData?.id || 0,
    onSuccess: () => {
      notification.success({
        message: 'Pagos actualizados',
        description: 'Los pagos se han actualizado correctamente'
      });
    }
  });

  // Efecto para hacer scroll automático a la sección de pago indicada
  useEffect(() => {
    if (targetSection && isEditing) {
      // Esperar a que el DOM se renderice completamente
      const timer = setTimeout(() => {
        const elementId = targetSection === 'transporte' ? 'transporte-section' : 'proveedor-payments-section';
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          // Destacar brevemente la sección
          element.style.transition = 'background-color 0.5s ease';
          element.style.backgroundColor = '#fff3cd';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [targetSection, isEditing]);

  useEffect(() => {
    if (empresaValue && companies.length > 0) {
      const company = companies.find(c => c.id === empresaValue);
      setSelectedCompany(company || null);
    } else {
      setSelectedCompany(null);
    }
  }, [empresaValue, companies]);

  // Cargar datos de venta privada
  useEffect(() => {
    const loadPrivateSaleData = async () => {
      if (sale?.id && sale?.ventaPrivada) {
        try {
          const data = await getPrivateSaleData(sale.id);

          setPrivateSaleData(data);

        } catch (error) {
          console.error('Error cargando datos de venta privada:', error);
          setPrivateSaleData(null);
        }
      } else {
        setPrivateSaleData(null);
      }
    };

    loadPrivateSaleData();
  }, [sale?.id, sale?.ventaPrivada]);

  // Sincronizar estado con prop orderData
  useEffect(() => {
    if (orderData?.estadoRolOp) {
      setEstadoRolOp(orderData.estadoRolOp);
    }
  }, [orderData?.estadoRolOp]);

  // Handler para cambiar el estado y persistir
  const handleEstadoRolOpChange = async (newEstado: EstadoVentaType) => {
    if (!isEditing || !orderData?.id) {
      notification.warning({
        message: 'No disponible',
        description: 'Debe guardar la OP primero antes de cambiar el estado'
      });
      return;
    }

    const previousEstado = estadoRolOp;
    setEstadoRolOp(newEstado);

    try {
      await patchOrderProvider(orderData.id, { estadoRolOp: newEstado });
      notification.success({
        message: 'Estado actualizado',
        description: `El estado de la OP se cambió a ${ESTADOS[newEstado].label}`
      });
    } catch (error) {
      setEstadoRolOp(previousEstado);
      notification.error({
        message: 'Error al actualizar',
        description: 'No se pudo cambiar el estado de la OP'
      });
    }
  };

  useEffect(() => {
    if (isEditing && orderData) {
      // Preparar los productos correctamente para el formulario
      const productosFormatted = orderData.productos?.map(producto => {
        const cantidadAlmacen = producto.cantidadAlmacen || 0;
        const cantidadCliente = (producto as any).cantidadCliente || 0;
        const cantidadTotal = cantidadAlmacen + cantidadCliente;

        return {
          codigo: producto.codigo || '',
          descripcion: producto.descripcion || '',
          uMedida: producto.unidadMedida || '',
          cantidadAlmacen: String(cantidadAlmacen),
          cantidadCliente: String(cantidadCliente),
          cantidad: String(cantidadTotal),
          precioUnitario: String(producto.precioUnitario || 0),
          total: String(producto.total || 0),
        };
      }) || [getEmptyProductRecord()];

      form.setFieldsValue({
        empresa: (orderData.empresa as any)?.id,
        proveedor: orderData.proveedor,
        contactoProveedor: orderData.contactoProveedor?.id || orderData.contactoProveedor,
        nombreContactoProveedor: orderData.contactoProveedor?.nombre || '',
        telefonoContactoProveedor: orderData.contactoProveedor?.telefono || '',
        fechaDespacho: orderData.fechaDespacho ? dayjs(orderData.fechaDespacho) : null,
        fechaProgramada: orderData.fechaProgramada ? dayjs(orderData.fechaProgramada) : null,
        fechaRecepcion: orderData.fechaRecepcion ? dayjs(orderData.fechaRecepcion) : null,
        montoProveedor: orderData.totalProveedor,
        productosNota: orderData.notaPedido,
        observaciones: orderData.observaciones || '',
        etiquetado: orderData.etiquetado || '',
        embalaje: orderData.embalaje || '',
        tipoPago: orderData.tipoPago || 'PENDIENTE',
        notaPago: orderData.notaPago || '',
        formaPago: orderData.formaPago || 'CONTADO',
        incluyeTransporte: !(orderData.transportesAsignados && orderData.transportesAsignados.length > 0), // ✅ Invertir lógica: si tiene transportes, switch desactivado
        productos: productosFormatted,
        pagosProveedor: Array.isArray(orderData.pagos) && orderData.pagos.length > 0
          ? (orderData.pagos as any[]).map((pago: any): PagoRecord => ({
            date: pago.fechaPago ? dayjs(pago.fechaPago) : null,
            bank: pago.bancoPago || '',
            description: pago.descripcionPago || '',
            file: pago.archivoPago || null,
            amount: pago.montoPago || '',
            status: pago.estadoPago ? true : false,
          }))
          : [],
        transportes: orderData.transportesAsignados
          ?.slice() // Copia del array para no mutar el original
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) // Ordenar por fecha de creación (menor a mayor)
          .map(transporte => ({
            id: transporte.id, // ✅ AGREGADO: ID único para updates
            transporte: transporte.transporte?.id || transporte.transporteId, // ✅ SINCRONIZACIÓN: Usar ID para select
            transporteCompleto: transporte.transporte, // ✅ SINCRONIZACIÓN: Objeto completo para información
            contacto: transporte.contactoTransporte?.id || transporte.contactoTransporteId, // ✅ SINCRONIZACIÓN: Usar ID para select
            contactoCompleto: transporte.contactoTransporte, // ✅ SINCRONIZACIÓN: Objeto completo para información
            almacen: transporte.almacen?.id || transporte.almacenId, // ✅ AGREGADO: Mapear almacén
            almacenCompleto: transporte.almacen, // ✅ AGREGADO: Objeto completo del almacén
            codigoTransporte: transporte.codigoTransporte, // ✅ AGREGADO: Mapear código de transporte
            region: transporte.region || '',
            provincia: transporte.provincia || '',
            distrito: transporte.distrito || '',
            destino: transporte.tipoDestino,
            direccion: transporte.direccion || '',
            nota: transporte.notaTransporte || '',
            flete: transporte.montoFlete || '',
            cotizacion: transporte.cotizacionTransporte || null,
            estadoPago: transporte.estadoPago || '',
            notaPago: transporte.notaPago || '',
            pagosTransporte: Array.isArray(transporte.pagos) && transporte.pagos.length > 0
              ? (transporte.pagos as any[]).map((pago: any): PagoRecord => ({
                date: pago.fechaPago ? dayjs(pago.fechaPago) : null,
                bank: pago.bancoPago || '',
                description: pago.descripcionPago || '',
                file: pago.archivoPago || null,
                amount: pago.montoPago || '',
                status: pago.estadoPago ? true : false,
              }))
              : [],
          })) || [getEmptyTransformRecord()],
      });
    } else {
      form.setFieldsValue({
        empresa: sale.empresa?.id,
        tipoPago: 'PENDIENTE',
        notaPago: '',
        formaPago: 'CONTADO',
        productosNota: '',
        observaciones: '',
        etiquetado: '',
        embalaje: '',
        incluyeTransporte: false, // ✅ Por defecto NO requiere transporte (mostrar sección)
        pagosProveedor: [],
        productos: [getEmptyProductRecord()], // ✅ USAR función simplificada
      });
    }
  }, [isEditing, orderData, form, sale]);

  // Cargar lista de órdenes de proveedor para navegación
  useEffect(() => {
    const loadProviderOrders = async () => {
      try {
        const orders = await getOrderProvider(sale.id);
        setProviderOrders(orders);
      } catch (error) {
        console.error('Error al cargar órdenes de proveedor:', error);
      }
    };

    if (sale?.id) {
      loadProviderOrders();
    }
  }, [sale?.id]);

  const handleNavigateToOrder = (orderId: number) => {
    navigate(`/provider-orders/${orderId}`);
  };

  const renderOrderNavigation = () => {
    if (providerOrders.length <= 1) return null;

    return (
      <Box sx={{ ml: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#495057', textAlign: 'center' }}>
          Órdenes de Proveedor ({providerOrders.length})
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
          {providerOrders.map((order) => (
            <Button
              key={order.id}
              size="small"
              variant={order.id === orderData?.id ? "contained" : "outlined"}
              onClick={() => handleNavigateToOrder(order.id)}
              disabled={order.id === orderData?.id}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 0.75,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                ...(order.id === orderData?.id && {
                  bgcolor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#1976d2',
                    color: 'white',
                  },
                }),
                ...(!(order.id === orderData?.id) && {
                  borderColor: '#ced4da',
                  color: '#495057',
                  '&:hover': {
                    bgcolor: '#e9ecef',
                    borderColor: '#adb5bd',
                  },
                }),
              }}
            >
              {order.codigoOp || `OP-${order.id}`}
            </Button>
          ))}
        </Stack>
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: '#6c757d' }}>
          OP actual: {orderData?.codigoOp || `OP-${orderData?.id}`}
        </Typography>
      </Box>
    );
  };

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      setLoading(true);

      const productosArr = (values.productos as ProductRecord[]).map((item: ProductRecord) => ({
        codigo: item.codigo || '',
        descripcion: item.descripcion || '',
        unidadMedida: item.uMedida || '',
        cantidad: Number(item.cantidad) || 0,
        cantidadAlmacen: Number(item.cantidadAlmacen) || 0, // ✅ USAR valor real del campo cantidadAlmacen
        cantidadCliente: Number(item.cantidadCliente) || 0, // ✅ AGREGAR valor real del campo cantidadCliente
        cantidadTotal: Number(item.cantidad) || 0, // ✅ cantidad ya contiene la suma total
        precioUnitario: Number(item.precioUnitario) || 0,
        total: Number(item.total) || 0,
      }));

      const pagosArr = ((values.pagosProveedor as PagoRecord[]) || []).map((pago: PagoRecord) => ({
        fechaPago: pago.date ? pago.date.toDate() : null,
        bancoPago: pago.bank || null,
        descripcionPago: pago.description || null,
        archivoPago: pago.file || null,
        montoPago: Number(pago.amount) || null,
        estadoPago: pago.status,
      }));

      const transportesArr = values.transportes && Array.isArray(values.transportes) ? await Promise.all(
        (values.transportes as Record<string, unknown>[]).map(async (item: Record<string, unknown>) => {
          let cotizacionUrl = null;

          if (item.cotizacion && item.cotizacion instanceof File) {
            cotizacionUrl = await uploadFile(item.cotizacion);
          } else if (typeof item.cotizacion === 'string') {
            cotizacionUrl = item.cotizacion;
          }

          return {
            transporteId: typeof item.transporte === 'object' && item.transporte ? (item.transporte as { id: number }).id : item.transporte,
            contactoTransporteId: typeof item.contacto === 'object' && item.contacto ? (item.contacto as { id: number }).id : item.contacto,
            almacenId: typeof item.almacen === 'object' && item.almacen ? (item.almacen as { id: number }).id : item.almacen || null,
            region: item.region || null,
            provincia: item.provincia || null,
            distrito: item.distrito || null,
            direccion: item.direccion || null,
            notaTransporte: item.nota || null,
            tipoDestino: item.destino || 'ALMACEN',
            montoFlete: Number(item.flete) || null,
            cotizacionTransporte: cotizacionUrl,
          };
        })
      ) : [];

      // Al procesar transportes, distinguir entre existentes y nuevos
      const processTransportesForUpdate = (transportes: any[]): any => {
        const updatedTransportes: any[] = [];
        const newTransportes: any[] = [];

        transportes.forEach((transporte) => {
          // ✅ MEJORADO: Verificar si tiene ID (transporte existente)
          if (transporte.id && transporte.id > 0) {
            // Transporte existente - UPDATE (usar ID único)
            updatedTransportes.push({
              where: { id: transporte.id }, // ✅ USAR ID en lugar de codigoTransporte
              data: {
                transporteId: typeof transporte.transporte === 'object' ? transporte.transporte?.id : transporte.transporte,
                contactoTransporteId: typeof transporte.contacto === 'object' ? transporte.contacto?.id : transporte.contacto,
                almacenId: typeof transporte.almacen === 'object' ? transporte.almacen?.id : transporte.almacen || null,
                region: transporte.region || null,
                provincia: transporte.provincia || null,
                distrito: transporte.distrito || null,
                direccion: transporte.direccion || null,
                notaTransporte: transporte.nota || null,
                montoFlete: transporte.flete ? parseFloat(transporte.flete) : 0,
                tipoDestino: transporte.destino || 'ALMACEN',
                // NO incluir codigoTransporte - se mantiene el existente
              }
            });
          } else {
            // Transporte nuevo - CREATE (se generará código automáticamente)
            newTransportes.push({
              transporteId: typeof transporte.transporte === 'object' ? transporte.transporte?.id : transporte.transporte,
              contactoTransporteId: typeof transporte.contacto === 'object' ? transporte.contacto?.id : transporte.contacto,
              almacenId: typeof transporte.almacen === 'object' ? transporte.almacen?.id : transporte.almacen || null,
              region: transporte.region || null,
              provincia: transporte.provincia || null,
              distrito: transporte.distrito || null,
              direccion: transporte.direccion || null,
              notaTransporte: transporte.nota || null,
              montoFlete: transporte.flete ? parseFloat(transporte.flete) : 0,
              tipoDestino: transporte.destino || 'ALMACEN',
              // codigoTransporte se generará automáticamente en el backend
            });
          }
        });

        return {
          update: updatedTransportes,
          create: newTransportes,
          // deleteMany: { id: { in: transportesToDelete } } // Si implementas eliminación
        };
      };

      const totalProductos = productosArr.reduce((sum: number, producto: { total: number }) => sum + Number(producto.total), 0);

      // ✅ LÓGICA INVERTIDA: guardar transportes SOLO cuando switch está DESACTIVADO (sí requiere transporte)
      const incluyeTransporte = values.incluyeTransporte;
      let transportesData;

      if (!incluyeTransporte) {  // Si NO está activado (SÍ requiere transporte)
        transportesData = isEditing
          ? processTransportesForUpdate(values.transportes as any[])
          : { create: transportesArr };
      } else {
        // Si está activado (NO requiere transporte)
        if (isEditing) {
          // En edición, eliminar todos los transportes existentes
          transportesData = { deleteMany: {} };
        } else {
          // En creación, no incluir el campo
          transportesData = undefined;
        }
      }

      const body: any = {
        ordenCompraId: sale.id,
        empresaId: values.empresa as number,
        proveedorId: typeof values.proveedor === 'object' ? (values.proveedor as ProviderProps).id : values.proveedor,
        contactoProveedorId: typeof values.contactoProveedor === 'object' ? (values.contactoProveedor as { id: number }).id : values.contactoProveedor,
        fechaProgramada: (values.fechaProgramada as dayjs.Dayjs)?.toISOString(),
        fechaDespacho: (values.fechaDespacho as dayjs.Dayjs)?.toISOString(),
        fechaRecepcion: (values.fechaRecepcion as dayjs.Dayjs)?.toISOString(),
        fechaEntrega: values.fechaEntrega as string || null,
        totalProveedor: totalProductos,
        notaPedido: values.productosNota as string || null,
        observaciones: values.observaciones as string || null,
        etiquetado: values.etiquetado as string || null,
        embalaje: values.embalaje as string || null,
        tipoPago: values.tipoPago as string || null,
        formaPago: values.formaPago as string || null,
        notaPago: values.notaPago as string || null,
        productos: isEditing ? { deleteMany: {}, create: productosArr } : { create: productosArr },
        pagos: isEditing ? { deleteMany: {}, create: pagosArr } : { create: pagosArr },
      };

      // Solo incluir transportesAsignados si hay datos
      if (transportesData !== undefined) {
        body.transportesAsignados = transportesData;
      }

      if (isEditing && orderData) {
        await updateOrderProvider(orderData.id, body);
        notification.success({ message: 'La orden del proveedor se actualizó correctamente' });
      } else {
        const op = await createOrderProvider(sale.id, body);
        notification.success({ message: 'La orden del proveedor se registró correctamente' });
        navigate(`/provider-orders/${op.id}`);
      }

    } catch (error) {
      console.error('Error al guardar orden de proveedor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      notification.error({ message: `No se logró guardar la información: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!orderData?.id) {
      notification.error({ message: 'Debe guardar la orden primero para imprimir' });
      return;
    }
    try {
      await printOrdenProveedor(orderData.id);
    } catch (error) {
      notification.error({ message: 'Error al imprimir la orden' });
    }
  };

  const handleContactoChange = (value: number, record: { optiondata?: { nombre: string; telefono: string } }) => {
    form.setFieldsValue({
      contactoProveedor: value,
      nombreContactoProveedor: record?.optiondata?.nombre,
      telefonoContactoProveedor: record?.optiondata?.telefono,
    });
  };

  const handleProviderModalClose = () => setOpenProvider(false);

  const handleProviderSelect = (data: ProviderProps) => form.setFieldValue('proveedor', data);

  const handleTipoPagoChange = (tipo: string) => form.setFieldValue('tipoPago', tipo);

  const handleFormaPagoChange = (value: string) => {
    form.setFieldValue('formaPago', value);
  };

  const handleNotaPagoChange = (nota: string) => form.setFieldValue('notaPago', nota);

  const handleFinishFailed = (errorInfo: any) => {
    console.error('Errores de validación:', errorInfo);

    const errorFields = errorInfo.errorFields || [];
    const errorCount = errorFields.length;

    if (errorCount === 0) return;

    const errorList = errorFields.map((field: any) => {
      const fieldPath = field.name.join(' > ');
      const fieldLabel = getFieldLabel(field.name);
      return `• ${fieldLabel}: ${field.errors.join(', ')}`;
    });

    if (errorCount === 1) {
      const firstError = errorFields[0];
      const fieldLabel = getFieldLabel(firstError.name);
      notification.error({
        message: 'Error de validación',
        description: `${fieldLabel}: ${firstError.errors.join(', ')}`,
        duration: 6,
      });
    } else {
      notification.error({
        message: `${errorCount} errores de validación`,
        description: (
          <div>
            <p style={{ marginBottom: 8 }}>Por favor corrija los siguientes campos:</p>
            {errorList.slice(0, 5).map((error: string, index: number) => (
              <div key={index}>{error}</div>
            ))}
            {errorCount > 5 && <div>... y {errorCount - 5} más</div>}
          </div>
        ),
        duration: 8,
      });
    }

    const errorElement = document.querySelector('.ant-form-item-has-error');
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getFieldLabel = (fieldName: any[]): string => {
    if (!fieldName || fieldName.length === 0) return 'Campo';

    const fieldMap: Record<string, string> = {
      'proveedor': 'Proveedor',
      'productos': 'Productos',
      'transportes': 'Transportes',
      'transporte': 'Empresa de Transporte',
      'contacto': 'Contacto',
      'almacen': 'Almacén',
      'destino': 'Destino',
      'flete': 'Flete',
      'cotizacion': 'Cotización',
      'codigo': 'Código',
      'descripcion': 'Descripción',
      'cantidad': 'Cantidad',
      'precioUnitario': 'Precio Unitario',
    };

    if (fieldName.length === 1) {
      return fieldMap[fieldName[0]] || fieldName[0];
    }

    if (fieldName[0] === 'productos' && fieldName.length === 3) {
      return `Producto ${Number(fieldName[1]) + 1} - ${fieldMap[fieldName[2]] || fieldName[2]}`;
    }

    if (fieldName[0] === 'transportes' && fieldName.length === 3) {
      return `Transporte ${Number(fieldName[1]) + 1} - ${fieldMap[fieldName[2]] || fieldName[2]}`;
    }

    return fieldName.join(' > ');
  };

  const handlePaymentsChange = async (payments: PagoRecord[]) => {
    if (!orderData?.id) {
      notification.error({
        message: 'Error',
        description: 'No se puede actualizar pagos sin ID de orden'
      });
      return;
    }

    const formattedPayments = payments.map(payment => ({
      fechaPago: payment.date ? payment.date.toDate() : null,
      bancoPago: payment.bank,
      descripcionPago: payment.description,
      archivoPago: typeof payment.file === 'string' ? payment.file : null,
      montoPago: payment.amount ? Number(payment.amount) : 0,
      estadoPago: payment.status
    }));

    const formaPago = form.getFieldValue('formaPago');
    const notaPago = form.getFieldValue('notaPago');

    await handlePaymentsUpdate(formattedPayments, formaPago, notaPago);

    form.setFieldValue('pagosProveedor', payments);
  };

  const handleCreateWarehouseSale = () => {
    // Abrir el módulo de almacén en una nueva pestaña
    const newTab = window.open('/warehouse', '_blank');

    if (!newTab) {
      notification.error({
        message: 'Error al abrir nueva pestaña',
        description: 'Verifica que los popups estén habilitados en tu navegador'
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
        <Form.Item name="proveedor" noStyle />
        <Form.Item name="tipoPago" noStyle />
        <Form.Item name="notaPago" noStyle />
        <Form.Item name="formaPago" noStyle />
        <Form.Item name="pagosProveedor" noStyle />

        <Stack direction="column" spacing={2}>
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Empresa Compradora
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="empresa" rules={[requiredField]}>
                    <SelectCompanies label="Empresa compradora" />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InputAntd
                    label="Razón Social"
                    value={selectedCompany?.razonSocial || 'Seleccione una empresa'}
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <InputAntd
                    label="RUC"
                    value={selectedCompany?.ruc || 'Seleccione una empresa'}
                    disabled
                    style={{ backgroundColor: '#f5f5f5' }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <StepItemContent
            showHeader
            showFooter
            ResumeIcon={Business}
            onClickSearch={fromTreasury ? undefined : () => setOpenProvider(true)}
            resumeButtons={
              isEditing && orderData ? (
                <IconButton
                  sx={{
                    border: '1px solid',
                    borderRadius: 1,
                    color: '#04BA6B',
                    zIndex: 900,
                    padding: 1.5,
                    minWidth: 44,
                    minHeight: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={handlePrint}
                >
                  <Print sx={{ fontSize: 20 }} />
                </IconButton>
              ) : null
            }
            headerLeft={
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const createdDate = getFieldValue('proveedor')?.createdAt;
                  return (
                    <Fragment>
                      {'Creado: '}
                      <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
                        {createdDate ? dayjs(createdDate).format('DD / MM / YYYY') : '---'}
                      </Typography>
                    </Fragment>
                  );
                }}
              </Form.Item>
            }
            headerRight={
              <Stack direction="row" alignItems="center" spacing={2}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const createdDate = getFieldValue('proveedor')?.updatedAt;
                    return (
                      <Fragment>
                        {'Actualizado: '}
                        <Typography component="span" color="inherit" variant="inherit" fontWeight={600}>
                          {createdDate ? dayjs(createdDate).format('DD / MM / YYYY') : '---'}
                        </Typography>
                      </Fragment>
                    );
                  }}
                </Form.Item>
              </Stack>
            }
            resumeContent={
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const provider: null | ProviderProps = getFieldValue('proveedor');
                  return (
                    <Fragment>
                      <Typography variant="h5">
                        {isEditing && orderData?.codigoOp ? orderData.codigoOp : 'OP'}
                      </Typography>
                      <Typography fontWeight={300} color={provider ? undefined : 'textSecondary'}>
                        {provider?.razonSocial ?? 'Seleccione un proveedor'}
                      </Typography>
                      <Typography fontWeight={300} color={provider ? undefined : 'textSecondary'}>
                        {provider ? `RUC: ${provider.ruc}` : ''}
                      </Typography>
                    </Fragment>
                  );
                }}
              </Form.Item>
            }
          >
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="fechaRecepcion"
                  rules={fromTreasury ? [] : [{
                    validator: createReceptionDateValidator(
                      orderData?.fechaRecepcion ? dayjs(orderData.fechaRecepcion) : null
                    )
                  }]}
                >
                  <DatePickerAntd
                    label="Fecha de recepción"
                    disabled={fromTreasury}
                    disabledDate={disablePastReceptionDate}
                    showTime={{ format: 'HH:mm' }}
                  />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaProgramada">
                  <DatePickerAntd label="Fecha programada" disabled={fromTreasury || !canEditSchedule} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaDespacho">
                  <DatePickerAntd label="Fecha de despacho" disabled={fromTreasury || !canEditSchedule} />
                </Form.Item>
              </Grid>
            </Grid>
          </StepItemContent>

          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Contacto Proveedor
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item shouldUpdate>
                    {({ getFieldValue }) => {
                      const provider: ProviderProps | null = getFieldValue('proveedor');
                      return (
                        <Form.Item name="contactoProveedor" rules={fromTreasury ? [] : [requiredField]}>
                          <SelectContactsByProvider
                            providerId={provider?.id}
                            onChange={handleContactoChange}
                            disabled={fromTreasury}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="nombreContactoProveedor">
                    <InputAntd label="Nombre del Contacto" disabled />
                  </Form.Item>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item name="telefonoContactoProveedor">
                    <InputAntd label="Teléfono del Contacto" disabled />
                  </Form.Item>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid
            size={12}
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
              border: '1px solid #e0e0e0'
            }}
          >
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
              <Box flex={1}>
                <Typography textTransform="uppercase" fontSize={14} color="#6c5fbf" fontWeight={600} textAlign="center" mb={1}>
                  Datos del cliente
                </Typography>
                <Typography textTransform="uppercase" fontSize={13} fontWeight={700}>
                  {sale?.cliente?.razonSocial ?? '---'}
                </Typography>
                <Typography textTransform="uppercase" fontSize={12} color="textSecondary">
                  RUC: {sale?.cliente?.ruc ?? '---'}
                </Typography>
                <Typography textTransform="uppercase" fontSize={12} color="textSecondary">
                  CUE: {sale?.cliente?.codigoUnidadEjecutora ?? '---'}
                </Typography>
              </Box>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <Box flex={1}>
                <Typography textTransform="uppercase" fontSize={14} color="#6c5fbf" fontWeight={600} textAlign="center" mb={1}>
                  Responsable recepción
                </Typography>
                <Typography textTransform="uppercase" fontSize={13} fontWeight={700}>
                  {sale?.contactoCliente?.cargo ?? '---'}
                </Typography>
                <Typography textTransform="uppercase" fontSize={12} color="textSecondary">
                  {sale?.contactoCliente?.nombre ?? '---'} <br />
                  {sale?.contactoCliente?.telefono ?? '---'} - {sale?.contactoCliente?.email ?? '---'}
                </Typography>
              </Box>
              <Box>
                <Divider orientation="vertical" />
              </Box>
              <Box flex={1}>
                <Typography textTransform="uppercase" fontSize={14} color="#6c5fbf" fontWeight={600} textAlign="center" mb={1}>
                  Lugar de entrega
                </Typography>
                <Typography textTransform="uppercase" fontSize={13} fontWeight={700}>
                  {sale?.direccionEntrega ?? '---'}
                </Typography>
                <Typography textTransform="uppercase" fontSize={12} color="textSecondary">
                  {sale?.departamentoEntrega ?? '---'} - {sale?.provinciaEntrega ?? '---'} - {sale?.distritoEntrega ?? '---'} <br />
                  Ref: {sale?.referenciaEntrega ?? '---'}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Tabla de productos simplificada */}
          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Productos de la Orden
                </Typography>
              }
              action={
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Inventory />}
                  onClick={handleCreateWarehouseSale}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Almacén
                </Button>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <TableContainer
              >
                <Table stickyHeader size="medium" cellPadding={0}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 120 }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 400 }}>Descripción</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 80 }}>U. Medida</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 100 }}>Cant. Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 100 }}>Cant. Almacén</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 100 }}>Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 150 }}>Precio Unit.</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 150 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 20 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Form.List
                      name="productos"
                      initialValue={[getEmptyProductRecord()]}
                      rules={[
                        {
                          validator(_, arr) {
                            if (!arr || arr.length < 1) {
                              return Promise.reject(new Error('Debe ingresar al menos 1 producto'));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map((field) => (
                            <TableRow key={field.name}>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'codigo']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input
                                    placeholder="Código"
                                    size='small'
                                    disabled={fromTreasury}
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                      height: '54px',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'descripcion']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input.TextArea
                                    placeholder="Descripción"
                                    autoSize={{ minRows: 2, maxRows: 8 }}
                                    disabled={fromTreasury}
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                      fontSize: '14px',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'uMedida']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                  initialValue="UND"
                                >
                                  <InputAntd
                                    placeholder="UND"
                                    size="small"
                                    disabled={fromTreasury}
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                      height: '54px',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'cantidadCliente']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumberAntd
                                    placeholder="0"
                                    size="large"
                                    min={0}
                                    disabled={fromTreasury}
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      textAlign: 'center',
                                      textAlignLast: 'center',
                                      height: '54px', // Altura fija para igualar al TextArea
                                    }}
                                    onChange={() => calculateProductTotals(form, field.name)}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'cantidadAlmacen']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumberAntd
                                    placeholder="0"
                                    disabled={fromTreasury}
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      textAlign: 'center',
                                      textAlignLast: 'center',
                                      height: '54px', // Altura fija para igualar al TextArea
                                    }}
                                    onChange={() => calculateProductTotals(form, field.name)}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'cantidad']}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumberAntd
                                    placeholder="0"
                                    size="large"
                                    disabled
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      textAlign: 'center',
                                      textAlignLast: 'center',
                                      backgroundColor: '#f5f5f5',
                                      height: '54px', // Altura fija para igualar al TextArea
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'precioUnitario']}
                                  rules={fromTreasury ? [] : [{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumberAntd
                                    placeholder="S/ 0.0000"
                                    isCurrency
                                    disabled={fromTreasury}
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      textAlign: 'center',
                                      textAlignLast: 'center',
                                      height: '54px',
                                      fontSize: '16px',
                                      fontWeight: 600,
                                      backgroundColor: '#f0f8ff',
                                    }}
                                    onChange={() => calculateProductTotals(form, field.name)}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle' }}>
                                <Form.Item
                                  name={[field.name, 'total']}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumberAntd
                                    placeholder="0.00"
                                    isCurrency
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      textAlign: 'center',
                                      textAlignLast: 'center',
                                      backgroundColor: '#f5f5f5',
                                      height: '54px', // Altura fija para igualar al TextArea
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1, verticalAlign: 'middle', textAlign: 'center' }}>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => remove(field.name)}
                                  disabled={fromTreasury}
                                  sx={{ fontSize: 14 }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </Form.List>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Sección de botón agregar y total fuera de la tabla */}
              <Form.List name="productos">
                {(fields, { add }) => (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 3,
                      pt: 2,
                      borderTop: '2px solid #e9ecef',
                      bgcolor: '#f8f9fa',
                      px: 3,
                      py: 2,
                      borderRadius: '0 0 8px 8px'
                    }}
                  >
                    <Button
                      onClick={() => add(getEmptyProductRecord())}
                      startIcon={<Add />}
                      variant="contained"
                      size="medium"
                      disabled={fromTreasury}
                      sx={{
                        px: 3,
                        py: 1,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(24, 144, 255, 0.3)',
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      Agregar Producto
                    </Button>

                    <Form.Item noStyle shouldUpdate>
                      {() => {
                        const productos = form.getFieldValue('productos') || [];
                        const total = productos.reduce((sum: number, prod: ProductRecord) =>
                          sum + (Number(prod?.total) || 0), 0
                        );
                        return (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              bgcolor: 'white',
                              px: 3,
                              py: 1.5,
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                              border: '1px solid #e9ecef'
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                            >
                              Total General:
                            </Typography>
                            <Typography
                              variant="h5"
                              fontWeight={700}
                              color="primary.main"
                              sx={{
                                fontSize: '1.5rem',
                                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                              }}
                            >
                              S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </Box>
                        );
                      }}
                    </Form.Item>
                  </Box>
                )}
              </Form.List>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Notas y Especificaciones
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Forma de Pago
                    </Typography>
                    <Form.Item name="formaPago">
                      <SelectGeneric
                        placeholder="Seleccione una forma de pago..."
                        disabled={fromTreasury}
                        onChange={handleFormaPagoChange}
                        options={
                          [
                            { label: 'Pago al Contado', value: 'CONTADO' },
                            { label: 'Pago al Crédito', value: 'CREDITO' },
                            { label: 'Anticipado', value: 'ANTICIPADO' },
                            { label: 'Otros', value: 'OTROS' },
                          ]
                        }
                      />
                    </Form.Item>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Etiquetado
                    </Typography>
                    <Form.Item name="etiquetado">
                      <InputAntd
                        placeholder="Especificaciones de etiquetado..."
                        disabled={fromTreasury}
                      />
                    </Form.Item>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Embalaje
                    </Typography>
                    <Form.Item name="embalaje">
                      <InputAntd
                        placeholder="Especificaciones de embalaje..."
                        disabled={fromTreasury}
                      />
                    </Form.Item>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Observaciones (Se imprime en el documento)
                    </Typography>
                    <Form.Item name="productosNota">
                      <Input.TextArea
                        placeholder="Ingrese notas adicionales sobre el pedido..."
                        rows={3}
                        disabled={fromTreasury}
                        style={{
                          borderRadius: 4,
                          fontSize: '16px',
                          border: '1px solid #d9d9d9',
                        }}
                      />
                    </Form.Item>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Nota de Pedido
                    </Typography>
                    <Form.Item name="observaciones">
                      <Input.TextArea
                        placeholder="Ingrese observaciones internas (no visibles en el documento)..."
                        rows={3}
                        disabled={fromTreasury}
                        style={{
                          borderRadius: 4,
                          fontSize: '16px',
                          border: '1px solid #d9d9d9',
                        }}
                      />
                    </Form.Item>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box id="proveedor-payments-section">
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const productos = getFieldValue('productos') || [];
                const totalProductos = productos.reduce((sum: number, producto: ProductRecord) => {
                  // Calcular el total del producto si no existe
                  const cantidad = Number(producto?.cantidad) || 0;
                  const precioUnitario = Number(producto?.precioUnitario) || 0;
                  const totalProducto = producto?.total ? Number(producto.total) : (cantidad * precioUnitario);

                  return sum + totalProducto;
                }, 0);

                const proveedor: ProviderProps | null = getFieldValue('proveedor');

                return (
                  <PaymentsList
                    title="Pagos Proveedor"
                    payments={getFieldValue('pagosProveedor') || []}
                    tipoPago={getFieldValue('formaPago')}
                    notaPago={getFieldValue('notaPago') || ''}
                    montoTotal={totalProductos}
                    mode={fromTreasury ? "edit" : "readonly"}
                    entityType="PROVIDER"
                    entityId={proveedor?.id}
                    entityName={proveedor?.razonSocial || ''}
                    onPaymentsChange={handlePaymentsChange}
                    onTipoPagoChange={handleTipoPagoChange}
                    onNotaPagoChange={handleNotaPagoChange}
                  />
                );
              }}
            </Form.Item>
          </Box>

          {/* Switch para incluir/excluir transportes */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Card sx={{ width: 'fit-content' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <LocalShipping sx={{ fontSize: 28, color: '#887bad' }} />
                  <Form.Item
                    name="incluyeTransporte"
                    valuePropName="checked"
                    style={{ margin: 0 }}
                    initialValue={true} // Por defecto NO requiere transporte
                  >
                    <Switch
                      size="medium"
                      disabled={fromTreasury}
                    />
                  </Form.Item>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Incluye Transporte
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activar esta opción si la orden NO requiere servicios de transporte
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Sección de transportes - mostrar cuando NO está activado el switch (sí requiere transporte) */}
          <Box id="transporte-section">
            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) => {
                const incluyeTransporte = getFieldValue('incluyeTransporte');

                if (incluyeTransporte) {  // Si está activado (NO requiere transporte), ocultar sección
                  return null;
                }

                // Si está desactivado (SÍ requiere transporte), mostrar sección

                return (
                  <TransportsSection
                    isTreasury={fromTreasury}
                    form={form}
                    isPrivateSale={sale?.ventaPrivada || false}
                    incluyeTransporte={incluyeTransporte}
                    privateSaleData={privateSaleData ? {
                      tipoEntrega: privateSaleData.tipoEntrega,
                      nombreAgencia: privateSaleData.nombreAgencia,
                      destinoFinal: privateSaleData.destinoFinal,
                      nombreEntidad: privateSaleData.nombreEntidad,
                    } : undefined}
                  />
                );
              }}
            </Form.Item>
          </Box>
          {/* Selector de Estado OP */}
          {isEditing && orderData && (
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3, p: 2 }}>
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/provider-orders')}
                sx={{ color: 'text.secondary' }}
              >
                Volver
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                  Estado OP:
                </Typography>
                <Select
                  size='large'
                  value={estadoRolOp}
                  onChange={handleEstadoRolOpChange}
                  style={{ minWidth: 200 }}
                  dropdownStyle={{
                    padding: '8px 0'
                  }}
                >
                  {Object.values(ESTADOS).map(estado => {
                    const color = estadoBgMap[estado.key];
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
              </Box>
            </Card>
          )}
          {fromTreasury !== true && (
            <>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Button
                  disabled={loading}
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    minWidth: 200,
                    height: 48,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                {renderOrderNavigation()}
              </Stack>
            </>

          )}
        </Stack>
      </Form>

      {openProvider && (
        <ProviderSelectorModal
          onClose={handleProviderModalClose}
          onSelected={handleProviderSelect}
        />
      )}
    </Spin>
  );
};

export default ProviderOrderFormContent;
