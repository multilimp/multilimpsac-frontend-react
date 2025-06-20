import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Button, Typography, Box } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { notification } from 'antd';
import PageContent from '@/components/PageContent';
import { getOrderProviderById } from '@/services/providerOrders/providerOrders.requests';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';

const ProviderOrderEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<ProviderOrderProps | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const data = await getOrderProviderById(parseInt(id!));
      setOrderData(data);
    } catch (error) {
      notification.error({ message: 'Error al cargar los datos de la orden de proveedor' });
      navigate('/provider-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Por ahora solo navegar hacia el componente de edición usando el sale ID
    if (orderData?.ordenCompraId) {
      navigate(`/provider-orders/${orderData.ordenCompraId}/update`);
    }
  };

  if (!orderData && !loading) {
    return (
      <PageContent
        title="Orden de Proveedor no encontrada"
        component={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate('/provider-orders')}>
            Volver a Órdenes de Proveedor
          </Button>
        }
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6" color="textSecondary">
            La orden de proveedor solicitada no existe o no se pudo cargar.
          </Typography>
        </Box>
      </PageContent>
    );
  }

  // Crear un mock de sale data para que funcione con el componente existente
  const mockSaleData = {
    id: orderData?.ordenCompraId || 0,
    codigoVenta: orderData?.codigoOp || '',
    // Agregar otros campos mínimos necesarios
    cliente: {},
    empresa: {},
    contactoCliente: {},
    catalogoEmpresa: {},
  } as any;

  return (
    <PageContent
      title={`Orden de Proveedor: ${orderData?.codigoOp || 'Cargando...'}`}
      helper="ÓRDENES DE PROVEEDOR / DETALLE"
      component={
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/provider-orders')}
          >
            Volver
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Edit />} 
            onClick={handleEdit}
            color="primary"
            disabled={!orderData?.ordenCompraId}
          >
            Editar
          </Button>
        </Stack>
      }
    >
      <Stack direction="column" spacing={2}>
        {orderData ? (
          <ProviderOrderFormContent sale={mockSaleData} />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Typography variant="h6" color="textSecondary">
              Cargando datos de la orden de proveedor...
            </Typography>
          </Box>
        )}
      </Stack>
    </PageContent>
  );
};

export default ProviderOrderEdit;
