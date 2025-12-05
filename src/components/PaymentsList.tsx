import { useMemo, useState, useEffect } from 'react';
import { Button, Checkbox, Input, Select, Card, Typography as AntTypography, Row, Col, Modal, message } from 'antd';
import { Box, Stack, Typography, Button as MuiButton, Chip } from '@mui/material';
import { DeleteOutlined, CreditCardOutlined, PaperClipOutlined, CalendarOutlined, BankOutlined, FileTextOutlined, DollarOutlined, WalletOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import DatePickerAntd from '@/components/DatePickerAnt';
import SimpleFileUpload from '@/components/SimpleFileUpload';
import PagosModal from '@/components/PagosModal';
import { getHistorialPagos } from '@/services/pagos/pagos.requests';
import { getActiveBankAccountsByEntity } from '@/services/bankAccounts/bankAccount.requests';
import { BankAccount } from '@/types/bankAccount.types';

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
  entityType?: 'PROVIDER' | 'TRANSPORT';
  entityId?: number;
  entityName?: string;
  onPaymentsChange?: (payments: PaymentItem[]) => void;
  onTipoPagoChange?: (tipoPago: string) => void;
  onNotaPagoChange?: (notaPago: string) => void;
}

// Opciones del enum TipoPago del backend
const TIPO_PAGO_OPTIONS = [
  { label: 'Pagado', value: 'PAGADO' },
  { label: 'Urgente', value: 'URGENTE' },
  { label: 'Pendiente', value: 'PENDIENTE' },
  { label: 'Pago Enviado - Verificado', value: 'PAGO_ENVIADO_VERIFICADO' }
];

const getEmptyPaymentRecord = (): PaymentItem => ({
  date: null,
  bank: '',
  description: '',
  file: null,
  amount: '',
  status: false,
});

