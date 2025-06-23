import { Fragment, useCallback, useMemo } from 'react';
import { Form, Select } from 'antd';
import { Grid, IconButton, Stack, Typography, Box, FormHelperText } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import InputFile from '@/components/InputFile';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import { formatCurrency } from '@/utils/functions';
import PaymentsLayout from './PaymentsLayout';

type PaymentMode = 'readonly' | 'edit';

interface PaymentsListProps {
  name: string;
  tipoPagoName?: string;
  notaPagoName?: string;
  title?: string;
  mode?: PaymentMode;
  color?: string;
  required?: boolean;
  initialValue?: any[];
}

// Opciones del enum TipoPago del backend
const TIPO_PAGO_OPTIONS = [
  { label: 'Contado', value: 'CONTADO' },
  { label: 'Crédito', value: 'CREDITO' },
  { label: 'Anticipado', value: 'ANTICIPADO' },
  { label: 'Otros', value: 'OTROS' },
];

const requiredField = { required: true, message: 'Campo requerido' };

const getEmptyPaymentRecord = () => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: 'true',
});

const PaymentsList: React.FC<PaymentsListProps> = ({
  name,
  tipoPagoName = 'tipoPago',
  notaPagoName = 'notaPago',
  title = 'Pagos',
  mode = 'edit',
  color = '#006DFA',
  required = false,
  initialValue = [getEmptyPaymentRecord()],
}) => {
  const isArrayReadonly = mode === 'readonly';
  
  // Memoizamos las reglas de validación para evitar re-renders
  const validationRules = useMemo(() => {
    return required
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
  }, [required]);

  const addNewPayment = useCallback((add: any) => {
    add(getEmptyPaymentRecord());
  }, []);

  // Componente renderizado para tipoPago
  const renderTipoPago = useCallback(() => (
    <Form.Item name={tipoPagoName} label="Tipo de Pago">
      <Select 
        placeholder="Seleccionar tipo"
        size="middle"
        options={TIPO_PAGO_OPTIONS}
        style={{ width: '100%' }}
        disabled={false} // Siempre editable
      />
    </Form.Item>
  ), [tipoPagoName]);

  // Componente renderizado para notaPago
  const renderNotaPago = useCallback(() => (
    <Form.Item name={notaPagoName} label="Nota de Pago">
      <InputAntd 
        label="" 
        type="textarea"
        placeholder="Observaciones o notas adicionales..."
        size="middle"
        disabled={false} // Siempre editable
      />
    </Form.Item>
  ), [notaPagoName]);

  if (isArrayReadonly) {
    // Modo readonly: mostrar datos de forma presentacional
    return (
      <Form.Item noStyle shouldUpdate={(prev, curr) => {
        const prevPayments = prev?.[name] || [];
        const currPayments = curr?.[name] || [];
        return prevPayments.length !== currPayments.length || 
               JSON.stringify(prevPayments) !== JSON.stringify(currPayments);
      }}>
        {({ getFieldValue }) => {
          const payments = getFieldValue(name) || [];
          
          return (
            <PaymentsLayout
              title={title}
              color={color}
              mode="readonly"
              payments={payments}
              renderTipoPago={renderTipoPago}
              renderNotaPago={renderNotaPago}
              showAddButton={false}
              showExtraFields={true}
            />
          );
        }}
      </Form.Item>
    );
  }

  // Modo edición: usar Form.List con PaymentsLayout
  return (
    <PaymentsLayout
      title={title}
      color={color}
      mode="edit"
      onAddPayment={undefined} // Se maneja internamente en Form.List
      renderTipoPago={renderTipoPago}
      renderNotaPago={renderNotaPago}
      showAddButton={false} // Se maneja internamente
      showExtraFields={true}
    >
      <Form.List 
        name={name} 
        initialValue={initialValue} 
        rules={validationRules}
      >
        {(fields, { add, remove }, { errors }) => (
          <Fragment>
            <Stack spacing={3}>
              {fields.map((field) => (
                <Box 
                  key={field.key}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    p: 3,
                    bgcolor: 'grey.50',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: color,
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  {/* Header del pago */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      Pago #{field.name + 1}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} alignItems="center">
                      {/* Status simple */}
                      <Form.Item name={[field.name, 'status']} initialValue="true">
                        <Select 
                          size="small"
                          options={[
                            { label: 'Activo', value: 'true' },
                            { label: 'Inactivo', value: 'false' }
                          ]}
                          style={{ width: 100 }}
                        />
                      </Form.Item>

                      {/* Botón eliminar */}
                      {fields.length > 1 && (
                        <IconButton 
                          size="small" 
                          onClick={() => remove(field.name)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: 'error.light'
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>

                  {/* Campos principales */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {/* Fecha */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                        Fecha
                      </Typography>
                      <Form.Item name={[field.name, 'date']} rules={required ? [requiredField] : []}>
                        <DatePickerAntd 
                          label="" 
                          placeholder="Seleccionar fecha"
                          size="small"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Grid>

                    {/* Banco */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                        Banco
                      </Typography>
                      <Form.Item name={[field.name, 'bank']} rules={required ? [requiredField] : []}>
                        <InputAntd 
                          label="" 
                          placeholder="Nombre del banco"
                          size="small"
                        />
                      </Form.Item>
                    </Grid>

                    {/* Monto */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                        Monto
                      </Typography>
                      <Form.Item name={[field.name, 'amount']} rules={required ? [requiredField] : []}>
                        <InputAntd 
                          label="" 
                          placeholder="0.00"
                          type="number"
                          size="small"
                        />
                      </Form.Item>
                    </Grid>

                    {/* Descripción */}
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                        Descripción
                      </Typography>
                      <Form.Item name={[field.name, 'description']} rules={required ? [requiredField] : []}>
                        <InputAntd 
                          label="" 
                          placeholder="Descripción del pago"
                          size="small"
                        />
                      </Form.Item>
                    </Grid>
                  </Grid>

                  {/* Segunda fila */}
                  <Grid container spacing={2}>
                    {/* Archivo */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, mb: 1, display: 'block' }}>
                        Comprobante
                      </Typography>
                      <Form.Item name={[field.name, 'file']} rules={required ? [requiredField] : []}>
                        <InputFile 
                          onChange={() => {}} 
                          accept="pdf" 
                          label=""
                        />
                      </Form.Item>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Stack>

            {/* Footer con botón y total */}
            <Box sx={{ 
              mt: 4,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">
                <Box
                  component="button"
                  type="button"
                  onClick={() => addNewPayment(add)}
                  sx={{
                    border: `1px solid ${color}`,
                    color: color,
                    bgcolor: 'transparent',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    py: 1.5,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      bgcolor: `${color}10`,
                    },
                  }}
                >
                  <Add />
                  Agregar Pago
                </Box>
                
                <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                  <Form.Item noStyle shouldUpdate={(prev, curr) => {
                    const prevPayments = prev?.[name] || [];
                    const currPayments = curr?.[name] || [];
                    
                    if (prevPayments.length !== currPayments.length) return true;
                    
                    return prevPayments.some((prevPayment: any, index: number) => {
                      const currPayment = currPayments[index];
                      return prevPayment?.amount !== currPayment?.amount;
                    });
                  }}>
                    {({ getFieldValue }) => {
                      const sumPayments = (getFieldValue(name) ?? []).reduce(
                        (acum: number, next: { amount: string }) => acum + (next.amount ? parseFloat(next.amount) : 0),
                        0
                      );

                      return (
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Total de Pagos
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: errors.length ? 'error.main' : color, mt: 0.5 }}>
                            {formatCurrency(sumPayments)}
                          </Typography>
                        </Box>
                      );
                    }}
                  </Form.Item>
                </Box>
              </Stack>

              {errors.length ? (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error sx={{ fontSize: '0.875rem' }}>
                    {(errors as Array<string>).join(' - ')}
                  </FormHelperText>
                </Box>
              ) : null}
            </Box>
          </Fragment>
        )}
      </Form.List>
    </PaymentsLayout>
  );
};

export default PaymentsList;
