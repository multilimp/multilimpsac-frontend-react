import { Fragment, useState, useEffect } from 'react';
import { Form, notification, Spin, Input, InputNumber } from 'antd';
import { Business, Delete, Add, Inventory, LocalShipping } from '@mui/icons-material';
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
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SelectCompanies from '@/components/selects/SelectCompanies';
import DatePickerAntd from '@/components/DatePickerAnt';
import { SaleProps } from '@/services/sales/sales';
import SelectContactsByProvider from '@/components/selects/SelectContactsByProvider';
import { createOrderProvider, updateOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { uploadFile } from '@/services/files/file.requests';
import { useNavigate } from 'react-router-dom';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import PaymentsList from '@/components/PaymentsList';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import dayjs from 'dayjs';
import { ProviderProps } from '@/services/providers/providers';
import ProviderSelectorModal from '../../Providers/components/ProviderSelectorModal';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import TransportsSection, { getEmptyTransformRecord } from './TransportsSection';
import { usePayments } from '@/hooks/usePayments';
import InputNumberAntd from '@/components/InputNumberAntd';
import { getPrivateSaleData } from '@/services/sales/sales.request';

interface ProviderOrderFormContentProps {
  sale: SaleProps;
  orderData?: ProviderOrderProps;
  isEditing?: boolean;
  fromTreasury?: boolean;
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
      const total = Math.round((cantidadTotal * precioUnitario) * 100) / 100; // Redondear a 2 decimales

      // Actualizar cantidad total y total del producto
      form.setFieldValue(['productos', fieldName, 'cantidad'], cantidadTotal);
      form.setFieldValue(['productos', fieldName, 'total'], total);
    }
  }, 100);
}; const ProviderOrderFormContent = ({ sale, orderData, isEditing, fromTreasury }: ProviderOrderFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);
  const { companies } = useGlobalInformation();

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
          console.log('Cargando datos de venta privada para sale ID:', sale.id);
          console.log('Sale data completa:', sale);

          const data = await getPrivateSaleData(sale.id);
          console.log('Datos obtenidos del backend:', data);

          setPrivateSaleData(data);

          console.log('Datos de venta privada cargados exitosamente:', data);
        } catch (error) {
          console.error('Error cargando datos de venta privada:', error);
          setPrivateSaleData(null);
        }
      } else {
        console.log('No se cargan datos de venta privada - sale ID:', sale?.id, 'ventaPrivada:', sale?.ventaPrivada);
        setPrivateSaleData(null);
      }
    };

    loadPrivateSaleData();
  }, [sale?.id, sale?.ventaPrivada]); useEffect(() => {
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

      console.log('🔍 Cargando productos en edición:', {
        originalProductos: orderData.productos,
        productosFormatted,
        orderData
      });

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
        tipoPago: orderData.tipoPago || '',
        notaPago: orderData.notaPago || '',
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
        transportes: orderData.transportesAsignados?.map(transporte => ({
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
        tipoPago: '',
        notaPago: '',
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

      const transportesArr = await Promise.all(
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
            tipoDestino: item.destino === 'AGENCIA' ? 'AGENCIA' : 'ALMACEN',
            montoFlete: Number(item.flete) || null,
            cotizacionTransporte: cotizacionUrl,
          };
        })
      );

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
                tipoDestino: transporte.destino === 'AGENCIA' ? 'AGENCIA' : 'ALMACEN',
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
              tipoDestino: transporte.destino === 'AGENCIA' ? 'AGENCIA' : 'ALMACEN',
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
        // Si está activado (NO requiere transporte), enviar estructura vacía
        transportesData = isEditing
          ? { deleteMany: {}, create: [] }
          : { create: [] };
      }

      const body = {
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
        notaPago: values.notaPago as string || null,
        productos: isEditing ? { deleteMany: {}, create: productosArr } : { create: productosArr },
        pagos: isEditing ? { deleteMany: {}, create: pagosArr } : { create: pagosArr },
        transportesAsignados: transportesData, // ✅ USAR LA LÓGICA CORRECTA
      };

      if (isEditing && orderData) {
        await updateOrderProvider(orderData.id, body);
        notification.success({ message: 'La orden del proveedor se actualizó correctamente' });
      } else {
        await createOrderProvider(sale.id, body);
        notification.success({ message: 'La orden del proveedor se registró correctamente' });
      }

      navigate('/provider-orders');
    } catch {
      notification.error({ message: 'No se logró guardar la información' });
    } finally {
      setLoading(false);
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

  const handleNotaPagoChange = (nota: string) => form.setFieldValue('notaPago', nota);

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

    const tipoPago = form.getFieldValue('tipoPago');
    const notaPago = form.getFieldValue('notaPago');

    await handlePaymentsUpdate(formattedPayments, tipoPago, notaPago);

    form.setFieldValue('pagosProveedor', payments);
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={handleFinish}>
        <Form.Item name="proveedor" noStyle />
        <Form.Item name="tipoPago" noStyle />
        <Form.Item name="notaPago" noStyle />
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
                <Form.Item name="fechaRecepcion" rules={[requiredField]}>
                  <DatePickerAntd label="Fecha de recepción" disabled={fromTreasury} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaProgramada" rules={[requiredField]}>
                  <DatePickerAntd label="Fecha programada" disabled={fromTreasury} />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaDespacho" rules={[requiredField]}>
                  <DatePickerAntd label="Fecha de despacho" disabled={fromTreasury} />
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
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 100 }}>Cant. Almacén</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 100 }}>Cant. Cliente</TableCell>
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
                                    rows={2}
                                    disabled={fromTreasury}
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                      resize: 'none',
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
                                    placeholder="0.0000"
                                    isCurrency
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
                          <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: 'right' }}>
                              <Button
                                onClick={() => add(getEmptyProductRecord())}
                                startIcon={<Add />}
                                variant="outlined"
                                size="small"
                                disabled={fromTreasury}
                                sx={{
                                  width: 'auto',
                                  py: 1,
                                  bgcolor: fromTreasury ? '#ccc' : '#189dff',
                                  color: fromTreasury ? '#666' : 'white',
                                  borderColor: fromTreasury ? '#ccc' : '#1890ff'
                                }}
                              >
                                Agregar Producto
                              </Button>
                            </TableCell>
                            {/* Agregar label: Celda de pago total, bgcolor negra, color white */}
                            <TableCell>
                              <Form.Item noStyle shouldUpdate>
                                {() => {
                                  const productos = form.getFieldValue('productos') || [];
                                  const total = productos.reduce((sum: number, prod: ProductRecord) =>
                                    sum + (Number(prod?.total) || 0), 0
                                  );
                                  return (

                                    <Typography
                                      variant="body2"
                                      fontWeight={700}
                                      color="primary"
                                      sx={{ textAlign: 'center' }}
                                    >
                                      S/ {total.toFixed(2)}
                                    </Typography>
                                  );
                                }}
                              </Form.Item>
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </Form.List>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Nota al Proveedor
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Form.Item name="productosNota">
                <Input.TextArea
                  placeholder="Ingrese notas adicionales sobre el pedido..."
                  rows={3}
                  disabled={fromTreasury}
                  style={{
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Form.Item>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="primary" />
                  Observaciones Internas
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Form.Item name="observaciones">
                <Input.TextArea
                  placeholder="Ingrese observaciones internas (no visibles en el documento)..."
                  rows={3}
                  disabled={fromTreasury}
                  style={{
                    borderRadius: 4,
                    border: '1px solid #d9d9d9',
                  }}
                />
              </Form.Item>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory color="primary" />
                  Etiquetado y Embalaje
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Grid container spacing={3}>
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
              </Grid>
            </CardContent>
          </Card>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const productos = getFieldValue('productos') || [];
              const totalProductos = productos.reduce((sum: number, producto: ProductRecord) => {
                return sum + (Number(producto?.total) || 0);
              }, 0);

              const proveedor: ProviderProps | null = getFieldValue('proveedor');

              return (
                <PaymentsList
                  title="Pagos Proveedor"
                  payments={getFieldValue('pagosProveedor') || []}
                  tipoPago={getFieldValue('tipoPago') || ''}
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

          {fromTreasury !== true && (
            <>
              <br />
              <Stack alignItems="center" my={2}>
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
