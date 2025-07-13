import { Fragment, useState, useEffect } from 'react';
import { Form, notification, Spin } from 'antd';
import { Business } from '@mui/icons-material';
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
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SelectCompanies from '@/components/selects/SelectCompanies';
import DatePickerAntd from '@/components/DatePickerAnt';
import { SaleProps } from '@/services/sales/sales';
import SelectContactsByProvider from '@/components/selects/SelectContactsByProvider';
import { createOrderProvider, updateOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { useNavigate } from 'react-router-dom';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import PaymentsList from '@/components/PaymentsList';
import ProductsTable from '@/components/ProductsTable';
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

const getEmptyProductRecord = () => ({
  codigo: '',
  descripcion: '',
  uMedida: '',
  cantidad: '',
  cAlmacen: '',
  cTotal: '',
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
  
  // Estado para la empresa seleccionada
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  // Monitorear cambios en el campo empresa
  const empresaValue = Form.useWatch('empresa', form);

  // Actualizar empresa seleccionada cuando cambia el valor
  useEffect(() => {
    if (empresaValue && companies.length > 0) {
      const company = companies.find(c => c.id === empresaValue);
      setSelectedCompany(company || null);
    } else {
      setSelectedCompany(null);
    }
  }, [empresaValue, companies]);

  // Inicializar formulario con datos existentes si está en modo edición
  useEffect(() => {
    if (isEditing && orderData) {
      form.setFieldsValue({
        empresa: 1, // Valor por defecto
        proveedor: orderData.proveedor,
        contactoProveedor: orderData.contactoProveedor,
        fechaDespacho: orderData.fechaDespacho ? dayjs(orderData.fechaDespacho) : null,
        fechaProgramada: orderData.fechaProgramada ? dayjs(orderData.fechaProgramada) : null,
        fechaRecepcion: orderData.fechaRecepcion ? dayjs(orderData.fechaRecepcion) : null,
        montoProveedor: orderData.totalProveedor,
        productosNota: orderData.notaPedido,
        // Campos de pago de la orden proveedor
        tipoPago: orderData.tipoPago || '',
        notaPago: orderData.notaPago || '',
        productos: orderData.productos?.map(producto => ({
          codigo: producto.codigo,
          descripcion: producto.descripcion,
          uMedida: producto.unidadMedida,
          cantidad: producto.cantidad,
          cAlmacen: producto.cantidadAlmacen,
          cTotal: producto.cantidadTotal,
          precioUnitario: producto.precioUnitario,
          total: producto.total,
        })) || [getEmptyProductRecord()],
        // Mapear pagos existentes del proveedor (si los hay)
        pagosProveedor: Array.isArray(orderData.pagos) && orderData.pagos.length > 0
          ? (orderData.pagos as any[]).map((pago: any) => ({
            date: pago.fechaPago ? dayjs(pago.fechaPago) : null,
            bank: pago.bancoPago || '',
            description: pago.descripcionPago || '',
            file: pago.archivoPago || null,
            amount: pago.montoPago || '',
            status: pago.estadoPago ? 'true' : 'false',
          }))
          : [],
        transportes: orderData.transportesAsignados?.map(transporte => ({
          transporte: transporte.transporte,
          contacto: transporte.contactoTransporte,
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
    }
  }, [isEditing, orderData, form]);

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      const productosArr = values.productos.map((item: Record<string, any>) => ({
        codigo: item.codigo,
        descripcion: item.descripcion,
        unidadMedida: item.uMedida,
        cantidad: Number(item.cantidad),
        cantidadAlmacen: Number(item.cAlmacen),
        cantidadTotal: Number(item.cTotal),
        precioUnitario: Number(item.precioUnitario),
        total: item.total,
      }));

      const transportesArr = values.transportes.map((item: Record<string, any>) => ({
        transporteId: typeof item.transporte === 'object' ? item.transporte?.id : item.transporte,
        contactoTransporteId: typeof item.contacto === 'object' ? item.contacto?.id : item.contacto,
        region: item.region || null,
        provincia: item.provincia || null,
        distrito: item.distrito || null,
        direccion: item.direccion || null,
        notaTransporte: item.nota || null,
        tipoDestino: item.destino === 'CLIENTE' ? 'CLIENTE' : 'ALMACEN',
        montoFlete: Number(item.flete) || null,
        cotizacionTransporte: item.cotizacion || null,
      }));

      const body = {
        // ✅ CORRECCIÓN: Agregar ordenCompraId al body
        ordenCompraId: sale.id,
        empresaId: sale.empresa.id,
        proveedorId: typeof values.proveedor === 'object' ? values.proveedor?.id : values.proveedor,
        contactoProveedorId: values.contactoProveedor,
        fechaProgramada: values.fechaProgramada?.toISOString(),
        fechaDespacho: values.fechaDespacho?.toISOString(),
        fechaRecepcion: values.fechaRecepcion?.toISOString(),
        fechaEntrega: values.fechaEntrega || null,
        totalProveedor: Number(values.montoProveedor) || 0,
        // Campos de pago de la orden proveedor
        tipoPago: values.tipoPago || null,
        notaPago: values.notaPago || null,
        // estadoOp: 'pendiente',
        // activo: true,
        productos: isEditing ? { deleteMany: {}, create: productosArr } : { create: productosArr },
        transportesAsignados: isEditing ? { deleteMany: {}, create: transportesArr } : { create: transportesArr },
      };

      if (isEditing && orderData) {
        await updateOrderProvider(orderData.id, body);
        notification.success({ message: 'La orden del proveedor se actualizó correctamente' });
      } else {
        // ✅ NOTA: Aquí se pasa sale.id como ordenCompraId en la URL y en el body para consistencia
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

  // const calculateProductSubTotal = (index: number) => {
  //   const record = form.getFieldValue(['productos', index]);
  //   const sum = parseInt(record.cTotal || '0', 10) * parseInt(record.precioUnitario || '0', 10);
  //   form.setFieldValue(['productos', index, 'total'], sum);
  // };

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={handleFinish}>
        <Form.Item name="proveedor" noStyle />

        <Stack direction="column" spacing={2}>
          {/* EMPRESA COMPRADORA */}
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
          {/* CONTACTO PROVEEDOR */}
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
              {/* Información del proveedor */}
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Form.Item shouldUpdate>
                    {({ getFieldValue }) => {
                      const provider: ProviderProps | null = getFieldValue('proveedor');
                      return (
                        <Form.Item name="contactoProveedor" rules={[requiredField]}>
                          <SelectContactsByProvider
                            providerId={provider?.id}
                            onChange={(value, record: any) => {
                              // Autocompletar campos de nombre y teléfono del contacto del proveedor
                              form.setFieldsValue({
                                contactoProveedor: value,
                                nombreContactoProveedor: record?.optiondata?.nombre,
                                telefonoContactoProveedor: record?.optiondata?.telefono,
                              });
                            }}
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
          {/* PRODUCTOS DE LA ORDEN */}{/* Nueva sección: Datos del Cliente, Responsable Recepción y Lugar de Entrega */}
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
          
          {/* Productos de la orden proveedor */}
          <ProductsTable
            form={form}
            fieldName="productos"
            title="PRODUCTOS DE LA ORDEN"
            showTitle={true}
            readOnly={false}
            showAddButton={true}
            showDeleteButton={true}
            showTotal={true}
            showNote={true}
            noteFieldName="productosNota"
            noteLabel="Nota del Pedido"
            showFields={{
              codigo: true,
              descripcion: true,
              uMedida: true,
              cantidad: true,
              cAlmacen: true,
              cTotal: true,
              precioUnitario: true,
              total: true
            }}
            required={false}
            minProducts={1}
            compact={false}
            headerColor="#8377a8"
          />
          
          {/* Sección de Pagos Proveedor */}
          <PaymentsList
            name="pagosProveedor"
            tipoPagoName="tipoPago"
            notaPagoName="notaPago"
            title="Pagos Proveedor"
            // mode="readonly"
            color="#006DFA"
            required={false}
            initialValue={[{
              date: null,
              bank: '',
              description: '',
              file: null,
              amount: '',
              status: 'false'
            }]}
          />          
          {/* Sección de Transportes */}
          <TransportsSection form={form} />

          <Stack alignItems="center" my={2}>
            <Button disabled={loading} type="submit">
              GUARDAR CAMBIOS
            </Button>
          </Stack>
        </Stack>
      </Form>

      {openProvider && <ProviderSelectorModal onClose={() => setOpenProvider(false)} onSelected={(data) => form.setFieldValue('proveedor', data)} />}
    </Spin>
  );
};

export default ProviderOrderFormContent;
