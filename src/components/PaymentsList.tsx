import { useCallback, useMemo } from 'react';
import { Button, Checkbox, Input, Select } from 'antd';
import { Grid, Stack, Typography, Box } from '@mui/material';
import { Delete, Payment } from '@mui/icons-material';
import InputAntd from '@/components/InputAntd';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';

type PaymentMode = 'readonly' | 'edit';

interface Payment {
  date: any;
  bank: string;
  description: string;
  file: string | null;
  amount: string;
  status: boolean;
}

interface PaymentsListProps {
  payments: Payment[];
  tipoPago?: string;
  notaPago?: string;
  title?: string;
  mode?: PaymentMode;
  saldoFavor?: number;
  montoTotal?: number;
  estadoPago?: string;
  onPaymentsChange?: (payments: Payment[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
}

// Opciones del enum TipoPago del backend
const TIPO_PAGO_OPTIONS = [
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
  { label: 'Pendiente', value: 'PENDIENTE' }
];

const getEmptyPaymentRecord = (): Payment => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: true,
});

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments = [],
  tipoPago = '',
  notaPago = '',
  title = 'Pagos',
  mode = 'edit',
  saldoFavor = 0,
  montoTotal = 0,
  estadoPago = 'Completo',
  onPaymentsChange,
  onTipoPagoChange,
  onNotaPagoChange,
}) => {
  const isArrayReadonly = mode === 'readonly';

  // Calcular suma total de pagos
  const totalPayments = useMemo(() => {
    return payments.reduce((total: number, payment: Payment) => {
      const amount = parseFloat(payment?.amount || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [payments]);

  // Para ventas privadas, saldoPendiente = montoTotal - totalPayments - saldoFavor
  const saldoPendiente = Math.max(0, (montoTotal || 0) - totalPayments - (saldoFavor || 0));

  const addNewPayment = useCallback(() => {
    if (onPaymentsChange) {
      const newPayments = [...payments, getEmptyPaymentRecord()];
      onPaymentsChange(newPayments);
    }
  }, [payments, onPaymentsChange]);

  const removePayment = useCallback((index: number) => {
    if (onPaymentsChange) {
      const newPayments = payments.filter((_, i) => i !== index);
      onPaymentsChange(newPayments);
    }
  }, [payments, onPaymentsChange]);

  const updatePayment = useCallback((index: number, field: keyof Payment, value: any) => {
    if (onPaymentsChange) {
      const newPayments = [...payments];
      newPayments[index] = { ...newPayments[index], [field]: value };
      onPaymentsChange(newPayments);
    }
  }, [payments, onPaymentsChange]);

  // Componente renderizado para tipoPago
  const renderTipoPago = useCallback(() => (
    <Select 
      placeholder="Seleccionar tipo"
      size="middle"
      options={TIPO_PAGO_OPTIONS}
      style={{ width: '100%' }}
      value={tipoPago}
      onChange={onTipoPagoChange}
      dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
    />
  ), [tipoPago, onTipoPagoChange, isArrayReadonly]);

  // Componente renderizado para notaPago
  const renderNotaPago = useCallback(() => (
    <Box sx={{ mt: 3 }}>
      <Typography fontWeight={700} color="#6c5ebf" mb={1} fontSize={16}>
        Nota privada para Tesoreria
      </Typography>
      <Box
        component="textarea"
        rows={4}
        value={notaPago}
        onChange={(e: any) => onNotaPagoChange?.(e.target.value)}
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
    </Box>
  ), [notaPago, onNotaPagoChange, isArrayReadonly]);

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      {/* HEADER */}
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
          {renderTipoPago()}
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
      <Stack spacing={2} sx={{ mb: 3 }}>
        {payments.map((payment, index) => (
          <Grid container spacing={2} key={index}>
            {/* Fecha */}
            <Grid size={2}>
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
                  disabled={isArrayReadonly}
                  value={payment.date}
                  onChange={(date) => updatePayment(index, 'date', date)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: 'black',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>

            {/* Banco */}
            <Grid size={2}>
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
                  disabled={isArrayReadonly}
                  value={payment.bank}
                  onChange={(e: any) => updatePayment(index, 'bank', e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: 'black',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>

            {/* Descripción */}
            <Grid size={3}>
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
                  disabled={isArrayReadonly}
                  value={payment.description}
                  onChange={(e: any) => updatePayment(index, 'description', e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: 'black',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>

            {/* Archivo */}
            <Grid size={1.5}>
              <SimpleFileUpload
                label=""
                accept="application/pdf"
                value={payment.file}
                editable={!isArrayReadonly}
                onChange={(file) => updatePayment(index, 'file', file)}
              />
            </Grid>

            {/* Monto */}
            <Grid size={2}>
              <Box sx={{
                bgcolor: '#f3f6f9',
                borderRadius: 2,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                px: 2,
              }}>
                <Input
                  placeholder="s/"
                  type="number"
                  size="small"
                  disabled={isArrayReadonly}
                  value={payment.amount}
                  onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: '#000000ff',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>
            
            {/* Status - Checkbox como botón */}
            <Grid size={0.5}>
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
                  checked={payment.status}
                  disabled={isArrayReadonly}
                  onChange={(e) => updatePayment(index, 'status', e.target.checked)}
                  style={{ 
                    transform: 'scale(1.2)',
                    color: '#04BA6B',
                  }}
                />
              </Box>
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
                  disabled={isArrayReadonly}
                  onClick={() => removePayment(index)}
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
        ))}
      </Stack>

      {/* ACCIONES Y SALDO PENDIENTE */}
      <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
        <Button
          onClick={addNewPayment}
          size="large"
          disabled={isArrayReadonly}
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

      {/* NOTA PRIVADA */}
      {renderNotaPago()}
    </Box>
  );
};

export default PaymentsList;
