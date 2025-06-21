import { Fragment, useState, useEffect } from 'react';
import { Form, Input, InputNumber, notification, Spin } from 'antd';
import { AddCircle, Business, Delete, LocalShipping, ShoppingCart, Person } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Button,
  FormHelperText,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from '@mui/material';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectTransports from '@/components/selects/SelectTransports';
import SelectCompanies from '@/components/selects/SelectCompanies';
import DatePickerAntd from '@/components/DatePickerAnt';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency } from '@/utils/functions';
import SelectContacts from '@/components/selects/SelectContacts';
import SelectContactsByProvider from '@/components/selects/SelectContactsByProvider';
import { createOrderProvider, updateOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { useNavigate } from 'react-router-dom';
import { StepItemContent } from '../../Sales/SalesPageForm/smallcomponents';
import PaymentsList from '@/components/PaymentsList';
import dayjs from 'dayjs';
import { ProviderProps } from '@/services/providers/providers';
import ProviderSelectorModal from '../../Providers/components/ProviderSelectorModal';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';

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

const getEmptyTransformRecord = () => ({
  transporte: null,
  destino: null,
  region: '',
  provincia: '',
  distrito: '',
  direccion: '',
  nota: '',
  flete: '',
  cotizacion: null,
});

const requiredField = { required: true, message: 'Requerido' };

const ProviderOrderFormContent = ({ sale, orderData, isEditing = false }: ProviderOrderFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openProvider, setOpenProvider] = useState(false);

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

  const calculateProductSubTotal = (index: number) => {
    const record = form.getFieldValue(['productos', index]);
    const sum = parseInt(record.cTotal || '0', 10) * parseInt(record.precioUnitario || '0', 10);
    form.setFieldValue(['productos', index, 'total'], sum);
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} onFinish={handleFinish}>
        <Form.Item name="proveedor" noStyle />

        <Stack direction="column" spacing={2}>
          {/* Select de empresa compradora */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Form.Item name="empresa" rules={[requiredField]}>
                <SelectCompanies label="Empresa compradora" />
              </Form.Item>
            </Grid>
          </Grid>

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
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="montoProveedor" rules={[requiredField]}>
                  <InputNumber
                    min={0}
                    step={0.01}
                    placeholder="Monto del proveedor"
                    style={{ width: '100%' }}
                    prefix="S/ "
                  />
                </Form.Item>
              </Grid>
              <Grid size={12}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const provider: ProviderProps | null = getFieldValue('proveedor');
                    return (
                      <Form.Item name="contactoProveedor" rules={[requiredField]}>
                        <SelectContactsByProvider
                          providerId={provider?.id}
                          onContactCreated={() => {
                            // Recargar contactos si es necesario
                          }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Grid>
              {/* Nueva sección: Datos del Cliente, Responsable Recepción y Lugar de Entrega */}
              <Grid size={12}>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                  <Box flex={1}>
                    <Typography textTransform="uppercase" fontSize={10} color="#9932CC" fontWeight={600} textAlign="center" mb={1}>
                      Datos del cliente
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} fontWeight={700}>
                      {sale?.cliente?.razonSocial ?? '---'}
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} color="textSecondary">
                      RUC: {sale?.cliente?.ruc ?? '---'}
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} color="textSecondary">
                      CUE: {sale?.cliente?.codigoUnidadEjecutora ?? '---'}
                    </Typography>
                  </Box>
                  <Box>
                    <Divider orientation="vertical" />
                  </Box>
                  <Box flex={1}>
                    <Typography textTransform="uppercase" fontSize={10} color="#9932CC" fontWeight={600} textAlign="center" mb={1}>
                      Responsable recepción
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} fontWeight={700}>
                      {sale?.contactoCliente?.cargo ?? '---'}
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} color="textSecondary">
                      {sale?.contactoCliente?.nombre ?? '---'} <br />
                      {sale?.contactoCliente?.telefono ?? '---'} - {sale?.contactoCliente?.email ?? '---'}
                    </Typography>
                  </Box>
                  <Box>
                    <Divider orientation="vertical" />
                  </Box>
                  <Box flex={1}>
                    <Typography textTransform="uppercase" fontSize={10} color="#9932CC" fontWeight={600} textAlign="center" mb={1}>
                      Lugar de entrega
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} fontWeight={700}>
                      {sale?.direccionEntrega ?? '---'}
                    </Typography>
                    <Typography textTransform="uppercase" fontSize={10} color="textSecondary">
                      {sale?.departamentoEntrega ?? '---'} - {sale?.provinciaEntrega ?? '---'} - {sale?.distritoEntrega ?? '---'} <br />
                      Ref: {sale?.referenciaEntrega ?? '---'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </StepItemContent>

          <StepItemContent>
            <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
              <ShoppingCart />
              PRODUCTOS
            </Typography>

            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'red !important' }}>
                  <TableRow sx={{ bgcolor: 'red !important' }}>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>COD.</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>Descripción</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>U.Medida</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>Cantidad</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>C.Almacen</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>C.Total</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>Precio U.</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}>Total</TableCell>
                    <TableCell sx={{ p: 0, fontSize: 12 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Form.List
                    name="productos"
                    initialValue={[getEmptyProductRecord()]}
                    rules={[
                      {
                        validator(_, arr) {
                          if (!arr.length) {
                            return Promise.reject(new Error('Debe ingresar por lo menos 1 producto para continuar.'));
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <Fragment>
                        {fields.map((field) => (
                          <TableRow key={field.name} sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'codigo']} rules={[requiredField]}>
                                <Input size="middle" style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }} />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={[requiredField]}>
                                <Input size="middle" style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }} />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'uMedida']} rules={[requiredField]}>
                                <Input size="middle" style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }} />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'cantidad']} rules={[requiredField]}>
                                <InputNumber size="middle" min={0} style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }} />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'cAlmacen']} rules={[requiredField]}>
                                <InputNumber size="middle" min={0} style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }} />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'cTotal']} rules={[requiredField]}>
                                <InputNumber
                                  size="middle"
                                  min={0}
                                  style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'precioUnitario']} rules={[requiredField]}>
                                <InputNumber
                                  size="middle"
                                  min={0}
                                  style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }}
                                  onChange={() => calculateProductSubTotal(field.name)}
                                />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <Form.Item className="m-0" name={[field.name, 'total']}>
                                <InputNumber
                                  size="middle"
                                  min={0}
                                  style={{ width: '100%', borderRadius: 0, borderColor: '#9932CC90' }}
                                  readOnly
                                  disabled
                                />
                              </Form.Item>
                            </TableCell>
                            <TableCell sx={{ p: 0.25 }}>
                              <IconButton size="small" color="error" onClick={() => remove(field.name)}>
                                <Delete fontSize="medium" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                          <TableCell colSpan={2}>
                            {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                          </TableCell>
                          <TableCell colSpan={3} sx={{ p: 0.25 }}>
                            <Button fullWidth size="small" onClick={() => add(getEmptyProductRecord())} sx={{ borderRadius: 0.75 }}>
                              AÑADIR PRODUCTOS
                            </Button>
                          </TableCell>
                          <TableCell sx={{ p: 0 }} align="right" colSpan={3}>
                            <Form.Item noStyle shouldUpdate>
                              {() => {
                                const arr = form.getFieldValue('productos');
                                const sum: number = arr.reduce(
                                  (acum: number, next: Record<string, string>) => (acum += parseInt(next.total || '0', 10)),
                                  0
                                );
                                return (
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    bgcolor="secondary.main"
                                    color="#fff"
                                    px={1}
                                    py={0.8}
                                    borderRadius={0.5}
                                  >
                                    <Typography component="span" variant="body2" children="Pago Total" />
                                    <Typography component="span" variant="body2" children={formatCurrency(sum)} />
                                  </Stack>
                                );
                              }}
                            </Form.Item>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </Fragment>
                    )}
                  </Form.List>
                </TableBody>
              </Table>
            </TableContainer>
            <Form.Item name="productosNota" rules={[requiredField]}>
              <InputAntd label="Nota" type="textarea" size="large" />
            </Form.Item>
          </StepItemContent>

          {/* Sección de Pagos Proveedor */}
          <PaymentsList
            name="pagosProveedor"
            title="Pagos Proveedor"
            readonly={true}
            color="#9932CC"
            borderColor="#9932CC"
            buttonColor="#9932CC"
            required={false}
            initialValue={[]}
          />

          <Form.List
            name="transportes"
            initialValue={[getEmptyTransformRecord()]}
            rules={[
              {
                validator(_, arr) {
                  if (!arr.length) {
                    return Promise.reject(new Error('Debe ingresar por lo menos 1 transporte para continuar.'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <StepItemContent
                showHeader
                ResumeIcon={LocalShipping}
                ResumeSearchIcon={AddCircle}
                color="#a87bc7"
                onClickSearch={() => add(getEmptyTransformRecord())}
                resumeContent={
                  <Stack height="100%" justifyContent="center">
                    <Typography variant="h5">TRANSPORTE</Typography>
                    {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                  </Stack>
                }
              >
                <Stack direction="column" spacing={2}>
                  {fields.map((field) => (
                    <Card key={field.name} sx={{ borderRadius: 0 , paddingX: 0}}>
                      <CardHeader
                        title={`TRANSPORTE N° ${field.name + 1}`}
                        sx={{ py: 1.5, bgcolor: '#a87bc7' }}
                        action={
                          <IconButton color="error" onClick={() => remove(field.name)} sx={{ border: '1px solid #fff', borderRadius: 1 }}>
                            <Delete sx={{ color: '#fff' }} />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <Grid container spacing={2}>
                          {/* Primera fila: Empresa de Transporte y Dirección */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'transporte']} rules={[requiredField]}>
                              <SelectTransports label="Empresa de Transporte" />
                            </Form.Item>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'direccion']} rules={[requiredField]}>
                              <InputAntd label="Dirección" size="large" />
                            </Form.Item>
                          </Grid>

                          {/* Segunda fila: Contacto y Destino */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'contacto']} rules={[requiredField]}>
                              <SelectContacts label="Contacto transporte" />
                            </Form.Item>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'destino']} rules={[requiredField]}>
                              <SelectGeneric label="Destino" options={['CLIENTE', 'ALMACEN'].map((value) => ({ value, label: value }))} />
                            </Form.Item>
                          </Grid>

                          {/* Tercera fila: Ubicación como inputs de texto (no obligatorios) */}
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Form.Item name={[field.name, 'region']}>
                              <InputAntd label="Departamento" size="large" />
                            </Form.Item>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Form.Item name={[field.name, 'provincia']}>
                              <InputAntd label="Provincia" size="large" />
                            </Form.Item>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <Form.Item name={[field.name, 'distrito']}>
                              <InputAntd label="Distrito" size="large" />
                            </Form.Item>
                          </Grid>

                          {/* Cuarta fila: Subir Cotización y Flete Cotizado */}
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'cotizacion']} rules={[requiredField]}>
                              <InputFile label="Adjuntar la cotización" accept="pdf" />
                            </Form.Item>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Form.Item name={[field.name, 'flete']} rules={[requiredField]}>
                              <InputNumber
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                style={{ width: '100%' }}
                                prefix="S/ "
                              />
                            </Form.Item>
                          </Grid>

                          {/* Quinta fila: Nota */}
                          <Grid size={12}>
                            <Form.Item name={[field.name, 'nota']} rules={[requiredField]}>
                              <InputAntd label="Nota" type="textarea" size="large" />
                            </Form.Item>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </StepItemContent>
            )}
          </Form.List>

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