const PaymentsList: React.FC<PaymentsListProps> = ({
  payments = [],
  tipoPago = 'PENDIENTE',
  notaPago = '',
  title = 'Pagos',
  mode = 'edit',
  saldoFavor = 0,
  montoTotal = 0,
  entityType,
  entityId,
  entityName,
  onPaymentsChange,
  onTipoPagoChange,
  onNotaPagoChange,
}) => {
  const isReadonly = mode === 'readonly';

  // Permitir edición de notaPago y tipoPago siempre
  const [localTipoPago, setLocalTipoPago] = useState<string>(tipoPago);
  const [localNotaPago, setLocalNotaPago] = useState<string>(notaPago);

  // Estado para el modal de pagos y anticipo disponible de la entidad
  const [pagosModalOpen, setPagosModalOpen] = useState(false);
  const [anticipoEntidad, setAnticipoEntidad] = useState<number>(0);
  const [loadingSaldo, setLoadingSaldo] = useState(false);

  // Estado para tarjetas disponibles de la entidad
  const [tarjetasDisponibles, setTarjetasDisponibles] = useState<BankAccount[]>([]);
  const [loadingTarjetas, setLoadingTarjetas] = useState(false);

  // Estado para modal de tarjetas
  const [tarjetasModalOpen, setTarjetasModalOpen] = useState(false);

  useEffect(() => {
    setLocalTipoPago(tipoPago);
    setLocalNotaPago(notaPago);
  }, [tipoPago, notaPago]);

  // Cargar anticipo disponible de la entidad
  useEffect(() => {
    const cargarAnticipoEntidad = async () => {
      if (entityId && entityType) {
        try {
          setLoadingSaldo(true);
          const tipoEntidad = entityType === 'PROVIDER' ? 'PROVEEDOR' : 'TRANSPORTE';
          const historial = await getHistorialPagos(entityId, tipoEntidad);
          const anticipo = historial.totalAFavor - historial.totalCobrado;
          setAnticipoEntidad(anticipo);
        } catch (error) {
          console.error('Error al cargar anticipo de la entidad:', error);
          setAnticipoEntidad(0);
        } finally {
          setLoadingSaldo(false);
        }
      }
    };

    cargarAnticipoEntidad();
  }, [entityId, entityType]);

  // Cargar tarjetas disponibles de la entidad
  useEffect(() => {
    const cargarTarjetasDisponibles = async () => {
      if (entityId && entityType) {
        try {
          setLoadingTarjetas(true);
          const tipoEntidad = entityType === 'PROVIDER' ? 'PROVEEDOR' : 'TRANSPORTE';
          const tarjetas = await getActiveBankAccountsByEntity(tipoEntidad as any, entityId);
          setTarjetasDisponibles(tarjetas);
        } catch (error) {
          console.error('Error al cargar tarjetas disponibles:', error);
          setTarjetasDisponibles([]);
        } finally {
          setLoadingTarjetas(false);
        }
      }
    };

    cargarTarjetasDisponibles();
  }, [entityId, entityType]);

  // Callback inmediato para cambios en nota/tipo
  const handleTipoPagoChange = (value: string) => {
    setLocalTipoPago(value);
    onTipoPagoChange?.(value);
  };
  const handleNotaPagoChange = (value: string) => {
    setLocalNotaPago(value);
    onNotaPagoChange?.(value);
  };

  // Handler para abrir modal de pagos
  const handleOpenPagosModal = () => {
    setPagosModalOpen(true);
  };

  const handleClosePagosModal = () => {
    setPagosModalOpen(false);
    // Recargar saldo después de cerrar el modal
    if (entityId && entityType) {
      const cargarSaldoEntidad = async () => {
        try {
          setLoadingSaldo(true);
          const tipoEntidad = entityType === 'PROVIDER' ? 'PROVEEDOR' : 'TRANSPORTE';
          const historial = await getHistorialPagos(entityId, tipoEntidad);
          const anticipo = historial.totalAFavor - historial.totalCobrado;
          setAnticipoEntidad(anticipo);
        } catch (error) {
          console.error('Error al cargar saldo de la entidad:', error);
        } finally {
          setLoadingSaldo(false);
        }
      };
      cargarSaldoEntidad();
    }
  };

  // Handlers para modal de tarjetas
  const handleOpenTarjetasModal = () => {
    setTarjetasModalOpen(true);
  };

  const handleCloseTarjetasModal = () => {
    setTarjetasModalOpen(false);
  };

  // Función para copiar número de cuenta al portapapeles
  const handleCopyAccountNumber = async (accountNumber: string, bankName: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      message.success(`Número de cuenta de ${bankName} copiado al portapapeles`);
    } catch (error) {
      message.error('Error al copiar al portapapeles');
    }
  };

  // Estado local para edición
  const [localPayments, setLocalPayments] = useState<PaymentItem[]>(payments);
  const [isDirty, setIsDirty] = useState(false);


  // Sincronizar pagos solo cuando cambian los pagos del prop
  useEffect(() => {
    setLocalPayments(payments);
  }, [payments]);

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

  // Saldo pendiente - Ahora permite valores negativos
  const saldoPendiente = (montoTotal || 0) - totalPayments;

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
              background: '#fff', // Siempre fondo blanco para edición
              resize: 'vertical',
              opacity: 1, // Siempre opacidad completa
            }}
            placeholder="Escribe una nota privada para tesorería..."
            disabled={false} // Siempre habilitado para edición
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 2, p: 4 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
              <CreditCardOutlined style={{ fontSize: 28, marginRight: 8 }} />
              {title}
            </Typography>
            {/* Botón de Tarjetas Disponibles */}
            {entityId && entityType && tarjetasDisponibles.length > 0 && (
              <MuiButton
                variant="outlined"
                size="small"
                onClick={handleOpenTarjetasModal}
                disabled={loadingTarjetas}
                startIcon={<EyeOutlined />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#6c5ebf',
                  color: '#6c5ebf',
                  '&:hover': {
                    borderColor: '#5a4fcf',
                    bgcolor: '#f3f0ff'
                  }
                }}
              >
                {loadingTarjetas ? '...' : `${tarjetasDisponibles.length} tarjeta${tarjetasDisponibles.length !== 1 ? 's' : ''}`}
              </MuiButton>
            )}
            {saldoFavor > 0 && (
              <Typography variant="h5" sx={{ color: '#1890ff', fontWeight: 700 }}>
                saldo a favor: S/ {saldoFavor.toFixed(2)}
              </Typography>
            )}
            {/* Botón de Saldo Pendiente - Para PROVIDER y TRANSPORT */}
            {entityId && entityType && (
              <MuiButton
                variant="contained"
                size="small"
                onClick={handleOpenPagosModal}
                disabled={loadingSaldo}
                startIcon={<WalletOutlined />}
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: anticipoEntidad >= 0 ? '#10b981' : '#f59e0b',
                  '&:hover': {
                    bgcolor: anticipoEntidad >= 0 ? '#059669' : '#d97706'
                  }
                }}
              >
                {loadingSaldo ? 'Cargando...' : `Anticipo: S/ ${anticipoEntidad >= 0 ? '' : '-'}${Math.abs(anticipoEntidad).toFixed(2)}`}
              </MuiButton>
            )}
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Tipo de Pago */}
          {renderTipoPago()}
          {/* Botones de Guardar y Cancelar - Solo si hay cambios */}
          {!isReadonly && isDirty && (
            <>
              <Button
                type="default"
                onClick={() => {
                  setLocalPayments(payments);
                  setLocalTipoPago(tipoPago);
                  setLocalNotaPago(notaPago);
                  setIsDirty(false);
                }}
                style={{
                  background: '#f3f6f9',
                  color: '#222',
                  fontWeight: 700,
                  borderRadius: 8,
                  height: 48,
                  fontSize: 14,
                  border: '1px solid #d9d9d9',
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                disabled={!validatePayments()}
                onClick={() => {
                  onPaymentsChange?.(localPayments);
                  onTipoPagoChange?.(localTipoPago);
                  onNotaPagoChange?.(localNotaPago);
                  setIsDirty(false);
                }}
                style={{
                  background: '#059669',
                  color: 'white',
                  fontWeight: 700,
                  borderRadius: 8,
                  height: 48,
                  fontSize: 14,
                  border: 'none',
                }}
              >
                Guardar cambios
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* INPUTS DE PAGOS */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {localPayments.length === 0 && isReadonly ? (
          // Mostrar fila vacía en modo readonly cuando no hay pagos
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid #d9d9d9',
              background: '#fafafa'
            }}
          >
            <Row gutter={[16, 16]} style={{ alignItems: 'middle' }}>
              {/* Fecha */}
              <Col span={4}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 12, color: '#666' }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    Fecha
                  </Text>
                </div>
                <Input
                  value="-- / -- / ----"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Col>

              {/* Banco */}
              <Col span={4}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 12, color: '#666' }}>
                    <BankOutlined style={{ marginRight: 4 }} />
                    Banco
                  </Text>
                </div>
                <Input
                  value="---"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Col>

              {/* Descripción */}
              <Col span={6}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 12, color: '#666' }}>
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    Descripción
                  </Text>
                </div>
                <Input
                  value="---"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Col>

              {/* Monto */}
              <Col span={4}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 12, color: '#666' }}>
                    <DollarOutlined style={{ marginRight: 4 }} />
                    Monto
                  </Text>
                </div>
                <Input
                  value="S/ 0.00"
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Col>

              {/* Archivo */}
              <Col span={3}>
                <div style={{ marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 12, color: '#666' }}>
                    <PaperClipOutlined style={{ marginRight: 4 }} />
                    Archivo
                  </Text>
                </div>
                <Text style={{ color: '#999', fontSize: 12 }}>Sin archivo</Text>
              </Col>

              {/* Estado */}
              <Col span={3}>
                <div>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>Estado</Text>
                  </div>
                  <Checkbox
                    checked={false}
                    disabled={true}
                  >
                    Verificado
                  </Checkbox>
                </div>
              </Col>
            </Row>
          </Card>
        ) : (
          localPayments.map((payment: PaymentItem, index: number) => (
            <Card
              key={index}
              style={{
                borderRadius: 8,
                border: '1px solid #d9d9d9',
                background: '#fafafa'
              }}
            >
              <Row gutter={[16, 16]} style={{ alignItems: 'middle' }}>
                {/* Fecha */}
                <Col span={4}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />
                      Fecha
                    </Text>
                  </div>
                  {isReadonly ? (
                    <Input
                      value={payment.date ? payment.date.format('DD/MM/YYYY') : '-- / -- / ----'}
                      readOnly
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                  ) : (
                    <DatePickerAntd
                      placeholder="Seleccionar fecha"
                      size="small"
                      value={payment.date}
                      onChange={(date) => handleUpdatePayment(index, 'date', date)}
                      style={{ width: '100%' }}
                    />
                  )}
                </Col>

                {/* Banco */}
                <Col span={4}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>
                      <BankOutlined style={{ marginRight: 4 }} />
                      Banco
                    </Text>
                  </div>
                  <Input
                    placeholder="Nombre del banco"
                    value={payment.bank}
                    size='large'
                    onChange={(e) => handleUpdatePayment(index, 'bank', e.target.value)}
                    readOnly={isReadonly}
                    style={{ backgroundColor: isReadonly ? '#f5f5f5' : '#fff' }}
                  />
                </Col>

                {/* Descripción */}
                <Col span={6}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>
                      <FileTextOutlined style={{ marginRight: 4 }} />
                      Descripción
                    </Text>
                  </div>
                  <Input
                    placeholder="Descripción del pago"
                    value={payment.description}
                    size='large'
                    onChange={(e) => handleUpdatePayment(index, 'description', e.target.value)}
                    readOnly={isReadonly}
                    style={{ backgroundColor: isReadonly ? '#f5f5f5' : '#fff' }}
                  />
                </Col>

                {/* Archivo */}
                <Col span={3}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>
                      <PaperClipOutlined style={{ marginRight: 4 }} />
                      Archivo
                    </Text>
                  </div>
                  {isReadonly ? (
                    payment.file ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          if (typeof payment.file === 'string') {
                            window.open(payment.file, '_blank');
                          }
                        }}
                        style={{ padding: 0, height: 'auto' }}
                      >
                        Ver archivo
                      </Button>
                    ) : (
                      <Text type="secondary">Sin archivo</Text>
                    )
                  ) : (
                    <SimpleFileUpload
                      label=""
                      accept="application/pdf,image/*"
                      value={payment.file}
                      onChange={(file) => handleUpdatePayment(index, 'file', file)}
                    />
                  )}
                </Col>

                {/* Monto */}
                <Col span={4}>
                  <div style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 12, color: '#666' }}>
                      <DollarOutlined style={{ marginRight: 4 }} />
                      Monto
                    </Text>
                  </div>
                  <Input
                    placeholder="0.00"
                    type="number"
                    prefix="S/"
                    size='large'
                    value={payment.amount}
                    onChange={(e) => handleUpdatePayment(index, 'amount', e.target.value)}
                    readOnly={isReadonly}
                    style={{ backgroundColor: isReadonly ? '#f5f5f5' : '#fff' }}
                  />
                </Col>

                {/* Status y Eliminar */}
                <Col span={3}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        <Text strong style={{ fontSize: 12, color: '#666' }}>Estado</Text>
                      </div>
                      <Checkbox
                        checked={payment.status}
                        disabled={isReadonly}
                        onChange={(e) => handleUpdatePayment(index, 'status', e.target.checked)}
                      >
                        Verificado
                      </Checkbox>
                    </div>

                    {!isReadonly && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemovePayment(index)}
                        size="small"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          ))
        )}
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
            <Typography fontWeight={700} fontSize={16}>
              {entityType === 'PROVIDER' ? 'Total Pendiente' : 'Total Pagado'}
            </Typography>
            <Typography
              fontWeight={700}
              fontSize={18}
              sx={{
                color: saldoPendiente > 0 ? '#059669' : saldoPendiente < 0 ? '#dc2626' : '#666'
              }}
            >
              S/ {saldoPendiente.toFixed(2)}
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
          <Typography fontWeight={700} fontSize={16}>
            {entityType === 'PROVIDER' ? 'Total Pendiente' : 'Total Pagado'}
          </Typography>
          <Typography
            fontWeight={700}
            fontSize={18}
            sx={{
              color: saldoPendiente > 0 ? '#059669' : saldoPendiente < 0 ? '#dc2626' : '#666'
            }}
          >
            S/ {saldoPendiente.toFixed(2)}
          </Typography>
        </Box>
      )}
      {/* NOTA PRIVADA */}
      {renderNotaPago()}

      {/* Modal de Tarjetas Disponibles */}
      <Modal
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CreditCardOutlined style={{ fontSize: 20, marginRight: 8, color: '#6c5ebf' }} />
            <Typography variant="h6" fontWeight={700}>
              Cuentas Bancarias Disponibles
            </Typography>
          </Box>
        }
        open={tarjetasModalOpen}
        onCancel={handleCloseTarjetasModal}
        footer={[
          <Button key="close" onClick={handleCloseTarjetasModal}>
            Cerrar
          </Button>
        ]}
        width={600}
        centered
      >
        <Box sx={{ mt: 2 }}>
          {loadingTarjetas ? (
            <Typography align="center">Cargando cuentas bancarias...</Typography>
          ) : tarjetasDisponibles.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No hay cuentas bancarias disponibles
            </Typography>
          ) : (
            <Stack spacing={2}>
              {tarjetasDisponibles.map((tarjeta) => (
                <Card
                  key={tarjeta.id}
                  style={{
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    background: '#fafafa'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <BankOutlined style={{ fontSize: 18, marginRight: 12, color: '#6c5ebf' }} />
                      <Box>
                        <Typography fontWeight={600} fontSize={16} sx={{ mb: 0.5 }}>
                          {tarjeta.banco}
                        </Typography>
                        <Typography fontSize={14} color="text.secondary" sx={{ mb: 0.5 }}>
                          Cuenta: {tarjeta.numeroCuenta}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          Moneda: {tarjeta.moneda === 'SOLES' ? 'Soles (PEN)' : 'Dólares (USD)'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <Button
                        type="primary"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopyAccountNumber(tarjeta.numeroCuenta, tarjeta.banco)}
                        style={{
                          background: '#6c5ebf',
                          borderColor: '#6c5ebf'
                        }}
                      >
                        Copiar
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Modal>

      {/* Modal de Gestión de Pagos */}
      {entityId && entityType && entityName && (
        <PagosModal
          open={pagosModalOpen}
          onClose={handleClosePagosModal}
          entidadId={entityId}
          tipoEntidad={entityType === 'PROVIDER' ? 'PROVEEDOR' : 'TRANSPORTE'}
          entidadNombre={entityName}
          onSuccess={handleClosePagosModal}
        />
      )}
    </Box>
  );
};

export default PaymentsList;