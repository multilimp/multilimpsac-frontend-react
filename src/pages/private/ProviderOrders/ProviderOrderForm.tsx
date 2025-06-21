import { Empty, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { getOrderProviderById } from '@/services/providerOrders/providerOrders.requests';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';

const ProviderOrderForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const { providerOrderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<ProviderOrderProps | null>(null);
  const [loading, setLoading] = useState(false);
  
  const isEditing = Boolean(providerOrderId);

  useEffect(() => {
    setBlackBarKey(BlackBarKeyEnum.OP);
    
    if (isEditing) {
      // Modo edición: cargar datos de la OP
      loadOrderData();
    } else {
      // Modo creación: verificar que hay venta seleccionada
      if (!selectedSale) {
        message.error('Venta no seleccionada');
        navigate('/provider-orders');
        setBlackBarKey(null);
        return;
      }
    }

    return () => {
      if (!isEditing) {
        setSelectedSale(null);
      }
      setBlackBarKey(null);
    };
  }, [selectedSale, providerOrderId, isEditing]);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      const orderDetails = await getOrderProviderById(Number(providerOrderId));
      setOrderData(orderDetails);
      
      // En modo edición, establecer la venta desde los datos de la OP
      if (orderDetails.ordenCompra) {
        // Convertir los datos de la OP a formato SaleProps
        setSelectedSale(orderDetails.ordenCompra as any);
      }
    } catch (error) {
      console.error('Error al cargar los datos de la OP:', error);
      message.error('Error al cargar los datos de la orden de proveedor');
      navigate('/provider-orders');
    } finally {
      setLoading(false);
    }
  };

  // En modo edición, usar la venta de la OP cargada
  const saleToUse = isEditing ? (orderData?.ordenCompra as any) : selectedSale;

  return (
    <Stack direction="column" spacing={2}>
      {saleToUse ? (
        <ProviderOrderFormContent 
          sale={saleToUse} 
          orderData={orderData || undefined} 
          isEditing={isEditing}
        />
      ) : (
        <Empty description={loading ? "Cargando..." : "No hay datos disponibles"} />
      )}
    </Stack>
  );
};

export default ProviderOrderForm;
