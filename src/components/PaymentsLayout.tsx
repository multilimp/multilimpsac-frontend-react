import { Fragment, ReactNode } from 'react';
import { Box, Typography, Stack, Grid, Chip, Button } from '@mui/material';
import { Payment, Add } from '@mui/icons-material';
import { formatCurrency } from '@/utils/functions';

interface PaymentData {
  date?: string | null;
  bank?: string;
  description?: string;
  file?: any;
  amount?: string;
  status?: string;
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
}

const PaymentsLayout = ({
  title = 'Pagos',
  color = '#006DFA', 
  mode = 'edit',
  payments = [],
  children,
  onAddPayment,
  renderTipoPago,
  renderNotaPago,
  showAddButton = true,
  showExtraFields = true,
}: PaymentsLayoutProps) => {
  const isReadonly = mode === 'readonly';

  // Calcular total de pagos
  const totalPayments = payments.reduce(
    (total, payment) => total + (payment.amount ? parseFloat(payment.amount) : 0),
    0
  );

  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
      borderRadius: 2, 
      border: '1px solid',
      borderColor: 'divider',
      overflow: 'hidden'
    }}>
      {/* Header minimalista */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'grey.50'
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Payment sx={{ color: color, fontSize: 20 }} />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Stack>
      </Box>

      {/* Contenido de pagos */}
      <Box sx={{ p: 3 }}>
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
              <Stack spacing={2}>
                {payments.map((payment, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 1.5,
                      p: 2.5,
                      bgcolor: 'grey.50',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: color,
                        bgcolor: 'background.paper'
                      }
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                        Pago #{index + 1}
                      </Typography>
                      <Chip
                        label={payment.status === 'true' ? 'Activo' : 'Inactivo'}
                        color={payment.status === 'true' ? 'success' : 'default'}
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 500, borderRadius: 1 }}
                      />
                    </Stack>
                    
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Fecha
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                            {payment.date ? new Date(payment.date).toLocaleDateString() : '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Banco
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                            {payment.bank || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Monto
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ mt: 0.5, color }}>
                            {payment.amount ? formatCurrency(parseFloat(payment.amount)) : '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Descripción
                          </Typography>
                          <Typography variant="body2" fontWeight={500} sx={{ mt: 0.5 }}>
                            {payment.description || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {payment.file && (
                        <Grid size={12}>
                          <Box sx={{ 
                            bgcolor: 'background.paper', 
                            p: 1.5, 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                          }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Comprobante:</strong> Archivo adjunto
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
                
                {/* Total minimalista */}
                <Box sx={{ 
                  textAlign: 'right',
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Total de Pagos
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color, mt: 0.5 }}>
                    {formatCurrency(totalPayments)}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Fragment>
        )}

        {/* Botón agregar pago (solo en modo edición) */}
        {!isReadonly && showAddButton && onAddPayment && (
          <Box sx={{ 
            mt: 4,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={onAddPayment}
              sx={{
                borderColor: color,
                color: color,
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1.5,
                borderRadius: 1.5,
                '&:hover': {
                  borderColor: color,
                  bgcolor: `${color}10`,
                },
              }}
            >
              Agregar Pago
            </Button>
          </Box>
        )}

        {/* Campos adicionales: tipoPago y notaPago */}
        {showExtraFields && (renderTipoPago || renderNotaPago) && (
          <Box sx={{ 
            mt: 3,
            pt: 3, 
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
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
