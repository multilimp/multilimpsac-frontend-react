import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContent from '@/components/PageContent';
import { 
  Button, 
  Box, 
  Typography, 
  Card, 
  CardHeader, 
  CardContent, 
  Chip, 
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { Form, notification } from 'antd';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputFile from '@/components/InputFile';
import { formatCurrency } from '@/utils/functions';
import { getOrdenCompraByTreasuryId, getOpsByOrdenCompraForTreasury } from '@/services/treasury/treasury.request';
import { StepItemContent } from '../Sales/SalesPageForm/smallcomponents';
import TreasuryTransportPayments from './components/TreasuryTransportPayments';

const TreasuryOrdersPage: React.FC = () => {
  const { treasuryId } = useParams<{ treasuryId: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [ordenCompra, setOrdenCompra] = useState<any>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (treasuryId) {
      loadTreasuryData();
    }
  }, [treasuryId]);

  const loadTreasuryData = async () => {
    try {
      setLoading(true);
      const treasuryIdNum = parseInt(treasuryId!);
      
      // Cargar orden de compra
      const oc = await getOrdenCompraByTreasuryId(treasuryIdNum);
      if (oc) {
        setOrdenCompra(oc);
        
        // Cargar órdenes de proveedor relacionadas
        const ops = await getOpsByOrdenCompraForTreasury(oc.id);
        setOrdenesProveedor(ops);
      }
    } catch (error) {
      console.error('Error al cargar datos de tesorería:', error);
      notification.error({ message: 'Error al cargar los datos de tesorería' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Guardando datos de tesorería:', values);
      notification.success({ message: 'Datos de tesorería guardados correctamente' });
    } catch (error) {
      console.error('Error al guardar:', error);
      notification.error({ message: 'Error al guardar los datos' });
    }
  };

  return (
    <PageContent
      title={`Gestión de Tesorería - OC ${ordenCompra?.codigoVenta || treasuryId}`}
      helper="TESORERÍA / GESTIÓN DE PAGOS"
      component={
        <Link to="/treasury">
          <Button variant="outlined">← Volver a Tesorería</Button>
        </Link>
      }
    >
      <Box display="flex" gap={3} flexDirection={{ xs: 'column', lg: 'row' }}>
        {/* Información de la Orden de Compra */}
        <Box width={{ xs: '100%', lg: '400px' }} flexShrink={0}>
          <StepItemContent
            headerLeft={ordenCompra?.fechaEmision ? new Date(ordenCompra.fechaEmision).toLocaleDateString() : ''}
            headerRight={`ID: ${ordenCompra?.id || ''}`}
            children
          />
        </Box>

        {/* Gestión de Pagos */}
        <Box flex={1}>
          <Card>
            <CardHeader 
              title="Gestión de Pagos de Tesorería"
              subheader="Administra los pagos relacionados con esta orden de compra"
            />
            <CardContent>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* Información de la Orden */}
                <Box display="flex" gap={3} sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Monto de Venta
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(parseFloat(ordenCompra?.montoVenta || '0'))}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estado de Pago
                    </Typography>
                    <Chip 
                      label={ordenCompra?.estadoTesoreria || 'Pendiente'} 
                      color="warning" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>

                {/* Órdenes de Proveedor */}
                {ordenesProveedor.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Órdenes de Proveedor ({ordenesProveedor.length})
                    </Typography>
                    <Stack spacing={2}>
                      {ordenesProveedor.map((op: any) => (
                        <Card key={op.id} variant="outlined">
                          <CardContent>
                            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                              <Box>
                                <Typography variant="subtitle2">
                                  Código OP: {op.codigoOp}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Proveedor: {op.proveedor?.razonSocial}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Total: {formatCurrency(parseFloat(op.totalProveedor || '0'))}
                                </Typography>
                              </Box>
                              <Box>
                                <Chip 
                                  label={op.estadoOp || 'Pendiente'} 
                                  size="small"
                                  color="default"
                                />
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ✅ NUEVO: Tabs para diferentes tipos de pagos */}
                <Box sx={{ mb: 3 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                  >
                    <Tab label="Pagos Generales" />
                    <Tab label="Pagos de Transporte" />
                  </Tabs>

                  {/* Panel de Pagos Generales */}
                  {activeTab === 0 && (
                    <Stack spacing={2}>
                      <Box display="flex" gap={2}>
                        <Box flex={1}>
                          <Form.Item
                            name="fechaPago"
                            label="Fecha de Pago"
                            rules={[{ required: true, message: 'Fecha requerida' }]}
                          >
                            <DatePickerAntd label="Fecha de Pago" placeholder="Seleccionar fecha" />
                          </Form.Item>
                        </Box>
                        <Box flex={1}>
                          <Form.Item
                            name="montoPago"
                            label="Monto de Pago"
                            rules={[{ required: true, message: 'Monto requerido' }]}
                          >
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                              }}
                            />
                          </Form.Item>
                        </Box>
                      </Box>
                      
                      <Form.Item
                        name="comprobantePago"
                        label="Comprobante de Pago"
                      >
                        <InputFile 
                          accept="pdf"
                        />
                      </Form.Item>
                      
                      <Form.Item
                        name="observaciones"
                        label="Observaciones"
                      >
                        <textarea
                          placeholder="Notas adicionales sobre el pago..."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            resize: 'vertical',
                          }}
                        />
                      </Form.Item>
                    </Stack>
                  )}

                  {/* Panel de Pagos de Transporte */}
                  {activeTab === 1 && ordenCompra && (
                    <TreasuryTransportPayments ordenCompraId={ordenCompra.id} />
                  )}
                </Box>

                <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                  <Button variant="outlined" onClick={() => form.resetFields()}>
                    Limpiar
                  </Button>
                  <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Pago'}
                  </Button>
                </Box>
              </Form>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </PageContent>
  );
};

export default TreasuryOrdersPage;
