import { Fragment } from 'react';
import { Divider, Form, FormInstance } from 'antd';
import { Button, Collapse, FormHelperText, Grid, IconButton, Stack, Typography } from '@mui/material';
import SelectCompanies from '@/components/selects/SelectCompanies';
import { StepItemContent } from './smallcomponents';
import SelectClients from '@/components/selects/SelectClients';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import { Delete } from '@mui/icons-material';
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
      <Grid container spacing={2}>
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

      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => {
          const allow = getFieldValue('tipoVenta') === 'privada';

          const sumPayments = (getFieldValue('pagos') ?? []).reduce(
            (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
            0
          );

          return (
            <Collapse in={allow} unmountOnExit>
              <Divider>VENTA PRIVADA</Divider>

              <Grid container columnSpacing={2}>
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
                <Grid size={12}>
                  <Divider dashed>Pagos Recibidos</Divider>

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
                          <Stack key={field.name} direction="row" spacing={1}>
                            <Form.Item name={[field.name, 'date']} rules={[requiredField]} className="flex-2">
                              <DatePickerAntd label="Fecha" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'bank']} rules={[requiredField]} className="flex-2">
                              <InputAntd label="Banco" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'description']} rules={[requiredField]} className="flex-2">
                              <InputAntd label="Descripción" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'file']} rules={[requiredField]} className="flex-1">
                              <InputFile onChange={(file) => form.setFieldValue('file', file)} accept="pdf" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'amount']} rules={[requiredField]} className="flex-1">
                              <InputAntd label="Monto" type="number" />
                            </Form.Item>
                            <Form.Item name={[field.name, 'status']} rules={[requiredField]} className="flex-1">
                              <SelectGeneric label="Estado" options={statusOptions} />
                            </Form.Item>
                            <Form.Item>
                              <IconButton size="large" color="error" onClick={() => remove(field.name)}>
                                <Delete />
                              </IconButton>
                            </Form.Item>
                          </Stack>
                        ))}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Button
                            size="medium"
                            color={errors.length ? 'error' : 'warning'}
                            variant="outlined"
                            onClick={() => add(getEmptyPaymentRecord())}
                          >
                            AGREGAR PAGO
                          </Button>
                          {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                          <Typography variant="h5" pr={8} color={errors.length ? 'error' : 'primary'}>
                            {formatCurrency(sumPayments)}
                          </Typography>
                        </Stack>
                      </Fragment>
                    )}
                  </Form.List>
                </Grid>
              </Grid>
            </Collapse>
          );
        }}
      </Form.Item>
    </StepItemContent>
  );
};

export default InputsFirstStep;
