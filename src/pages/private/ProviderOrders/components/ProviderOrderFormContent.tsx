import { Fragment, useState } from 'react';
import { Form, Input, InputNumber, notification, Spin } from 'antd';
import { Delete } from '@mui/icons-material';
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
} from '@mui/material';
import PurchaseOrderCard from '@/components/PurchaseOrderCard';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectTransports from '@/components/selects/SelectTransports';
import DatePickerAntd from '@/components/DatePickerAnt';
import SelectProviders from '@/components/selects/SelectProviders';
import { SaleProps } from '@/services/sales/sales';
import { formatCurrency } from '@/utils/functions';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import SelectContacts from '@/components/selects/SelectContacts';
import { createOrderProvider } from '@/services/providerOrders/providerOrders.requests';
import { useNavigate } from 'react-router-dom';

interface ProviderOrderFormContentProps {
  sale: SaleProps;
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
  flete: '',
  cotizacion: null,
});

const COLUMN_WIDTH = 350;

const requiredField = { required: true, message: 'Requerido' };

const ProviderOrderFormContent = ({ sale }: ProviderOrderFormContentProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      const productosArr = values.productos.map((item: Record<string, string>) => ({
        codigo: item.codigo,
        descripcion: item.descripcion,
        unidadMedida: item.uMedida,
        cantidad: Number(item.cantidad),
        cantidadAlmacen: Number(item.cAlmacen),
        cantidadTotal: Number(item.cTotal),
        precioUnitario: Number(item.precioUnitario),
        total: item.total,
      }));

      const transportesArr = values.transportes.map((item: Record<string, string>) => ({
        transporteId: item.transporte,
        contactoTransporteId: item.contacto,
        region: item.region,
        provincia: item.provincia,
        distrito: item.destino,
        direccion: item.direccion,
        notaTransporte: item.nota,
        cotizacionTransporte: item.cotizacion,
        tipoDestino: item.destino,
      }));

      const body = {
        proveedor: {
          connect: {
            id: values.proveedor,
          },
        },
        contactoProveedor: {
          connect: {
            id: values.contactoProveedor,
          },
        },
        fechaDespacho: values.fechaDespacho.toISOString(),
        fechaProgramada: values.fechaProgramada.toISOString(),
        fechaRecepcion: values.fechaRecepcion.toISOString(),
        notaPedido: values.productosNota,
        // totalProveedor: '2000',
        // notaPago: 'nota',
        // tipoPago: 'tipo',
        // estadoOp: 'pendiente',
        // activo: true,
        productos: { create: productosArr },
        transportesAsignados: { create: transportesArr },
      };

      await createOrderProvider(sale.id, body);

      notification.success({ message: 'La órden del proveedor se registró correctamente' });

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
    <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
      <Box width={{ xs: '100%', lg: COLUMN_WIDTH }}>
        <PurchaseOrderCard />
      </Box>

      <Box width={{ xs: '100%', lg: `calc((100%) - ${COLUMN_WIDTH}px)` }}>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleFinish}>
            <Stack spacing={1}>
              <Card>
                <CardHeader title="DATOS GENERALES" slotProps={{ title: { fontWeight: 700, fontSize: 16 } }} />
                <CardContent sx={{ py: '0 !important' }}>
                  <Grid container columnSpacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name="proveedor" rules={[requiredField]}>
                        <SelectProviders label="Proveedor" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name="contactoProveedor" rules={[requiredField]}>
                        <SelectContacts label="Transporte contacto" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                      <Form.Item name="fechaRecepcion" rules={[requiredField]}>
                        <DatePickerAntd label="Fecha de recepción" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                      <Form.Item name="fechaProgramada" rules={[requiredField]}>
                        <DatePickerAntd label="Fecha programada" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                      <Form.Item name="fechaDespacho" rules={[requiredField]}>
                        <DatePickerAntd label="Fecha de despacho" />
                      </Form.Item>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="PRODUCTOS" slotProps={{ title: { fontWeight: 700, fontSize: 16 } }} />
                <CardContent sx={{ py: '0 !important' }}>
                  <TableContainer sx={{ mb: 3 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ p: 0.25 }}>Código</TableCell>
                          <TableCell sx={{ p: 0.25 }}>Descripción</TableCell>
                          <TableCell sx={{ p: 0.25 }}>U.Medida</TableCell>
                          <TableCell sx={{ p: 0.25 }}>Cantidad</TableCell>
                          <TableCell sx={{ p: 0.25 }}>C.Almacen</TableCell>
                          <TableCell sx={{ p: 0.25 }}>C.Total</TableCell>
                          <TableCell sx={{ p: 0.25 }}>Precio.U.</TableCell>
                          <TableCell sx={{ p: 0.25 }}>Total</TableCell>
                          <TableCell sx={{ p: 0.25 }}></TableCell>
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
                                      <Input size="large" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={[requiredField]}>
                                      <Input size="large" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'uMedida']} rules={[requiredField]}>
                                      <Input size="large" style={{ width: '100%' }} />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'cantidad']} rules={[requiredField]}>
                                      <InputNumber size="large" min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'cAlmacen']} rules={[requiredField]}>
                                      <InputNumber size="large" min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'cTotal']} rules={[requiredField]}>
                                      <InputNumber
                                        size="large"
                                        min={0}
                                        style={{ width: '100%' }}
                                        onChange={() => calculateProductSubTotal(field.name)}
                                      />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'precioUnitario']} rules={[requiredField]}>
                                      <InputNumber
                                        size="large"
                                        min={0}
                                        style={{ width: '100%' }}
                                        onChange={() => calculateProductSubTotal(field.name)}
                                      />
                                    </Form.Item>
                                  </TableCell>
                                  <TableCell sx={{ p: 0.25 }}>
                                    <Form.Item className="m-0" name={[field.name, 'total']}>
                                      <InputNumber size="large" min={0} style={{ width: '100%' }} readOnly disabled />
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
                                <TableCell colSpan={4}>
                                  {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                                </TableCell>
                                <TableCell colSpan={3} sx={{ p: 0.25 }}>
                                  <Button fullWidth size="medium" variant="outlined" onClick={() => add(getEmptyProductRecord())}>
                                    AÑADIR PRODUCTOS
                                  </Button>
                                </TableCell>
                                <TableCell sx={{ p: 0 }} align="right">
                                  <Form.Item noStyle shouldUpdate>
                                    {() => {
                                      const arr = form.getFieldValue('productos');
                                      const sum: number = arr.reduce(
                                        (acum: number, next: Record<string, string>) => (acum += parseInt(next.total || '0', 10)),
                                        0
                                      );
                                      return <Typography variant="body2">{formatCurrency(sum)}</Typography>;
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
                </CardContent>
              </Card>

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
                  <Card>
                    <CardHeader
                      title="TRANSPORTES ASIGNADOS"
                      subheader={errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : undefined}
                      slotProps={{ title: { fontWeight: 700, fontSize: 16 } }}
                      action={
                        <Button color="secondary" onClick={() => add(getEmptyTransformRecord())}>
                          Agregar
                        </Button>
                      }
                    />
                    <CardContent>
                      <Stack direction="column" spacing={2}>
                        {fields.map((field) => (
                          <Card key={field.name} variant="outlined">
                            <CardHeader
                              title={`TRANSPORTE N° ${field.name + 1}`}
                              action={
                                <IconButton color="error" onClick={() => remove(field.name)}>
                                  <Delete />
                                </IconButton>
                              }
                            />
                            <CardContent sx={{ py: '0 !important' }}>
                              <Grid container columnSpacing={2}>
                                <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                  <Form.Item name={[field.name, 'transporte']} rules={[requiredField]}>
                                    <SelectTransports label="Transporte" />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                  <Form.Item name={[field.name, 'contacto']} rules={[requiredField]}>
                                    <SelectContacts label="Transporte contacto" />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                  <Form.Item name={[field.name, 'destino']} rules={[requiredField]}>
                                    <SelectGeneric label="Destino" options={['CLIENTE', 'ALMACEN'].map((value) => ({ value, label: value }))} />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 6, xl: 3 }}>
                                  <Form.Item name={[field.name, 'cotizacion']} rules={[requiredField]}>
                                    <InputFile label="Adjuntar la cotización" accept="pdf" />
                                  </Form.Item>
                                </Grid>

                                {/* asdasd */}

                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Form.Item name={[field.name, 'regionComplete']} noStyle />
                                  <Form.Item name={[field.name, 'region']} rules={[requiredField]}>
                                    <SelectRegions
                                      label="Departamento"
                                      onChange={(value, record: any) => {
                                        form.setFieldValue([field.name, 'region'], value);
                                        form.setFieldValue([field.name, 'regionComplete'], record?.optiondata);
                                        form.setFieldValue([field.name, 'provincia'], null);
                                        form.setFieldValue([field.name, 'provinciaComplete'], null);
                                        form.setFieldValue([field.name, 'distrito'], null);
                                        form.setFieldValue([field.name, 'distritoComplete'], null);
                                      }}
                                    />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Form.Item name={[field.name, 'provinciaComplete']} noStyle />
                                  <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue, setFieldValue }) => (
                                      <Form.Item name={[field.name, 'provincia']} rules={[requiredField]}>
                                        <SelectProvinces
                                          label="Provincia"
                                          regionId={getFieldValue([field.name, 'region'])}
                                          onChange={(value, record: any) => {
                                            setFieldValue([field.name, 'provincia'], value);
                                            setFieldValue([field.name, 'provinciaComplete'], record?.optiondata);
                                            setFieldValue([field.name, 'distrito'], null);
                                            setFieldValue([field.name, 'distritoComplete'], null);
                                          }}
                                        />
                                      </Form.Item>
                                    )}
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                  <Form.Item name={[field.name, 'distritoComplete']} noStyle />
                                  <Form.Item noStyle shouldUpdate>
                                    {({ getFieldValue, setFieldValue }) => (
                                      <Form.Item name={[field.name, 'distrito']} rules={[requiredField]}>
                                        <SelectDistricts
                                          label="Distrito"
                                          provinceId={getFieldValue([field.name, 'provincia'])}
                                          onChange={(value, record: any) => {
                                            setFieldValue([field.name, 'distrito'], value);
                                            setFieldValue([field.name, 'distritoComplete'], record?.optiondata);
                                          }}
                                        />
                                      </Form.Item>
                                    )}
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                                  <Form.Item name={[field.name, 'direccion']} rules={[requiredField]}>
                                    <InputAntd label="Dirección" size="large" />
                                  </Form.Item>
                                </Grid>

                                {/* asdasd */}

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
                    </CardContent>
                  </Card>
                )}
              </Form.List>

              <Stack alignItems="center" my={2}>
                <Button disabled={loading} type="submit">
                  GUARDAR CAMBIOS
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Spin>
      </Box>
    </Stack>
  );
};

export default ProviderOrderFormContent;
