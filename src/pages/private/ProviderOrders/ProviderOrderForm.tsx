import { Fragment } from 'react';
import DatePickerAntd from '@/components/DatePickerAnt';
import SelectProviders from '@/components/selects/SelectProviders';
import { Delete, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DatePicker, Form, Input } from 'antd';
import InputAntd from '@/components/InputAntd';
import InputFile from '@/components/InputFile';
import SelectGeneric from '@/components/selects/SelectGeneric';
import SelectTransports from '@/components/selects/SelectTransports';

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

const getEmptyPaymentRecord = () => ({
  fecha: null,
  banco: '',
  descripcion: '',
  evidencia: null,
  monto: '',
});

const getEmptyTransformRecord = () => ({
  transport: null,
  destino: null,
  flete: '',
  cotizacion: null,
});

const ProviderOrderForm = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, string>) => {
    console.log(values);
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <Box sx={{ width: { sm: '100%', md: 300 } }} position="relative">
        <Card sx={{ position: 'sticky', top: 80 }}>
          <CardHeader title="Órden de compra OCGRU660" subheader="Fecha: 20/10/2025" slotProps={{ title: { fontWeight: 700, fontSize: 20 } }} />
          <Divider />
          <CardContent sx={{ pt: 0, pb: 0 }}>
            <List dense>
              <ListItem divider>
                <ListItemText primary="Fecha máxima" secondary="Jan 9, 2014" />
              </ListItem>
              <ListItem divider>
                <ListItemText primary="OP Importe Total" secondary="S/ 20580.34" />
              </ListItem>
              <ListItem>
                <ListItemText primary="OC Importe Total" secondary="S/ 20580.34" />
              </ListItem>
            </List>
          </CardContent>
          <Divider />

          {['Datos generales', 'Documentos', 'Cliente', 'Entrega', 'Productos'].map((text) => (
            <Accordion key={text}>
              <AccordionSummary expandIcon={<ExpandMore />}>{text}</AccordionSummary>
              <AccordionDetails>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
              </AccordionDetails>
            </Accordion>
          ))}
        </Card>
      </Box>

      <Box flex={1}>
        <Form form={form} onFinish={(values: any) => handleFinish(values)}>
          <Stack spacing={1}>
            <Card>
              <CardHeader title="Datos Generales" slotProps={{ title: { fontWeight: 700 } }} />
              <CardContent sx={{ py: '0 !important' }}>
                <Grid container columnSpacing={2}>
                  <Grid size={12}>
                    <Form.Item name="proveedorComplete" noStyle />
                    <Form.Item name="proveedor" rules={[{ required: true, message: 'El proveedor es requerido' }]}>
                      <SelectProviders label="Proveedor" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                    <Form.Item name="fechaRecepcion" rules={[{ required: true, message: 'La fecha de recepción es requerida' }]}>
                      <DatePickerAntd label="Fecha de recepción" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }}>
                    <Form.Item name="fechaProgramacion" rules={[{ required: true, message: 'La fecha de programación es requerida' }]}>
                      <DatePickerAntd label="Fecha de programación" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                    <Form.Item name="fechaDespacho" rules={[{ required: true, message: 'La fecha de despacho es requerida' }]}>
                      <DatePickerAntd label="Fecha de despacho" />
                    </Form.Item>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Productos" slotProps={{ title: { fontWeight: 700 } }} />
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
                                  <Form.Item className="m-0" name={[field.name, 'codigo']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'uMedida']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'cantidad']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'cAlmacen']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'cTotal']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'precioUnitario']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'total']}>
                                    <Input size="large" style={{ width: '100%' }} readOnly disabled />
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
                              <TableCell sx={{ p: 0.25 }}>
                                <Form.Item className="m-0" name="productosTotal">
                                  <Input size="large" style={{ width: '100%' }} readOnly disabled />
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
                <Form.Item name="productosNota" rules={[{ required: true, message: 'La nota es requerida' }]}>
                  <InputAntd label="Nota" type="textarea" size="large" />
                </Form.Item>
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Pagos Recibidos"
                slotProps={{ title: { fontWeight: 700 } }}
                action={
                  <Form.Item className="m-0" name="pagosOpcion" rules={[{ required: true, message: 'Requerido' }]}>
                    <SelectGeneric
                      label="Opción de pago"
                      size="small"
                      style={{ width: 200 }}
                      options={['urgente', 'pendiente', 'realizado'].map((value) => ({ value, label: value.toUpperCase() }))}
                    />
                  </Form.Item>
                }
              />
              <CardContent sx={{ py: '0 !important' }}>
                <TableContainer sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ p: 0.25 }}>Fecha</TableCell>
                        <TableCell sx={{ p: 0.25 }}>Banco</TableCell>
                        <TableCell sx={{ p: 0.25 }}>Descripción</TableCell>
                        <TableCell sx={{ p: 0.25 }}>Evidencia</TableCell>
                        <TableCell sx={{ p: 0.25 }}>Monto</TableCell>
                        <TableCell sx={{ p: 0.25 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <Form.List
                        name="pagos"
                        initialValue={[getEmptyPaymentRecord()]}
                        rules={[
                          {
                            validator(_, arr) {
                              if (!arr.length) {
                                return Promise.reject(new Error('Debe ingresar por lo menos 1 pago para continuar.'));
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
                                  <Form.Item className="m-0" name={[field.name, 'fecha']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <DatePicker
                                      size="large"
                                      style={{ width: '100%' }}
                                      format="DD/MM/YYYY"
                                      variant="outlined"
                                      allowClear
                                      showNow={false}
                                      placeholder=""
                                    />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'banco']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'descripcion']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'evidencia']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <InputFile
                                      label="Adjuntar"
                                      accept="pdf"
                                      onChange={(file) => {
                                        console.log(file);
                                      }}
                                    />
                                  </Form.Item>
                                </TableCell>
                                <TableCell sx={{ p: 0.25 }}>
                                  <Form.Item className="m-0" name={[field.name, 'monto']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <Input size="large" style={{ width: '100%' }} />
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
                              <TableCell colSpan={2} sx={{ p: 0.25 }}>
                                <Button fullWidth size="medium" variant="outlined" onClick={() => add(getEmptyPaymentRecord())}>
                                  AÑADIR PAGO
                                </Button>
                              </TableCell>
                              <TableCell sx={{ p: 0.25 }}>
                                <Form.Item className="m-0" name="pagosTotal">
                                  <Input size="large" style={{ width: '100%' }} readOnly disabled />
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
                <Form.Item name="pagosNota" rules={[{ required: true, message: 'La nota es requerida' }]}>
                  <InputAntd label="Nota de pago" type="textarea" size="large" />
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
                    title="Transportes asignados"
                    subheader={errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : undefined}
                    slotProps={{ title: { fontWeight: 700 } }}
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
                            sx={{ pb: 0 }}
                            action={
                              <IconButton color="error" onClick={() => remove(field.name)}>
                                <Delete />
                              </IconButton>
                            }
                            title={
                              <Grid container columnSpacing={2}>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                  <Form.Item name={[field.name, 'transport']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <SelectTransports label="Transporte" />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                  <Form.Item name={[field.name, 'destino']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <SelectGeneric
                                      label="Destino"
                                      options={['cliente', 'almacen'].map((value) => ({ value, label: value.toUpperCase() }))}
                                    />
                                  </Form.Item>
                                </Grid>
                                <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                                  <Form.Item name={[field.name, 'flete']} rules={[{ required: true, message: 'Requerido' }]}>
                                    <InputAntd type="number" min={0} label="Flete cotizado" />
                                  </Form.Item>
                                </Grid>
                              </Grid>
                            }
                          />
                          <CardContent sx={{ py: '0 !important' }}>
                            <Form.Item name={[field.name, 'cotizacion']} rules={[{ required: true, message: 'Requerido' }]}>
                              <InputFile
                                label="Adjuntar la cotización"
                                accept="pdf"
                                onChange={(file) => {
                                  console.log(file);
                                }}
                              />
                            </Form.Item>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Form.List>

            <Stack alignItems="center" my={2}>
              <Button type="submit">GUARDAR CAMBIOS</Button>
            </Stack>
          </Stack>
        </Form>
      </Box>
    </Stack>
  );
};

export default ProviderOrderForm;
