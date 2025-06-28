import React, { useState, useEffect } from 'react';
import { Form, notification, Spin } from 'antd';
import { Box, Typography, Card, CardContent, Stack, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LocalShipping, ExpandMore, Payment } from '@mui/icons-material';
import PaymentsList from '@/components/PaymentsList';
import { getTransportesByOrdenCompraForTesoreria, updatePagoTransporteFromTesoreria } from '@/services/treasurys/treasurys.request';
import { formatCurrency } from '@/utils/functions';
import dayjs from 'dayjs';

interface TreasuryTransportPaymentsProps {
  ordenCompraId: number;
}

interface TransporteAsignado {
  id: number;
  transporte: {
    id: number;
    razonSocial: string;
    ruc: string;
  };
  ordenProveedor: {
    id: number;
    codigoOp: string;
    proveedor: {
      razonSocial: string;
    };
  };
  montoFlete: number;
  pagos: any[];
  tipoPago?: string;
  notaPago?: string;
}

const TreasuryTransportPayments: React.FC<TreasuryTransportPaymentsProps> = ({ ordenCompraId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transportes, setTransportes] = useState<TransporteAsignado[]>([]);
  const [expandedTransport, setExpandedTransport] = useState<number | null>(null);

  useEffect(() => {
    loadTransportes();
  }, [ordenCompraId]);

  const loadTransportes = async () => {
    try {
      setLoading(true);
      const data = await getTransportesByOrdenCompraForTesoreria(ordenCompraId);
      setTransportes(data);
      
      // Inicializar formulario con pagos existentes
      const initialValues: any = {};
      data.forEach((transporte: TransporteAsignado) => {
        initialValues[`pagosTransporte_${transporte.id}`] = transporte.pagos?.map((pago: any) => ({
          date: pago.fechaPago ? dayjs(pago.fechaPago) : null,
          bank: pago.bancoPago || '',
          description: pago.descripcionPago || '',
          file: pago.archivoPago || null,
          amount: pago.montoPago || '',
          status: pago.estadoPago ? 'true' : 'false',
        })) || [];
        
        // Inicializar campos específicos de tipo y nota de pago por transporte
        initialValues[`tipoPagoTransporte_${transporte.id}`] = transporte.tipoPago || '';
        initialValues[`notaPagoTransporte_${transporte.id}`] = transporte.notaPago || '';
      });
      
      form.setFieldsValue(initialValues);
    } catch (error) {
      console.error('Error al cargar transportes:', error);
      notification.error({ message: 'Error al cargar los transportes' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransportPayments = async (transporteId: number) => {
    try {
      const values = form.getFieldsValue();
      const pagosTransporte = values[`pagosTransporte_${transporteId}`] || [];
      const tipoPago = values[`tipoPagoTransporte_${transporteId}`] || '';
      const notaPago = values[`notaPagoTransporte_${transporteId}`] || '';
      
      const paymentData = {
        pagos: pagosTransporte.map((pago: any) => ({
          fechaPago: pago.date?.toISOString(),
          bancoPago: pago.bank,
          descripcionPago: pago.description,
          archivoPago: pago.file,
          montoPago: Number(pago.amount) || 0,
          estadoPago: pago.status === 'true',
          activo: true
        })),
        updatesForTransporteAsignado: {
          tipoPago,
          notaPago
        }
      };

      await updatePagoTransporteFromTesoreria(transporteId, paymentData);
      notification.success({ message: 'Pagos de transporte guardados correctamente' });
      
      // Recargar datos
      await loadTransportes();
    } catch (error) {
      console.error('Error al guardar pagos de transporte:', error);
      notification.error({ message: 'Error al guardar los pagos de transporte' });
    }
  };

  const getTotalPagado = (pagos: any[]) => {
    return pagos?.reduce((total, pago) => total + (Number(pago.montoPago) || 0), 0) || 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Spin size="large" />
      </Box>
    );
  }

  if (transportes.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" p={4}>
            <LocalShipping sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay transportes asignados para esta orden de compra
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShipping />
        Pagos de Transporte
      </Typography>

      <Form form={form} layout="vertical">
        <Stack spacing={2}>
          {transportes.map((transporte) => {
            const totalPagado = getTotalPagado(transporte.pagos);
            const montoFlete = Number(transporte.montoFlete) || 0;
            const saldoPendiente = montoFlete - totalPagado;
            
            return (
              <Accordion
                key={transporte.id}
                expanded={expandedTransport === transporte.id}
                onChange={() => setExpandedTransport(
                  expandedTransport === transporte.id ? null : transporte.id
                )}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    bgcolor: '#a87bc7',
                    color: 'white',
                    borderRadius: '8px 8px 0 0',
                    '& .MuiAccordionSummary-content': { alignItems: 'center' }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {transporte.transporte.razonSocial}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        RUC: {transporte.transporte.ruc} | OP: {transporte.ordenProveedor.codigoOp}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Flete: {formatCurrency(montoFlete)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: saldoPendiente > 0 ? '#ffeb3b' : '#4caf50'
                        }}
                      >
                        Saldo: {formatCurrency(saldoPendiente)}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Información del transporte y proveedor */}
                    <Box 
                      sx={{ 
                        bgcolor: 'background.default',
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Información del Transporte
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Proveedor:</strong> {transporte.ordenProveedor.proveedor.razonSocial}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Orden de Proveedor:</strong> {transporte.ordenProveedor.codigoOp}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Monto del Flete:</strong> {formatCurrency(montoFlete)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: saldoPendiente > 0 ? 'warning.main' : 'success.main',
                          fontWeight: 600
                        }}
                      >
                        <strong>Saldo Pendiente:</strong> {formatCurrency(saldoPendiente)}
                      </Typography>
                    </Box>

                    {/* Lista de pagos */}
                    <PaymentsList
                      name={`pagosTransporte_${transporte.id}`}
                      tipoPagoName={`tipoPagoTransporte_${transporte.id}`}
                      notaPagoName={`notaPagoTransporte_${transporte.id}`}
                      title="Pagos del Transporte"
                      mode="edit"
                      color="#a87bc7"
                      required={false}
                      initialValue={[{
                        date: null,
                        bank: '',
                        description: '',
                        file: null,
                        amount: '',
                        status: 'false'
                      }]}
                    />

                    {/* Botón para guardar */}
                    <Box display="flex" justifyContent="flex-end" pt={2}>
                      <Button
                        variant="contained"
                        onClick={() => handleSaveTransportPayments(transporte.id)}
                        startIcon={<Payment />}
                        sx={{
                          bgcolor: '#a87bc7',
                          '&:hover': { bgcolor: '#9368b7' }
                        }}
                      >
                        Guardar Pagos
                      </Button>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </Form>
    </Box>
  );
};

export default TreasuryTransportPayments;
