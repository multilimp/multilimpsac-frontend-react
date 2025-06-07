import { Fragment, useState } from 'react';
import { Form, FormInstance } from 'antd';
import { Button, FormHelperText, Grid, IconButton, Stack, Typography, Box } from '@mui/material';
import { StepItemContent } from './smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import { Delete, Add, Payment, Handshake } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';
import DatePickerAntd from '@/components/DatePickerAnt';
import SelectContacts from '@/components/selects/SelectContacts';
import ClientSelectorModal from '../../Clients/components/ClientSelectorModal';
import { ClientProps } from '@/services/clients/clients';

export const requiredField = { required: true, message: 'Campo requerido' };

const facturaStatusOptions = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
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

const InputsFirstStep = ({ form }: { form: FormInstance }) => {
  const [openClients, setOpenClients] = useState(false);

  return (
    <Stack direction="column" spacing={2}>
      <StepItemContent
        showHeader
        showFooter
        ResumeIcon={Handshake}
        color="info"
        onClickSearch={() => setOpenClients(true)}
        resumeContent={
          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const clientePrivate: null | ClientProps = getFieldValue('clientePrivate');
              return (
                <Fragment>
                  <Typography variant="h5">Venta Privada</Typography>
                  <Typography fontWeight={300} color={clientePrivate ? undefined : 'textSecondary'}>
                    {clientePrivate?.razonSocial ?? 'Seleccione a un cliente'}
                  </Typography>
                  <Typography fontWeight={300} color={clientePrivate ? undefined : 'textSecondary'}>
                    {clientePrivate ? `RUC: ${clientePrivate.ruc}` : 'Seleccione a un cliente'}
                  </Typography>
                </Fragment>
              );
            }}
          </Form.Item>
        }
      >
        <Form.Item name="clientePrivate" noStyle />

        <Grid container columnSpacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Form.Item name="privateContact" rules={[requiredField]}>
              <SelectContacts label="Cargo contacto" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Form.Item name="facturaStatus" rules={[requiredField]}>
              <SelectGeneric label="Estado de Factura" options={facturaStatusOptions} />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Form.Item name="dateFactura" rules={[requiredField]}>
              <DatePickerAntd label="Fecha factura" />
            </Form.Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Form.Item name="documentoFactura" rules={[requiredField]}>
              <InputFile onChange={(file) => form.setFieldValue('documentoFactura', file)} accept="pdf" label="Factura PDF" />
            </Form.Item>
          </Grid>
        </Grid>
      </StepItemContent>

      <StepItemContent>
        <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Payment />
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
              {fields.map((field) => (
                <Stack key={field.name} direction="row" spacing={2} alignItems="flex-start">
                  <Grid container columnSpacing={2} sx={{ flex: 1 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Form.Item name={[field.name, 'date']} rules={[requiredField]}>
                        <DatePickerAntd label="Fecha" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Form.Item name={[field.name, 'bank']} rules={[requiredField]}>
                        <InputAntd label="Banco" />
                      </Form.Item>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Form.Item name={[field.name, 'amount']} rules={[requiredField]}>
                        <InputAntd label="Monto" type="number" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Form.Item name={[field.name, 'status']} rules={[requiredField]}>
                        <SelectGeneric label="Estado" options={statusOptions} />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name={[field.name, 'description']} rules={[requiredField]}>
                        <InputAntd label="Descripción" />
                      </Form.Item>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Form.Item name={[field.name, 'file']} rules={[requiredField]}>
                        <InputFile onChange={(file) => form.setFieldValue('file', file)} accept="pdf" />
                      </Form.Item>
                    </Grid>
                  </Grid>
                  {fields.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => remove(field.name)} sx={{ mt: 1 }}>
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
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
                      color: 'white',
                    },
                  }}
                >
                  AGREGAR PAGO
                </Button>
                {errors.length ? <FormHelperText error>{(errors as Array<string>).join(' - ')}</FormHelperText> : null}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Total Pagos
                  </Typography>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const sumPayments = (getFieldValue('pagos') ?? []).reduce(
                        (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
                        0
                      );

                      return (
                        <Typography variant="h5" color={errors.length ? 'error' : 'primary'} sx={{ fontWeight: 600 }}>
                          {formatCurrency(sumPayments)}
                        </Typography>
                      );
                    }}
                  </Form.Item>
                </Box>
              </Stack>
            </Fragment>
          )}
        </Form.List>
      </StepItemContent>

      {openClients ? (
        <ClientSelectorModal onClose={() => setOpenClients(false)} onSelected={(data) => form.setFieldValue('clientePrivate', data)} />
      ) : null}
    </Stack>
  );
};

export default InputsFirstStep;
