import { SaleProps } from '@/services/sales/sales';
import { Delete, RemoveRedEye } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Drawer, Stack } from '@mui/material';
import { Empty } from 'antd';
import { Link } from 'react-router-dom';

interface ProviderOrdersListDrawerProps {
  handleClose: VoidFunction;
  data: SaleProps;
}

const ProviderOrdersListDrawer = ({ handleClose, data }: ProviderOrdersListDrawerProps) => {
  console.log(data);

  return (
    <Drawer anchor="right" open onClose={handleClose}>
      <Card sx={{ borderRadius: 0, width: 400 }} variant="outlined">
        <CardHeader title="DETALLE DE LA ÓRDEN DEL PROVEEDOR" slotProps={{ title: { fontWeight: 700, fontSize: 20, textAlign: 'center' } }} />
        <CardContent sx={{ height: 'calc((100vh) - 225px)', overflow: 'auto', pt: 0.1 }}>
          {!data.ordenesProveedor.length ? (
            <Stack direction="column" spacing={2}>
              {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                <Card key={index}>
                  <CardHeader title="OP-GRU-1441-1" slotProps={{ title: { textAlign: 'center', fontSize: 20, fontWeight: 700 } }} />
                  <CardActions>
                    <Button
                      fullWidth
                      size="small"
                      color="info"
                      variant="outlined"
                      startIcon={<RemoveRedEye />}
                      component={Link}
                      to={`/provider-orders/${item}`}
                    >
                      VER DETALLE
                    </Button>
                    <Button fullWidth size="small" color="error" variant="outlined" endIcon={<Delete />}>
                      ELIMINAR
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          ) : (
            <Empty description="No hay órdenes de proveedor para esta venta" />
          )}
        </CardContent>
        <CardActions sx={{ flexDirection: 'column', gap: 2 }}>
          <Button fullWidth>AGREGAR OP</Button>
          <Button fullWidth color="error" variant="outlined">
            CERRAR
          </Button>
        </CardActions>
      </Card>
    </Drawer>
  );
};

export default ProviderOrdersListDrawer;
