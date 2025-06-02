import { Fragment } from 'react';
import { Divider, Form, FormInstance } from 'antd';
import { Button, Collapse, FormHelperText, Grid, IconButton, Stack, Typography, Paper, Box, Alert } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import { StepItemContent } from './smallcomponents';
import SelectClients from '@/components/selects/SelectClients';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import { Delete, Add, Payment } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import DatePickerAntd from '@/components/DatePickerAnt';
import SelectContacts from '@/components/selects/SelectContacts';

interface InputsFirstStepProps {
  form: FormInstance;
}

export const requiredField = { required: true, message: 'Campo requerido' };

const saleTypeOptions = [
  { label: 'Venta Directa', value: 'directa' },
  { label: 'Venta Privada', value: 'privada' },
];

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Pagada', value: 'pagada' },
  { label: 'Cancelada', value: 'cancelada' },
  { label: 'Anulada', value: 'anulada' },
];

const statusOptions = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' },
];

const getEmptyPaymentRecord = () => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: 'activo',
});

const InputsFirstStep = ({ form }: InputsFirstStepProps) => {
  return (
    <StepItemContent title="EMPRESA Y TIPO DE VENTA" subtitle="Ingresa la información solicitada">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="empresaComplete" noStyle />
            <Form.Item name="empresa" rules={[requiredField]}>
              <SelectCompanies
                label="Empresa"
                onChange={(value, record: any) => form.setFieldsValue({ empresa: value, empresaComplete: record.optiondata })}
              />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="tipoVenta" rules={[requiredField]} initialValue="directa">
              <SelectGeneric label="Tipo de venta" options={saleTypeOptions} />
            </Form.Item>
          </Grid>
        </Grid>
      </Paper>

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const allow = getFieldValue('tipoVenta') === 'privada';

          const sumPayments = (getFieldValue('pagos') ?? []).reduce(
            (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
            0
          );

          return (            <Collapse in={allow} unmountOnExit>
              <Box sx={{ mt: 3 }}>
                <Alert 
                  icon={<Payment />}
                  severity="info" 
                  sx={{ 
                    mb: 3,
                    bgcolor: '#e3f2fd',
                    border: '1px solid #bbdefb',
                    '& .MuiAlert-icon': { color: '#006DFA' }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Venta Privada Seleccionada - Complete la información del cliente y los pagos recibidos
                  </Typography>
                </Alert>

                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    bgcolor: '#ffffff', 
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name="privateClientComplete" noStyle />
                      <Form.Item name="privateClient" rules={[requiredField]}>
                        <SelectClients
                          label="Cliente"
                          onChange={(value, record: any) => form.setFieldsValue({ privateClient: value, privateClientComplete: record.optiondata })}
                        />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name="privateContact" rules={[requiredField]}>
                        <SelectContacts label="Cargo contacto" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Form.Item name="facturaStatus" rules={[requiredField]}>
                        <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                      <Form.Item name="dateFactura" rules={[requiredField]}>
                        <DatePickerAntd label="Fecha factura" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                      <Form.Item name="documentoFactura" rules={[requiredField]}>
                        <InputFile onChange={(file) => form.setFieldValue('documentoFactura', file)} accept="pdf" />
                      </Form.Item>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3, 
                        color: '#111826',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Payment sx={{ color: '#006DFA' }} />
                      Pagos Recibidos
                    </Typography>

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
                          {fields.map((field, index) => (
                            <Paper
                              key={field.name}
                              elevation={0}
                              sx={{
                                p: 2,
                                mb: 2,
                                bgcolor: '#f8f9fa',
                                border: '1px solid #dee2e6',
                                borderRadius: 2
                              }}
                            >
                              <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Grid container spacing={2} sx={{ flex: 1 }}>
                                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Form.Item name={[field.name, 'date']} rules={[requiredField]}>
                                      <DatePickerAntd label="Fecha" />
                                    </Form.Item>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Form.Item name={[field.name, 'bank']} rules={[requiredField]}>
                                      <InputAntd label="Banco" />
                                    </Form.Item>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Form.Item name={[field.name, 'description']} rules={[requiredField]}>
                                      <InputAntd label="Descripción" />
                                    </Form.Item>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Form.Item name={[field.name, 'amount']} rules={[requiredField]}>
                                      <InputAntd label="Monto" type="number" />
                                    </Form.Item>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                    <Form.Item name={[field.name, 'status']} rules={[requiredField]}>
                                      <SelectGeneric label="Estado" options={statusOptions} />
                                    </Form.Item>
                                  </Grid>
                                  <Grid size={{ xs: 12, md: 1 }}>
                                    <Form.Item name={[field.name, 'file']} rules={[requiredField]}>
                                      <InputFile onChange={(file) => form.setFieldValue('file', file)} accept="pdf" />
                                    </Form.Item>
                                  </Grid>
                                </Grid>
                                {fields.length > 1 && (
                                  <IconButton 
                                    size="small" 
                                    color="error" 
                                    onClick={() => remove(field.name)}
                                    sx={{ mt: 1 }}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </Stack>
                            </Paper>
                          ))}
                          
                          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Button
                              size="medium"
                              variant="outlined"
                              startIcon={<Add />}
                              onClick={() => add(getEmptyPaymentRecord())}
                              sx={{
                                borderColor: '#006DFA',
                                color: '#006DFA',
                                '&:hover': {
                                  borderColor: '#111826',
                                  bgcolor: '#006DFA',
                                  color: 'white'
                                }
                              }}
                            >
                              AGREGAR PAGO
                            </Button>
                            {errors.length ? (
                              <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText>
                            ) : null}
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="textSecondary" display="block">
                                Total Pagos
                              </Typography>
                              <Typography variant="h5" color={errors.length ? 'error' : 'primary'} sx={{ fontWeight: 600 }}>
                                {formatCurrency(sumPayments)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Fragment>
                      )}
                    </Form.List>
                  </Box>
                </Paper>
              </Box>            </Collapse>
          );
        }}
      </Form.Item>
    </StepItemContent>
  );
};

export default InputsFirstStep;
