import { Fragment, useCallback, useMemo, useEffect } from 'react';
import { Form, Button, Select, Checkbox } from 'antd';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { Payment, ArrowDropDown, Delete } from '@mui/icons-material';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';

interface PaymentsProveedorProps {
  name: string;
  notaPrivadaName?: string;
  saldoFavor?: number;
  montoTotal?: number;
  estadoPago?: string;
  mode?: 'readonly' | 'edit';
  required?: boolean;
  initialValue?: any[];
  form?: any; // <-- Añade esto para recibir el form
}

const ESTADO_PAGO_OPTIONS = [
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Parcial', value: 'PARCIAL' },
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
];

const getEmptyPaymentRecord = () => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
});

const PaymentsProveedor: React.FC<PaymentsProveedorProps> = ({
  name,
  notaPrivadaName = 'notaPrivada',
  saldoFavor = 0,
  montoTotal = 0,
  estadoPago = 'Completo',
  mode = 'edit',
  required = false,
  initialValue = [getEmptyPaymentRecord(), getEmptyPaymentRecord(), getEmptyPaymentRecord()],
  form, // <-- Recibe el form
}) => {
  const isReadonly = mode === 'readonly';

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

  // Determinar estado de pago automáticamente
  const getEstadoPago = useCallback(() => {
    if (totalPayments === 0) return 'PENDIENTE';
    if (saldoPendiente === 0) return 'PAGADO';
    if (saldoPendiente > 0 && totalPayments > 0) return 'PARCIAL';
    return 'PENDIENTE';
  }, [totalPayments, saldoPendiente]);

  // Actualizar estado de pago automáticamente cuando cambien los pagos
  useEffect(() => {
    if (form) {
      const estadoCalculado = getEstadoPago();
      form.setFieldValue('estadoPago', estadoCalculado);
    }
  }, [form, getEstadoPago]);

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
            <Payment sx={{ fontSize: 28, mr: 1 }} />
            Pagos Proveedor
          </Typography>
          <Typography variant="h5" sx={{ color: '#04BA6B', fontWeight: 700 }}>
            saldo a favor: S/ {saldoFavor.toFixed(2)}
          </Typography>
        </Stack>
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
      </Box>

      {/* INPUTS DE PAGOS */}
      <Form.List name={name} initialValue={initialValue} rules={validationRules}>
        {(fields, { add, remove }) => (
          <Fragment>
            <Stack spacing={2} sx={{ mb: 3 }}>
              {fields.map((field) => {
                // Obtén el valor del archivo usando form.getFieldValue
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
                    
                    {/* Checkbox pagado */}
                    <Grid size={0.5}>
                      <Form.Item name={[field.name, 'isPaid']} valuePropName="checked" noStyle>
                        <Box sx={{
                          bgcolor: '#f3f6f9',
                          borderRadius: 2,
                          height: 48,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Checkbox
                            style={{
                              color: '#bdbdbd',
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
              <Form.Item
                name="estadoPago"
                noStyle
                initialValue={getEstadoPago()}
                rules={[{ required: true, message: 'Seleccione el estado de pago' }]}
              >
                <Select
                  size="large"
                  options={ESTADO_PAGO_OPTIONS}
                  value={getEstadoPago()}
                  style={{
                    width: '100%',
                    minWidth: 0,
                    flex: 1,
                    fontWeight: 700,
                    fontSize: 16,
                    borderRadius: 12,
                    backgroundColor: 'blue',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  dropdownStyle={{
                    borderRadius: 12,
                  }}
                />
              </Form.Item>

              <Button
                onClick={() => addNewPayment(add)}
                size="large"
                style={{
                  background: '#9e31f4',
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
          </Fragment>
        )}
      </Form.List>

      {/* NOTA PRIVADA */}
      <Box sx={{ mt: 3 }}>
        <Typography fontWeight={700} color="#6c5ebf" mb={1} fontSize={16}>
          Nota privada para Tesoreria
        </Typography>
        <Form.Item name={notaPrivadaName} noStyle>
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
    </Box>
  );
};

export default PaymentsProveedor;