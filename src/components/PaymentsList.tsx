import { useMemo, useState, useEffect } from 'react';
import { Button, Checkbox, Input, Select, Card, Space, Typography as AntTypography, Row, Col, Divider } from 'antd';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { DeleteOutlined, CreditCardOutlined, PaperClipOutlined, CalendarOutlined, BankOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import { Delete, Payment, AttachFile, Event, AccountBalance, Description, MonetizationOn } from '@mui/icons-material';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import InputFile from '@/components/InputFile';

const { Title, Text } = AntTypography;

type PaymentMode = 'readonly' | 'edit';

interface PaymentItem {
  date: any;
  bank: string;
  description: string;
  file: string | null;
  amount: string;
  status: boolean;
}

interface PaymentsListProps {
  payments: PaymentItem[];
  tipoPago?: string;
  notaPago?: string;
  title?: string;
  mode?: PaymentMode;
  saldoFavor?: number;
  montoTotal?: number;
  estadoPago?: string;
  onPaymentsChange?: (payments: PaymentItem[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
  // Nuevas props para el documento de cotización
  documentoCotizacion?: any;
  onDocumentoCotizacionChange?: (file: any) => void;
}

// Opciones del enum TipoPago del backend
const TIPO_PAGO_OPTIONS = [
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
  { label: 'Pendiente', value: 'PENDIENTE' }
];

const getEmptyPaymentRecord = (): PaymentItem => ({
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
  documentoCotizacion,
  onDocumentoCotizacionChange,
}) => {
  const isReadonly = mode === 'readonly';

  // Permitir edición de notaPago y tipoPago siempre
  const [localTipoPago, setLocalTipoPago] = useState<string>(tipoPago || 'PENDIENTE');
  const [localNotaPago, setLocalNotaPago] = useState<string>(notaPago);

  useEffect(() => {
    setLocalTipoPago(tipoPago || 'PENDIENTE');
    setLocalNotaPago(notaPago);
  }, [tipoPago, notaPago]);

  // Callback inmediato para cambios en nota/tipo
  const handleTipoPagoChange = (value: string) => {
    setLocalTipoPago(value);
    onTipoPagoChange?.(value);
  };
  const handleNotaPagoChange = (value: string) => {
    setLocalNotaPago(value);
    onNotaPagoChange?.(value);
  };

  // Estado local para edición
  const [localPayments, setLocalPayments] = useState<PaymentItem[]>(payments);
  const [isDirty, setIsDirty] = useState(false);


  // Sincronizar pagos solo cuando cambian los pagos del prop
  useEffect(() => {
    setLocalPayments(payments);
  }, [payments]);

  // Sincronizar tipoPago y notaPago por separado
  useEffect(() => {
    setLocalTipoPago(tipoPago);
  }, [tipoPago]);

  useEffect(() => {
    setLocalNotaPago(notaPago);
  }, [notaPago]);

  // Detectar cambios
  useEffect(() => {
    const dirty =
      JSON.stringify(localPayments) !== JSON.stringify(payments) ||
      localTipoPago !== tipoPago ||
      localNotaPago !== notaPago;
    setIsDirty(dirty);
  }, [localPayments, localTipoPago, localNotaPago, payments, tipoPago, notaPago]);

  // Validaciones básicas
  const validatePayments = () => {
    // Si no hay pagos pero hay cambios en tipoPago o notaPago, permitir guardar
    if (!localPayments.length) {
      return localTipoPago !== tipoPago || localNotaPago !== notaPago;
    }

    // Si hay pagos, validar que estén completos
    return localPayments.every((p: PaymentItem) =>
      p.bank.trim() &&
      p.amount && !isNaN(Number(p.amount)) && Number(p.amount) > 0
    );
  };

  // Calcular suma total de pagos
  const totalPayments = useMemo(() => {
    return localPayments.reduce((total: number, payment: PaymentItem) => {
      const amount = parseFloat(payment?.amount || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  }, [localPayments]);

  // Saldo pendiente
  const saldoPendiente = Math.max(0, (montoTotal || 0) - totalPayments - (saldoFavor || 0));

  // Handlers locales
  const handleAddPayment = () => {
    setLocalPayments([...localPayments, getEmptyPaymentRecord()]);
  };

  const handleRemovePayment = (index: number) => {
    setLocalPayments(localPayments.filter((_, i: number) => i !== index));
  };

  const handleUpdatePayment = (index: number, field: keyof PaymentItem, value: any) => {
    const newPayments = [...localPayments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setLocalPayments(newPayments);
  };

  // Componente renderizado para tipoPago
  const renderTipoPago = () => (
    <Select
      placeholder="Seleccionar tipo"
      size="middle"
      options={TIPO_PAGO_OPTIONS}
      style={{ width: 200, height: 48 }}
      value={localTipoPago}
      onChange={handleTipoPagoChange}
      dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
    />
  );

  // Componente renderizado para notaPago
  const renderNotaPago = () => (
    <div style={{ marginTop: 24 }}>
      <Row gutter={[24, 16]}>
        {/* Nota privada - ocupa todo el ancho ya que el documento se movió al header */}
        <Col span={24}>
          <Title level={5} style={{ fontWeight: 700, color: '#6c5ebf', marginBottom: 8, fontSize: 16 }}>
            Nota privada para Tesoreria
          </Title>
          <Input.TextArea
            rows={4}
            value={localNotaPago}
            onChange={(e) => handleNotaPagoChange(e.target.value)}
            style={{
              borderRadius: 8,
              border: '1.5px solid #6c5ebf',
              fontSize: 14,
              color: '#222',
              background: isReadonly ? '#f5f5f5' : '#fff',
              resize: 'vertical',
              opacity: isReadonly ? 0.7 : 1,
            }}
            placeholder="Escribe una nota privada para tesorería..."
            disabled={isReadonly}
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
            <CreditCardOutlined style={{ fontSize: 28, marginRight: 8 }} />
            {title}
          </Typography>
          {saldoFavor > 0 && (
            <Typography variant="h5" sx={{ color: '#1890ff', fontWeight: 700 }}>
              saldo a favor: S/ {saldoFavor.toFixed(2)}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Documento de Cotización */}
          {onDocumentoCotizacionChange && (
            <SimpleFileUpload
              label="Documento de Cotización"
              value={documentoCotizacion}
              onChange={onDocumentoCotizacionChange}
              accept="application/pdf"
              editable={!isReadonly}
            />
          )}

          {/* Tipo de Pago */}
          {renderTipoPago()}
        </Stack>
      </Box>

      {/* INPUTS DE PAGOS */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {localPayments.map((payment: PaymentItem, index: number) => (
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
                {isReadonly ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#666' }}>
                    <CalendarOutlined style={{ fontSize: 20, marginRight: 8, color: '#999' }} />
                    <Typography fontSize={14} fontWeight={600}>
                      {payment.date ? payment.date.format('DD/MM/YYYY') : '-- / -- / ----'}
                    </Typography>
                  </Box>
                ) : (
                  <DatePickerAntd
                    placeholder="-- / -- / ----"
                    size="small"
                    value={payment.date}
                    onChange={(date) => handleUpdatePayment(index, 'date', date)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'black',
                      fontWeight: 600,
                    }}
                  />
                )}
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
                {isReadonly ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#666' }}>
                    <AccountBalance sx={{ fontSize: 20, mr: 1, color: '#999' }} />
                    <Typography fontSize={14} fontWeight={600}>
                      {payment.bank || 'Sin especificar'}
                    </Typography>
                  </Box>
                ) : (
                  <Input
                    placeholder="Banco"
                    size="small"
                    value={payment.bank}
                    onChange={(e) => handleUpdatePayment(index, 'bank', e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'black',
                      fontWeight: 600,
                    }}
                  />
                )}
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
                {isReadonly ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#666' }}>
                    <Description sx={{ fontSize: 20, mr: 1, color: '#999' }} />
                    <Typography fontSize={14} fontWeight={600}>
                      {payment.description || 'Sin descripción'}
                    </Typography>
                  </Box>
                ) : (
                  <Input
                    placeholder="Descripción"
                    size="small"
                    value={payment.description}
                    onChange={(e) => handleUpdatePayment(index, 'description', e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: 'black',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Archivo */}
            <Grid size={1.5}>
              {isReadonly ? (
                payment.file ? (
                  <Box sx={{
                    bgcolor: '#f3f6f9',
                    borderRadius: 2,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#e5e7eb'
                    }
                  }}
                    onClick={() => {
                      if (typeof payment.file === 'string') {
                        window.open(payment.file, '_blank');
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#666' }}>
                      <AttachFile sx={{ fontSize: 20, mr: 1, color: '#1890ff' }} />
                      <Typography fontSize={12} fontWeight={600} sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#1890ff'
                      }}>
                        Ver Archivo
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{
                    bgcolor: '#f3f6f9',
                    borderRadius: 2,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999'
                  }}>
                    <Typography fontSize={12}>Sin archivo</Typography>
                  </Box>
                )
              ) : (
                <SimpleFileUpload
                  label=""
                  accept="application/pdf"
                  value={payment.file}
                  onChange={(file) => handleUpdatePayment(index, 'file', file)}
                />
              )}
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
                {isReadonly ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', color: '#666' }}>
                    <MonetizationOn sx={{ fontSize: 20, mr: 1, color: '#999' }} />
                    <Typography fontSize={14} fontWeight={600}>
                      S/ {payment.amount || '0.00'}
                    </Typography>
                  </Box>
                ) : (
                  <Input
                    placeholder="s/"
                    type="number"
                    size="small"
                    value={payment.amount}
                    onChange={(e) => handleUpdatePayment(index, 'amount', e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      background: 'transparent',
                      color: '#000000ff',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Status - Checkbox */}
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
                  disabled={isReadonly}
                  onChange={(e) => handleUpdatePayment(index, 'status', e.target.checked)}
                  style={{
                    transform: 'scale(1.2)',
                    color: '#1890ff',
                  }}
                />
              </Box>
            </Grid>

            {/* Eliminar pago */}
            {!isReadonly && (
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
                    onClick={() => handleRemovePayment(index)}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: 'transparent',
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        ))}
      </Stack>

      {/* ACCIONES Y SALDO PENDIENTE */}
      {!isReadonly && (
        <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Button
            onClick={handleAddPayment}
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
            <Typography fontWeight={700} fontSize={16}>Total Pagado</Typography>
            <Typography
              fontWeight={700}
              fontSize={18}
              color="#059669"
            >
              S/ {totalPayments.toFixed(2)}
            </Typography>
          </Box>
        </Stack>
      )}

      {/* Mostrar resumen si es readonly */}
      {isReadonly && (
        <Box
          sx={{
            bgcolor: '#f8f9fa',
            borderRadius: 1,
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography fontWeight={700} fontSize={16}>Total Pagado</Typography>
          <Typography
            fontWeight={700}
            fontSize={18}
            color="#059669"
          >
            S/ {totalPayments.toFixed(2)}
          </Typography>
        </Box>
      )}

      {/* NOTA PRIVADA */}
      {renderNotaPago()}

      {/* BOTONES GUARDAR/CANCELAR SOLO EN EDITOR Y SI HAY CAMBIOS */}
      {!isReadonly && isDirty && (
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="primary"
            disabled={!validatePayments()}
            style={{
              background: '#059669',
              color: 'white',
              fontWeight: 700,
              borderRadius: 8,
              height: 48,
              fontSize: 16,
              flex: 1,
            }}
            onClick={() => {
              onPaymentsChange?.(localPayments);
              onTipoPagoChange?.(localTipoPago);
              onNotaPagoChange?.(localNotaPago);
              setIsDirty(false);
            }}
          >
            Guardar cambios
          </Button>
          <Button
            type="default"
            style={{
              background: '#f3f6f9',
              color: '#222',
              fontWeight: 700,
              borderRadius: 8,
              height: 48,
              fontSize: 16,
              flex: 1,
            }}
            onClick={() => {
              setLocalPayments(payments);
              setLocalTipoPago(tipoPago);
              setLocalNotaPago(notaPago);
              setIsDirty(false);
            }}
          >
            Cancelar
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default PaymentsList;
