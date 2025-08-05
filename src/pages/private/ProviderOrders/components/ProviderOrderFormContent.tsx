import { Fragment, useState, useEffect } from 'react';
import { Form, notification, Spin, Input, InputNumber } from 'antd';
import { Business, Delete, Add } from '@mui/icons-material';
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

interface ProviderOrderFormContentProps {
  sale: SaleProps;
  orderData?: ProviderOrderProps;
  isEditing?: boolean;
}

type ProductRecord = {
  codigo: string;
  descripcion: string;
  uMedida: string;
  cantidad: string;
  // ✅ CAMPOS OCULTOS REMOVIDOS: cAlmacen y cTotal
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
  uMedida: '',
  cantidad: '',
  // ✅ CAMPOS OCULTOS REMOVIDOS
  precioUnitario: '',
  total: '',
});

const requiredField = { required: true, message: 'Requerido' };

const ProviderOrderFormContent = ({ sale, orderData, isEditing = false }: ProviderOrderFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);
  const { companies } = useGlobalInformation();
  
  const [selectedCompany, setSelectedCompany] = useState<{ id: number; razonSocial: string; ruc: string } | null>(null);

  const empresaValue = Form.useWatch('empresa', form);

  useEffect(() => {
    if (empresaValue && companies.length > 0) {
      const company = companies.find(c => c.id === empresaValue);
      setSelectedCompany(company || null);
    } else {
      setSelectedCompany(null);
    }
  }, [empresaValue, companies]);

  useEffect(() => {
    if (isEditing && orderData) {
      // Preparar los productos correctamente para el formulario (campos simplificados)
      const productosFormatted = orderData.productos?.map(producto => ({
        codigo: producto.codigo || '',
        descripcion: producto.descripcion || '',
        uMedida: producto.unidadMedida || '',
        cantidad: String(producto.cantidad || 0),
        // ✅ NO incluir cAlmacen y cTotal en el formulario (campos ocultos)
        precioUnitario: String(producto.precioUnitario || 0),
        total: String(producto.total || 0),
      })) || [getEmptyProductRecord()];

      console.log('🔍 Cargando productos en edición:', {
        originalProductos: orderData.productos,
        productosFormatted,
        orderData
      });

      form.setFieldsValue({
        empresa: (orderData.empresa as any)?.id || 1,
        proveedor: orderData.proveedor,
        contactoProveedor: orderData.contactoProveedor?.id || orderData.contactoProveedor,
        nombreContactoProveedor: orderData.contactoProveedor?.nombre || '',
        telefonoContactoProveedor: orderData.contactoProveedor?.telefono || '',
        fechaDespacho: orderData.fechaDespacho ? dayjs(orderData.fechaDespacho) : null,
        fechaProgramada: orderData.fechaProgramada ? dayjs(orderData.fechaProgramada) : null,
        fechaRecepcion: orderData.fechaRecepcion ? dayjs(orderData.fechaRecepcion) : null,
        montoProveedor: orderData.totalProveedor,
        productosNota: orderData.notaPedido,
        tipoPago: orderData.tipoPago || '',
        notaPago: orderData.notaPago || '',
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
          transporte: transporte.transporte,
          contacto: transporte.contactoTransporte,
          codigoTransporte: transporte.codigoTransporte, // ✅ AGREGADO: Mapear código de transporte
          region: transporte.region || '',
          provincia: transporte.provincia || '',
          distrito: transporte.distrito || '',
          destino: transporte.tipoDestino,
          direccion: transporte.direccion || '',
          nota: transporte.notaTransporte || '',
          flete: transporte.montoFlete || '',
          cotizacion: transporte.cotizacionTransporte || null,
        })) || [getEmptyTransformRecord()],
      });
    } else {
      form.setFieldsValue({
        empresa: sale.empresa?.id,
        tipoPago: '',
        notaPago: '',
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
        cantidadAlmacen: 0, // ✅ VALOR POR DEFECTO para campo oculto
        cantidadTotal: Number(item.cantidad) || 0, // ✅ USAR cantidad como cantidadTotal
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
            region: item.region || null,
            provincia: item.provincia || null,
            distrito: item.distrito || null,
            direccion: item.direccion || null,
            notaTransporte: item.nota || null,
            tipoDestino: item.destino === 'CLIENTE' ? 'CLIENTE' : 'ALMACEN',
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
                region: transporte.region || null,
                provincia: transporte.provincia || null,
                distrito: transporte.distrito || null,
                direccion: transporte.direccion || null,
                notaTransporte: transporte.nota || null,
                montoFlete: transporte.flete ? parseFloat(transporte.flete) : 0,
                tipoDestino: transporte.destino === 'CLIENTE' ? 'CLIENTE' : 'ALMACEN',
                // NO incluir codigoTransporte - se mantiene el existente
              }
            });
          } else {  
            // Transporte nuevo - CREATE (se generará código automáticamente)
            newTransportes.push({
              transporteId: typeof transporte.transporte === 'object' ? transporte.transporte?.id : transporte.transporte,
              contactoTransporteId: typeof transporte.contacto === 'object' ? transporte.contacto?.id : transporte.contacto,
              region: transporte.region || null,
              provincia: transporte.provincia || null,
              distrito: transporte.distrito || null,
              direccion: transporte.direccion || null,
              notaTransporte: transporte.nota || null,
              montoFlete: transporte.flete ? parseFloat(transporte.flete) : 0,
              tipoDestino: transporte.destino === 'CLIENTE' ? 'CLIENTE' : 'ALMACEN',
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

      // ✅ APLICAR LA LÓGICA CORRECTA PARA TRANSPORTES
      const transportesData = isEditing 
        ? processTransportesForUpdate(values.transportes as any[])
        : { create: transportesArr };

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
    } catch (error) {
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

  // Callback para manejar cambios de productos desde EditableProductsTable
  // const handleProductsChange = (productos: any[]) => {
  //   // Recalcular el total general
  //   const totalGeneral = productos.reduce((sum: number, producto: any) => {
  //     return sum + (Number(producto.total) || 0);
  //   }, 0);
  //   
  //   console.log('🔍 Productos actualizados:', productos);
  //   console.log('🔍 Total general:', totalGeneral);
  //   
  //   // Actualizar el monto del proveedor
  //   form.setFieldValue('montoProveedor', totalGeneral);
  // };
  //   // Calcular automáticamente el total del producto
  //   const productos = form.getFieldValue('productos') || [];
  //   const producto = productos[index];
  //   
  //   console.log('🔍 Calculando producto:', { index, producto, productos });
  //   
  //   if (producto) {
  //     const cantidad = Number(producto.cantidad) || 0;
  //     const precioUnitario = Number(producto.precioUnitario) || 0;
  //     const total = cantidad * precioUnitario;
  //     
  //     console.log('🔍 Cálculo:', { cantidad, precioUnitario, total });
  //     
  //     // Actualizar el total del producto
  //     form.setFieldValue(['productos', index, 'total'], total);
  //     
  //     // Calcular el total general
  //     const totalGeneral = productos.reduce((sum: number, prod: ProductRecord) => {
  //       return sum + (Number(prod.total) || 0);
  //     }, 0);
  //     
  //     console.log('🔍 Total general:', totalGeneral);
  //     
  //     // Actualizar el monto del proveedor
  //     form.setFieldValue('montoProveedor', totalGeneral);
  //   }
  // };

  const handleProviderModalClose = () => setOpenProvider(false);

  const handleProviderSelect = (data: ProviderProps) => form.setFieldValue('proveedor', data);

  const handlePaymentsChange = (pagos: PagoRecord[]) => form.setFieldValue('pagosProveedor', pagos);

  const handleTipoPagoChange = (tipo: string) => form.setFieldValue('tipoPago', tipo);

  const handleNotaPagoChange = (nota: string) => form.setFieldValue('notaPago', nota);

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
            onClickSearch={() => setOpenProvider(true)}
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
            }
            resumeContent={
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  const provider: null | ProviderProps = getFieldValue('proveedor');
                  return (
                    <Fragment>
                      <Typography variant="h5">
                        {isEditing && orderData?.codigoOp ? orderData.codigoOp : 'Nuevo OP'}
                      </Typography>
                      <Typography fontWeight={300} color={provider ? undefined : 'textSecondary'}>
                        {provider?.razonSocial ?? 'Seleccione un proveedor'}
                      </Typography>
                      <Typography fontWeight={300} color={provider ? undefined : 'textSecondary'}>
                        {provider ? `RUC: ${provider.ruc}` : 'Seleccione un proveedor'}
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
                  <DatePickerAntd label="Fecha de recepción" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaProgramada" rules={[requiredField]}>
                  <DatePickerAntd label="Fecha programada" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="fechaDespacho" rules={[requiredField]}>
                  <DatePickerAntd label="Fecha de despacho" />
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
                        <Form.Item name="contactoProveedor" rules={[requiredField]}>
                          <SelectContactsByProvider
                            providerId={provider?.id}
                            onChange={handleContactoChange}
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
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Código</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Descripción</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>U. Medida</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Cantidad</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Precio Unit.</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: 12, width: 80 }}>Acciones</TableCell>
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
                            <TableRow key={field.name} sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' } }}>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'codigo']} 
                                  rules={[{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input
                                    placeholder="Código"
                                    size="small"
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'descripcion']} 
                                  rules={[{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input
                                    placeholder="Descripción"
                                    size="small"
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'uMedida']} 
                                  rules={[{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <Input
                                    placeholder="UND"
                                    size="small"
                                    style={{
                                      borderRadius: 4,
                                      border: '1px solid #d9d9d9',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'cantidad']} 
                                  rules={[{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumber
                                    placeholder="0"
                                    size="small"
                                    min={0}
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                    }}
                                    onChange={() => {
                                      // Calcular total automáticamente
                                      setTimeout(() => {
                                        const productos = form.getFieldValue('productos') || [];
                                        const producto = productos[field.name];
                                        if (producto) {
                                          const cantidad = Number(producto.cantidad) || 0;
                                          const precioUnitario = Number(producto.precioUnitario) || 0;
                                          const total = cantidad * precioUnitario;
                                          form.setFieldValue(['productos', field.name, 'total'], total);
                                        }
                                      }, 100);
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'precioUnitario']} 
                                  rules={[{ required: true, message: 'Requerido' }]}
                                  style={{ margin: 0 }}
                                >
                                  <InputNumber
                                    placeholder="0.00"
                                    size="small"
                                    min={0}
                                    step={0.01}
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                    }}
                                    onChange={() => {
                                      // Calcular total automáticamente
                                      setTimeout(() => {
                                        const productos = form.getFieldValue('productos') || [];
                                        const producto = productos[field.name];
                                        if (producto) {
                                          const cantidad = Number(producto.cantidad) || 0;
                                          const precioUnitario = Number(producto.precioUnitario) || 0;
                                          const total = cantidad * precioUnitario;
                                          form.setFieldValue(['productos', field.name, 'total'], total);
                                        }
                                      }, 100);
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <Form.Item 
                                  name={[field.name, 'total']} 
                                  style={{ margin: 0 }}
                                >
                                  <InputNumber
                                    placeholder="0.00"
                                    size="small"
                                    readOnly
                                    style={{
                                      width: '100%',
                                      borderRadius: 4,
                                      backgroundColor: '#f5f5f5',
                                    }}
                                  />
                                </Form.Item>
                              </TableCell>
                              <TableCell sx={{ p: 1 }}>
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={() => remove(field.name)}
                                  sx={{ fontSize: 14 }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={5} sx={{ textAlign: 'right' }}>
                              <Button
                                onClick={() => add(getEmptyProductRecord())}
                                startIcon={<Add />}
                                variant="outlined"
                                size="small"
                                sx={{
                                  width: 'auto',
                                  py: 1,
                                  bgcolor: '#189dff',
                                  color: 'white',
                                  borderColor: '#1890ff'
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

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const productos = getFieldValue('productos') || [];
              const totalProductos = productos.reduce((sum: number, producto: ProductRecord) => {
                return sum + (Number(producto?.total) || 0);
              }, 0);

              return (
                <PaymentsList
                  title="Pagos Proveedor"
                  payments={getFieldValue('pagosProveedor') || []}
                  tipoPago={getFieldValue('tipoPago') || ''}
                  notaPago={getFieldValue('notaPago') || ''}
                  montoTotal={totalProductos}
                  mode="readonly"
                  onPaymentsChange={handlePaymentsChange}
                  onTipoPagoChange={handleTipoPagoChange}
                  onNotaPagoChange={handleNotaPagoChange}
                />
              );
            }}
          </Form.Item>        
          
          <TransportsSection form={form} />

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
