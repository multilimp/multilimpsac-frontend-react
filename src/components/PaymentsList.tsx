import { Fragment, useCallback, useMemo } from 'react';
import { Form, Select, Button, Checkbox } from 'antd';
import { Grid, Stack, Typography, Box } from '@mui/material';
import { Delete, Payment } from '@mui/icons-material';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import PaymentsLayout from './PaymentsLayout';
import SimpleFileUpload from './SimpleFileUpload';

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
  saldoFavor?: number;
  montoTotal?: number;
  estadoPago?: string;
  form?: any;
}

// Opciones del enum TipoPago del backend
const TIPO_PAGO_OPTIONS = [
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
  { label: 'Pendiente', value: 'PENDIENTE' }
];

const getEmptyPaymentRecord = () => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: true, // Cambiar a boolean para checkbox
});

const PaymentsList: React.FC<PaymentsListProps> = ({
  name,
  tipoPagoName = 'tipoPago',
  notaPagoName = 'notaPago',
  title = 'Pagos',
  mode = 'edit',
  required = false,
  initialValue = [getEmptyPaymentRecord()],
  saldoFavor = 0,
  montoTotal = 0,
  estadoPago = 'Completo',
  form,
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

  // Calcular suma total de pagos
  const calculateTotalPayments = useCallback(() => {
    if (!form) return 0;
    const payments = form.getFieldValue(name) || [];
    return payments.reduce((total: number, payment: any) => {
      const amount = parseFloat(payment?.amount || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [form, name]);

  const totalPayments = calculateTotalPayments();
  const saldoPendiente = Math.max(0, (montoTotal || 0) - totalPayments);

  // Componente renderizado para tipoPago
  const renderTipoPago = useCallback(() => (
    <Form.Item name={tipoPagoName} label="Tipo de Pago">
      <Select 
        placeholder="Seleccionar tipo"
        size="middle"
        options={TIPO_PAGO_OPTIONS}
        style={{ width: '100%' }}
        disabled={false} 
        dropdownStyle={
          { maxHeight: 400, overflowY: 'auto' } 
        }
      />
    </Form.Item>
  ), [tipoPagoName]);

  // Componente renderizado para notaPago - Replicando el estilo de PaymentsProveedor
  const renderNotaPago = useCallback(() => (
    <Box sx={{ mt: 3 }}>
      <Typography fontWeight={700} color="#6c5ebf" mb={1} fontSize={16}>
        Nota privada para Tesoreria
      </Typography>
      <Form.Item name={notaPagoName} noStyle>
        <Box
          component="textarea"
          rows={4}
          style={{
            width: '100%',
            borderRadius: 8,
            border: '1.5px solid #6c5ebf',
            padding: 16,
            fontSize: 14,
            color: '#222',
            background: '#fff',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
          placeholder="Escribe una nota privada para tesorería..."
        />
      </Form.Item>
    </Box>
  ), [notaPagoName]);

  if (isArrayReadonly) {
    // Modo readonly: usar PaymentsLayout con el nuevo diseño
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
              mode="readonly"
              payments={payments}
              saldoFavor={saldoFavor}
              montoTotal={montoTotal}
              estadoPago={estadoPago}
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

  // Modo edición: replicar el diseño de PaymentsProveedor
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      {/* HEADER - Replicando el diseño de PaymentsProveedor */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
            <Payment sx={{ fontSize: 28, mr: 1 }} />
            {title}
          </Typography>
          {saldoFavor > 0 && (
            <Typography variant="h5" sx={{ color: '#04BA6B', fontWeight: 700 }}>
              saldo a favor: S/ {saldoFavor.toFixed(2)}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Estado de Pago al costado del chip */}
          <Form.Item name={tipoPagoName} noStyle>
            <Select 
              placeholder="Estado de pago"
              size="large"
              options={TIPO_PAGO_OPTIONS}
              style={{ 
                width: 200,
                height: 48,
              }}
              disabled={false} 
              dropdownStyle={
                { maxHeight: 400, overflowY: 'auto' } 
              }
            />
          </Form.Item>
          <Box
            sx={{
              bgcolor: '#f3f6f9',
              color: '#222',
              fontWeight: 700,
              fontSize: 18,
              px: 3,
              py: 1,
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              minWidth: 120,
              justifyContent: 'center',
              height: 48,
            }}
          >
            {estadoPago}
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: '#222',
                ml: 1.5,
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* INPUTS DE PAGOS */}
      <Form.List 
        name={name} 
        initialValue={initialValue} 
        rules={validationRules}
      >
        {(fields, { add, remove }, { errors }) => (
          <Fragment>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {fields.map((field) => {
                const fileValue = form?.getFieldValue?.([name, field.name, 'file']);
                return (
                  <Grid container spacing={2} key={field.key}>
                    {/* Fecha */}
                    <Grid size={2}>
                      <Form.Item name={[field.name, 'date']} noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}>
                          <DatePickerAntd
                            placeholder="-- / -- / ----"
                            size="small"
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              color: 'black',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Form.Item>
                    </Grid>

                    {/* Banco */}
                    <Grid size={2}>
                      <Form.Item name={[field.name, 'bank']} noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}>
                          <InputAntd
                            placeholder="Banco"
                            size="small"
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              color: 'black',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Form.Item>
                    </Grid>

                    {/* Descripción */}
                    <Grid size={3}>
                      <Form.Item name={[field.name, 'description']} noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}>
                          <InputAntd
                            placeholder="Descripción"
                            size="small"
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              color: 'black',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Form.Item>
                    </Grid>

                    {/* Archivo */}
                    <Grid size={1.5}>
                      <Form.Item name={[field.name, 'file']} noStyle>
                        <SimpleFileUpload
                          label=""
                          accept="application/pdf"
                          value={fileValue}
                          onChange={file => {
                            form?.setFieldValue?.([name, field.name, 'file'], file);
                          }}
                        />
                      </Form.Item>
                    </Grid>

                    {/* Monto */}
                    <Grid size={2}>
                      <Form.Item name={[field.name, 'amount']} noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}>
                          <InputAntd
                            placeholder="s/"
                            type="number"
                            size="small"
                            style={{
                              width: '100%',
                              border: 'none',
                              background: 'transparent',
                              color: '#bdbdbd',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      </Form.Item>
                    </Grid>
                    
                    {/* Status - Checkbox como botón */}
                    <Grid size={0.5}>
                      <Form.Item name={[field.name, 'status']} valuePropName="checked" noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 2,
                        }}>
                          <Checkbox 
                            defaultChecked={true}
                            style={{ 
                              transform: 'scale(1.2)',
                              color: '#04BA6B',
                            }}
                          />
                        </Box>
                      </Form.Item>
                    </Grid>
                    
                    {/* Eliminar pago */}
                    <Grid size={1}>
                      <Box sx={{
                        bgcolor: '#f3f6f9',
                        borderRadius: 2,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Button
                          type="text"
                          danger
                          icon={<Delete />}
                          onClick={() => remove(field.name)}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                );
              })}
            </Stack>

            {/* ACCIONES Y SALDO PENDIENTE */}
            <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
              <Button
                onClick={() => addNewPayment(add)}
                size="large"
                style={{
                  background: '#6c5fbf',
                  borderColor: '#f3f6f9',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 8,
                  height: 48,
                  paddingLeft: 24,
                  paddingRight: 24,
                  fontSize: 16,
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Agregar Pago
              </Button>

              <Box
                sx={{
                  flex: 1,
                  bgcolor: '#f3f6f9',
                  borderRadius: 1,
                  px: 3,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 48,
                  minWidth: 0,
                }}
              >
                <Typography fontWeight={700} fontSize={16}>Saldo Pendiente</Typography>
                <Typography 
                  fontWeight={700} 
                  fontSize={18}
                  color={saldoPendiente > 0 ? '#DC2626' : '#059669'}
                >
                  S/ {saldoPendiente.toFixed(2)}
                </Typography>
              </Box>
            </Stack>

            {/* Mostrar errores */}
            {errors.length ? (
              <Box sx={{ mb: 2 }}>
                <Typography color="error" variant="body2">
                  {(errors as Array<string>).join(' - ')}
                </Typography>
              </Box>
            ) : null}
          </Fragment>
        )}
      </Form.List>

      {/* NOTA PRIVADA */}
      {renderNotaPago()}
    </Box>
  );
};

export default PaymentsList;
