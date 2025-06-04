import React from 'react';
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
import { Form } from 'antd';
import DatePickerAntd from '@/components/DatePickerAnt';
import InputFile from '@/components/InputFile';
import { formatCurrency } from '@/utils/functions';

const TrackingsOrdersPage: React.FC = () => {
  const { trackingId } = useParams<{ trackingId: string }>();
  const [form] = Form.useForm();

  const submit = (vals: Record<string, string>) => {
    console.log(vals);
  };

  // Datos mock de órdenes de proveedor para el seguimiento
  const mockProviderOrders = [
    {
      id: 1,
      codigoOp: 'OP-2025-001',
      proveedor: {
        id: 1,
        ruc: '20123456789',
        razonSocial: 'Distribuidora Industrial SAC'
      },
      fechaDespacho: '2025-06-15',
      fechaRecepcion: '2025-06-10',
      fechaProgramada: '2025-06-12',
      totalProveedor: 15420.50,
      estado: 'En Proceso',
      productos: [
        {
          id: 1,
          codigo: 'DET-001',
          descripcion: 'Detergente Industrial Premium 5L',
          unidadMedida: 'Unidad',
          cantidad: 50,
          cantidadAlmacen: 45,
          cantidadTotal: 50,
          precioUnitario: 45.90,
          total: 2295.00
        },
        {
          id: 2,
          codigo: 'DES-001',
          descripcion: 'Desinfectante Multisuperficie 1L',
          unidadMedida: 'Unidad',
          cantidad: 100,
          cantidadAlmacen: 95,
          cantidadTotal: 100,
          precioUnitario: 32.50,
          total: 3250.00
        },
        {
          id: 3,
          codigo: 'JAB-001',
          descripcion: 'Jabón Líquido Antibacterial 500ml',
          unidadMedida: 'Unidad',
          cantidad: 200,
          cantidadAlmacen: 180,
          cantidadTotal: 200,
          precioUnitario: 28.90,
          total: 5780.00
        }
      ],
      transportes: [
        {
          id: 1,
          codigoTransporte: 'TRA-001',
          transporte: {
            id: 1,
            ruc: '20987654321',
            razonSocial: 'Logística Express SAC'
          },
          contactoTransporte: {
            id: 1,
            nombre: 'Carlos Mendoza',
            telefono: '987654321'
          },
          tipoDestino: 'CLIENTE',
          region: 'Lima',
          provincia: 'Lima',
          distrito: 'Miraflores',
          direccion: 'Av. Pardo 1234',
          montoFlete: 250.00,
          estadoPago: 'Pendiente',
          grt: 'GRT-2025-001'
        },
        {
          id: 2,
          codigoTransporte: 'TRA-002',
          transporte: {
            id: 2,
            ruc: '20876543210',
            razonSocial: 'Transportes del Sur EIRL'
          },
          contactoTransporte: {
            id: 2,
            nombre: 'Ana García',
            telefono: '976543210'
          },
          tipoDestino: 'ALMACEN',
          region: 'Arequipa',
          provincia: 'Arequipa',
          distrito: 'Cercado',
          direccion: 'Calle Industrial 567',
          montoFlete: 450.00,
          estadoPago: 'Pagado',
          grt: 'GRT-2025-002'
        }
      ]
    },
    {
      id: 2,
      codigoOp: 'OP-2025-002',
      proveedor: {
        id: 2,
        ruc: '20234567890',
        razonSocial: 'Suministros Químicos del Perú SAC'
      },
      fechaDespacho: '2025-06-20',
      fechaRecepcion: '2025-06-18',
      fechaProgramada: '2025-06-19',
      totalProveedor: 8750.00,
      estado: 'Completado',
      productos: [
        {
          id: 4,
          codigo: 'CER-001',
          descripcion: 'Cera para Pisos Alto Tránsito 4L',
          unidadMedida: 'Unidad',
          cantidad: 80,
          cantidadAlmacen: 80,
          cantidadTotal: 80,
          precioUnitario: 54.70,
          total: 4376.00
        },
        {
          id: 5,
          codigo: 'LIM-001',
          descripcion: 'Limpiador de Vidrios Concentrado 2L',
          unidadMedida: 'Unidad',
          cantidad: 120,
          cantidadAlmacen: 120,
          cantidadTotal: 120,
          precioUnitario: 19.90,
          total: 2388.00
        }
      ],
      transportes: [
        {
          id: 3,
          codigoTransporte: 'TRA-003',
          transporte: {
            id: 3,
            ruc: '20765432109',
            razonSocial: 'Cargo Solutions SAC'
          },
          contactoTransporte: {
            id: 3,
            nombre: 'Roberto Silva',
            telefono: '965432109'
          },
          tipoDestino: 'CLIENTE',
          region: 'Cusco',
          provincia: 'Cusco',
          distrito: 'San Blas',
          direccion: 'Jr. Comercio 890',
          montoFlete: 680.00,
          estadoPago: 'Pagado',
          grt: 'GRT-2025-003'
        }
      ]
    }
  ];  // Datos mock de orden de compra OCGRU660
  const mockPurchaseOrderOCGRU660: PurchaseOrderData = {
    codigo: 'OCGRU660',
    fecha: '20/10/2025',
    fechaMaxima: 'Jan 9, 2014',
    opImporteTotal: 'S/ 20580.34',
    ocImporteTotal: 'S/ 20580.34'
  };
  return (
    <PageContent
      title={`Seguimiento #${trackingId}`}
      component={
        <Button component={Link} to="/tracking" variant="outlined">
          ← Volver a Seguimientos
        </Button>
      }
    >
      {/* Sección Superior: Dos Columnas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>        {/* Columna Izquierda: Orden de Compra OCGRU660 */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Orden de Compra
          </Typography>
          
          <PurchaseOrderCard 
            data={mockPurchaseOrderOCGRU660}
            showAccordions={true}
            elevation={2}
          />
        </Grid>

        {/* Columna Derecha: Órdenes de Proveedor */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Órdenes de Proveedores
          </Typography>
          
          <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Stack spacing={2}>
              {mockProviderOrders.map((order) => (
                <Card key={order.id} elevation={1}>
                  <CardHeader
                    title={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight={600}>
                          {order.codigoOp}
                        </Typography>
                        <Chip 
                          label={order.estado} 
                          color={order.estado === 'Completado' ? 'success' : 'warning'}
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    }
                    subheader={
                      <Typography variant="body2" color="text.secondary">
                        <strong>Proveedor:</strong> {order.proveedor.razonSocial}
                      </Typography>
                    }
                    sx={{ pb: 1 }}
                  />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Total:</strong> {formatCurrency(order.totalProveedor)} | 
                      <strong> Productos:</strong> {order.productos.length} | 
                      <strong> Transportes:</strong> {order.transportes.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Entrega: {order.fechaProgramada}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
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
              </Grid>              <Box sx={{ textAlign: 'right', mt: 3 }}>
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
