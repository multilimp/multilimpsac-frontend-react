import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { getOrderProvidersByOC } from '@/services/providerOrders/providerOrders.requests';
import { SaleProps } from '@/services/sales/sales';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Drawer, Stack } from '@mui/material';
import { Empty, notification, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProviderOrdersListDrawerProps {
  handleClose: VoidFunction;
  data: SaleProps;
}

const ProviderOrdersListDrawer = ({ handleClose, data }: ProviderOrdersListDrawerProps) => {
  const { setSelectedSale } = useGlobalInformation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderProvidersCodes, setOrderProvidersCodes] = useState<Array<{ id: number; codigoOp: string }>>([]);

  useEffect(() => {
    handleGetData();
  }, []);

  const handleSelected = (id?: number) => {
    if (!id) {
      // Crear nueva OP
      setSelectedSale(data);
      navigate('/provider-orders/create');
    } else {
      // Ver detalle de OP existente - navegar a la nueva ruta
      navigate(`/provider-orders/${id}`);
    }
  };

  const handleGetData = async () => {
    try {
      setLoading(true);
      const res = await getOrderProvidersByOC(data.id);
      setOrderProvidersCodes([...res]);
    } catch (error) {
      notification.error({ message: 'No se logró obtener la información' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open onClose={handleClose}>
      <Card sx={{ borderRadius: 0, width: { xs: '100%', sm: 400 } }} variant="outlined">
        <CardHeader title="OPs DE LA ORDEN DEL COMPRA" slotProps={{ title: { fontWeight: 700, fontSize: 20, textAlign: 'center' } }} />
        <CardContent sx={{ height: 'calc((100vh) - 225px)', overflow: 'auto', pt: 0.1 }}>
          <Spin spinning={loading}>
            {orderProvidersCodes.length ? (
              <Stack direction="column" spacing={2}>
                {orderProvidersCodes.map((item, index) => (
                  <Card key={index + 1} variant="outlined">
                    <CardHeader title={item.codigoOp} slotProps={{ title: { textAlign: 'center', fontSize: 20, fontWeight: 700 } }} />
                    <CardActions>
                      <Button
                        fullWidth
                        size="small"
                        color="info"
                        variant="outlined"
                        startIcon={<RemoveRedEye />}
                        onClick={() => handleSelected(item.id)}
                      >
                        VER DETALLE
                      </Button>
                      <Button fullWidth size="small" color="error" variant="outlined" endIcon={<Delete />} disabled>
                        ELIMINAR
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Empty description="No hay órdenes de proveedor para esta venta" />
            )}
          </Spin>
        </CardContent>

        <CardActions sx={{ flexDirection: 'column', gap: 2 }}>
          <Button fullWidth onClick={() => handleSelected()}>
            AGREGAR OP
          </Button>
          <Button fullWidth color="error" variant="outlined" onClick={handleClose}>
            CERRAR
          </Button>
        </CardActions>
      </Card>
    </Drawer>
  );
};

export default ProviderOrdersListDrawer;
