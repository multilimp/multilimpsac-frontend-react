import { Fragment } from 'react';
import { Form } from 'antd';
import { Button, FormHelperText, Grid, IconButton, Stack, Typography, Box } from '@mui/material';
import { Delete, Add, Payment } from '@mui/icons-material';
import { StepItemContent } from '@/pages/private/Sales/SalesPageForm/smallcomponents';
import SelectGeneric from '@/components/selects/SelectGeneric';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import { formatCurrency } from '@/utils/functions';

interface PaymentsListProps {
  name: string;
  title?: string;
  readonly?: boolean;
  color?: string;
  borderColor?: string;
  buttonColor?: string;
  required?: boolean;
  initialValue?: any[];
}

const requiredField = { required: true, message: 'Campo requerido' };

const statusOptions = [
  { label: 'Activo', value: 'activo' },
  { label: 'Inactivo', value: 'inactivo' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Procesado', value: 'procesado' },
];

const getEmptyPaymentRecord = () => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: 'activo',
});

const PaymentsList: React.FC<PaymentsListProps> = ({
  name,
  title = 'Pagos',
  readonly = false,
  color = '#006DFA',
  borderColor = '#006DFA',
  buttonColor = '#006DFA',
  required = false,
  initialValue = [getEmptyPaymentRecord()],
}) => {
  const validationRules = required
    ? [
        {
          validator(_: any, arr: any[]) {
            if (!arr.length) {
              return Promise.reject(new Error('Debe ingresar por lo menos 1 pago para continuar.'));
            }
            return Promise.resolve();
          },
        },
      ]
    : [];

  if (readonly) {
    return (
      <StepItemContent>
        <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
          <Payment />
          {title}
        </Typography>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const payments = getFieldValue(name) || [];
            
            if (payments.length === 0) {
              return (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f5f5f5', borderRadius: 1, border: '2px dashed #ccc' }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay pagos registrados
                  </Typography>
                </Box>
              );
            }

            return (
              <Stack spacing={2}>
                {payments.map((payment: any, index: number) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      border: '1px solid #eee', 
                      p: 2, 
                      borderRadius: '4px',
                      bgcolor: '#fafafa'
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
                      Pago N° {index + 1}
                    </Typography>
                    <Grid container columnSpacing={2} rowSpacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="body2" color="text.secondary">Fecha</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.date ? new Date(payment.date).toLocaleDateString() : '---'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="body2" color="text.secondary">Banco</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.bank || '---'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="body2" color="text.secondary">Monto</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.amount ? formatCurrency(parseFloat(payment.amount)) : '---'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="body2" color="text.secondary">Estado</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.status || '---'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">Descripción</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.description || '---'}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="body2" color="text.secondary">Comprobante</Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {payment.file ? 'Archivo adjunto' : 'Sin archivo'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Total Pagos
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color }}>
                    {formatCurrency(
                      payments.reduce(
                        (acum: number, next: { amount: string }) => 
                          acum + (next.amount ? parseFloat(next.amount) : 0), 
                        0
                      )
                    )}
                  </Typography>
                </Box>
              </Stack>
            );
          }}
        </Form.Item>
      </StepItemContent>
    );
  }

  return (
    <StepItemContent>
      <Typography variant="h5" fontWeight={700} component={Stack} direction="row" alignItems="flex-end" spacing={1} mb={2}>
        <Payment />
        {title}
      </Typography>

      <Form.List name={name} initialValue={initialValue} rules={validationRules}>
        {(fields, { add, remove }, { errors }) => (
          <Fragment>
            {fields.map((field) => (
              <Stack key={field.name} direction="row" spacing={2} alignItems="flex-start">
                <Grid container columnSpacing={2} sx={{ flex: 1 }}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Form.Item name={[field.name, 'date']} rules={required ? [requiredField] : []}>
                      <DatePickerAntd label="Fecha" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Form.Item name={[field.name, 'bank']} rules={required ? [requiredField] : []}>
                      <InputAntd label="Banco" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Form.Item name={[field.name, 'amount']} rules={required ? [requiredField] : []}>
                      <InputAntd label="Monto" type="number" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Form.Item name={[field.name, 'status']} rules={required ? [requiredField] : []}>
                      <SelectGeneric label="Estado" options={statusOptions} />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Form.Item name={[field.name, 'description']} rules={required ? [requiredField] : []}>
                      <InputAntd label="Descripción" />
                    </Form.Item>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Form.Item name={[field.name, 'file']} rules={required ? [requiredField] : []}>
                      <InputFile onChange={() => {}} accept="pdf" />
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
                  borderColor,
                  color: buttonColor,
                  '&:hover': {
                    borderColor: '#111826',
                    bgcolor: buttonColor,
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
                    const sumPayments = (getFieldValue(name) ?? []).reduce(
                      (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
                      0
                    );

                    return (
                      <Typography variant="h5" color={errors.length ? 'error' : color} sx={{ fontWeight: 600 }}>
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
  );
};

export default PaymentsList;
