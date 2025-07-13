import { Fragment, ReactNode } from 'react';
import { Box, Typography, Stack, Grid, Button } from '@mui/material';
import { Payment } from '@mui/icons-material';

interface PaymentData {
  date?: string | null;
  bank?: string;
  description?: string;
  file?: any;
  amount?: string;
  status?: string | boolean;
}

interface PaymentsLayoutProps {
  title?: string;
  color?: string;
  mode?: 'readonly' | 'edit';
  payments?: PaymentData[];
  children?: ReactNode;
  onAddPayment?: () => void;
  renderTipoPago?: () => ReactNode;
  renderNotaPago?: () => ReactNode;
  showAddButton?: boolean;
  showExtraFields?: boolean;
  saldoFavor?: number;
  montoTotal?: number;
  estadoPago?: string;
}

const PaymentsLayout = ({
  title = 'Pagos',
  mode = 'edit',
  payments = [],
  children,
  onAddPayment,
  renderTipoPago,
  renderNotaPago,
  showAddButton = true,
  showExtraFields = true,
  saldoFavor = 0,
  montoTotal = 0,
  estadoPago = 'Completo',
}: PaymentsLayoutProps) => {
  const isReadonly = mode === 'readonly';

  // Calcular total de pagos
  const totalPayments = payments.reduce(
    (total, payment) => total + (payment.amount ? parseFloat(payment.amount) : 0),
    0
  );

  // Calcular saldo pendiente
  const saldoPendiente = Math.max(0, (montoTotal || 0) - totalPayments);

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

      {/* Contenido de pagos */}
      <Box>
        {/* Si hay children, renderizarlos (modo form) */}
        {children ? (
          <Fragment>
            {children}
          </Fragment>
        ) : (
          /* Modo presentacional - mostrar datos */
          <Fragment>
            {payments.length === 0 ? (
              <Box sx={{ 
                p: 6, 
                textAlign: 'center',
                color: 'text.secondary'
              }}>
                <Payment sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hay pagos registrados
                </Typography>
              </Box>
            ) : (
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
                        <Typography variant="body2" fontWeight={600} color="black">
                          {payment.date ? new Date(payment.date).toLocaleDateString() : '-- / -- / ----'}
                        </Typography>
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
                        <Typography variant="body2" fontWeight={600} color="black">
                          {payment.bank || 'Banco'}
                        </Typography>
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
                        <Typography variant="body2" fontWeight={600} color="black">
                          {payment.description || 'Descripción'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Archivo */}
                    <Grid size={1.5}>
                      <Box sx={{
                        bgcolor: '#f3f6f9',
                        borderRadius: 2,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                      }}>
                        <Typography variant="body2" fontWeight={600} color="black">
                          {payment.file ? 'Archivo' : '—'}
                        </Typography>
                      </Box>
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
                        <Typography variant="body2" fontWeight={600} color="#bdbdbd">
                          {payment.amount ? `S/ ${payment.amount}` : 's/'}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Status - Checkbox como botón */}
                    <Grid size={1.5}>
                      <Box sx={{
                        bgcolor: '#f3f6f9',
                        borderRadius: 2,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 2,
                      }}>
                        <Typography variant="body2" fontWeight={600} color="black">
                          {(payment.status === true || payment.status === 'true') ? '✓ Activo' : '✗ Inactivo'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                ))}
                
                {/* SALDO PENDIENTE - Replicando el diseño */}
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
                    mt: 2,
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
            )}
          </Fragment>
        )}

        {/* Botón agregar pago (solo en modo edición) */}
        {!isReadonly && showAddButton && onAddPayment && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Button
              onClick={onAddPayment}
              sx={{
                background: '#9e31f4',
                borderColor: '#f3f6f9',
                color: 'white',
                fontWeight: 700,
                borderRadius: 2,
                height: 48,
                px: 3,
                fontSize: 16,
                width: '100%',
                textTransform: 'none',
                '&:hover': {
                  background: '#8b29d6',
                },
              }}
            >
              Agregar Pago
            </Button>
          </Box>
        )}

        {/* Campos adicionales: tipoPago y notaPago */}
        {showExtraFields && (renderTipoPago || renderNotaPago) && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {renderTipoPago && (
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  {renderTipoPago()}
                </Grid>
              )}
              {renderNotaPago && (
                <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                  {renderNotaPago()}
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentsLayout;
