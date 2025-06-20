import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContent from '@/components/PageContent';
import PurchaseOrderCard from '@/components/PurchaseOrderCard';
import { PurchaseOrderData } from '@/types/purchaseOrder';
import { 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent, 
  Chip, 
  Stack
} from '@mui/material';
import { Form, notification } from 'antd';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputFile from '@/components/InputFile';
import { formatCurrency } from '@/utils/functions';
import { getOrdenCompraByTrackingId, getOpsByOrdenCompra } from '@/services/trackings/trackings.request';

const TrackingsOrdersPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [ordenCompra, setOrdenCompra] = useState<any>(null);
  const [ordenesProveedor, setOrdenesProveedor] = useState<any[]>([]);

  useEffect(() => {
    if (trackingId) {
      loadTrackingData();
    }
  }, [trackingId]);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      const trackingIdNum = parseInt(trackingId!);
      
      // Cargar orden de compra
      const oc = await getOrdenCompraByTrackingId(trackingIdNum);
      if (oc) {
        setOrdenCompra(oc);
        
        // Cargar órdenes de proveedor relacionadas
        const ops = await getOpsByOrdenCompra(oc.id);
        setOrdenesProveedor(ops);
      }
    } catch (error) {
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar los datos del seguimiento'
      });
      console.error('Error al cargar tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submit = (vals: Record<string, string>) => {
    console.log('Datos del formulario:', vals);
    notification.success({
      message: 'Información procesada',
      description: 'Los datos de seguimiento han sido actualizados'
    });
  };

  // Datos para PurchaseOrderCard
  const purchaseOrderData: PurchaseOrderData | null = ordenCompra ? {
    codigo: ordenCompra.codigoVenta || 'N/A',
    fecha: new Date(ordenCompra.createdAt || Date.now()).toLocaleDateString(),
    fechaMaxima: new Date(ordenCompra.fechaMaxForm || Date.now()).toLocaleDateString(),
    opImporteTotal: formatCurrency(
      ordenesProveedor.reduce((sum, op) => sum + parseFloat(op.totalProveedor || '0'), 0)
    ),
    ocImporteTotal: formatCurrency(parseFloat(ordenCompra.montoVenta || '0'))
  } : null;

  if (loading) {
    return (
      <PageContent
        title={`Seguimiento #${trackingId}`}
        component={
          <Button component={Link} to="/tracking" variant="outlined">
            ← Volver a Seguimientos
          </Button>
        }
      >
        <Typography>Cargando datos del seguimiento...</Typography>
      </PageContent>
    );
  }

  if (!ordenCompra) {
    return (
      <PageContent
        title={`Seguimiento #${trackingId}`}
        component={
          <Button component={Link} to="/tracking" variant="outlined">
            ← Volver a Seguimientos
          </Button>
        }
      >
        <Typography>No se encontraron datos para este seguimiento.</Typography>
      </PageContent>
    );
  }

  return (
    <PageContent
      title={`Seguimiento #${trackingId} - ${ordenCompra.codigoVenta}`}
      component={
        <Button component={Link} to="/tracking" variant="outlined">
          ← Volver a Seguimientos
        </Button>
      }
    >
      {/* Sección Superior: Dos Columnas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Columna Izquierda: Orden de Compra */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Orden de Compra
          </Typography>
          
          {purchaseOrderData && (
            <PurchaseOrderCard 
              data={purchaseOrderData}
              showAccordions={true}
              elevation={2}
            />
          )}

          {/* Información adicional de la OC */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Cliente:</strong> {ordenCompra.cliente?.razonSocial || 'N/A'}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>RUC Cliente:</strong> {ordenCompra.cliente?.ruc || 'N/A'}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Empresa:</strong> {ordenCompra.empresa?.razonSocial || 'N/A'}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Lugar de Entrega:</strong> {ordenCompra.direccionEntrega || 'N/A'}
              </Typography>
              <Typography variant="subtitle2">
                <strong>Referencia:</strong> {ordenCompra.referenciaEntrega || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Columna Derecha: Órdenes de Proveedor */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Órdenes de Proveedores ({ordenesProveedor.length})
          </Typography>
          
          <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Stack spacing={2}>
              {ordenesProveedor.length > 0 ? (
                ordenesProveedor.map((order) => (
                  <Card key={order.id} elevation={1}>
                    <CardHeader
                      title={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight={600}>
                            {order.codigoOp || `OP-${order.id}`}
                          </Typography>
                          <Chip 
                            label={order.estadoOp || 'Pendiente'} 
                            color={order.estadoOp === 'COMPLETADO' ? 'success' : 'warning'}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                      }
                      subheader={
                        <Typography variant="body2" color="text.secondary">
                          <strong>Proveedor:</strong> {order.proveedor?.razonSocial || 'N/A'}
                        </Typography>
                      }
                      sx={{ pb: 1 }}
                    />
                    <CardContent sx={{ pt: 0 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>Total:</strong> {formatCurrency(parseFloat(order.totalProveedor || '0'))} | 
                        <strong> Productos:</strong> {order.productos?.length || 0} | 
                        <strong> Transportes:</strong> {order.transportesAsignados?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Entrega: {order.fechaProgramada ? new Date(order.fechaProgramada).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No hay órdenes de proveedor registradas para esta OC
                </Typography>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Sección Inferior: Información de Seguimiento */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Información de Seguimiento
        </Typography>
        <Card elevation={2}>
          <CardContent>
            <Form form={form} layout="vertical" onFinish={submit}>
              <Typography variant="h6" align="center" sx={{ fontWeight: 700, mb: 3 }}>
                OC CONFORME
              </Typography>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid size={{ xs: 12, md: 4 }}>
                  <Form.Item name="deliveryDateOC" label="FECHA DE ENTREGA OC" rules={[{ required: true, message: 'Selecciona fecha' }]}>
                    <DatePickerAntd label="Fecha de entrega OC" />
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Form.Item name="oceFile" label="Subir Archivo" rules={[{ required: true, message: 'Selecciona un PDF' }]}>
                    <InputFile label="Subir archivo" accept="pdf" onChange={(file) => form.setFieldValue('oceFile', file)} />
                  </Form.Item>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Form.Item name="peruPurchasesDate" label="FECHA PERÚ COMPRAS" rules={[{ required: true, message: 'Selecciona fecha' }]}>
                    <DatePickerAntd label="Fecha Perú Compras" />
                  </Form.Item>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: 'right', mt: 3 }}>
                <Button type="submit" variant="contained" color="primary">
                  Procesar
                </Button>
              </Box>
            </Form>
          </CardContent>
        </Card>
      </Box>
    </PageContent>
  );
};

export default TrackingsOrdersPage;
