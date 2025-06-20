import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notification, Spin } from 'antd';
import { Stack, Typography, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { getOrderProviderById } from '@/services/providerOrders/providerOrders.requests';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import ProviderOrderDetailContent from './components/ProviderOrderDetailContent';
import PageContent from '@/components/PageContent';

const ProviderOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<ProviderOrderProps | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await getOrderProviderById(Number(id));
      setOrderData(data);
    } catch (error) {
      notification.error({ message: 'Error al cargar el detalle de la orden de proveedor' });
      navigate('/provider-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/provider-orders');
  };

  if (loading) {
    return (
      <PageContent 
        title="Cargando..." 
        helper="PROVEEDOR / ÓRDENES"
        component={null}
      >
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
          <Spin size="large" />
          <Typography>Cargando detalle de la orden de proveedor...</Typography>
        </Stack>
      </PageContent>
    );
  }

  if (!orderData) {
    return (
      <PageContent 
        title="Error" 
        helper="PROVEEDOR / ÓRDENES"
        component={
          <Button startIcon={<ArrowBack />} onClick={handleGoBack} variant="outlined">
            Volver
          </Button>
        }
      >
        <Stack direction="column" spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
          <Typography variant="h6">Orden de proveedor no encontrada</Typography>
        </Stack>
      </PageContent>
    );
  }

  return (
    <PageContent 
      title={`Detalle OP: ${orderData.codigoOp}`}
      helper="PROVEEDOR / ÓRDENES"
      component={
        <Button startIcon={<ArrowBack />} onClick={handleGoBack} variant="outlined">
          Volver a Órdenes
        </Button>
      }
    >
      <ProviderOrderDetailContent orderData={orderData} />
    </PageContent>
  );
};

export default ProviderOrderDetail;
