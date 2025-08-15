import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ProviderOrderFormContent from './components/ProviderOrderFormContent';
import { BlackBarKeyEnum } from '@/types/global.enum';
import { getOrderProviderById } from '@/services/providerOrders/providerOrders.requests';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import ProviderOrderFormSkeleton from '@/components/ProviderOrderFormSkeleton';

const ProviderOrderForm = () => {
  const { selectedSale, setSelectedSale, setBlackBarKey } = useGlobalInformation();
  const { providerOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<ProviderOrderProps | null>(null);
  const [, setLoading] = useState(false);
  
  const isEditing = Boolean(providerOrderId);
  const fromTreasury = searchParams.get('from') === 'treasury';

  useEffect(() => {
    // 🔧 SOLO establecer BlackBarKey una vez al montar
    setBlackBarKey(BlackBarKeyEnum.OP);
        
    // 🔧 Limpiar BlackBarKey solo al desmontar
    return () => {
      setBlackBarKey(null);
    };
  }, [fromTreasury]); // ← Incluir fromTreasury para mostrar mensaje solo cuando cambie

  useEffect(() => {
    if (isEditing) {
      // Modo edición: cargar datos de la OP
      loadOrderData();
    } else {
      // Modo creación: verificar que hay venta seleccionada
      if (!selectedSale) {
        message.error('Venta no seleccionada');
        navigate('/provider-orders');
        return;
      }
    }
  }, [isEditing, providerOrderId]); // ← Dependencias mínimas

  useEffect(() => {
    // 🔧 Limpiar selectedSale solo cuando sea necesario
    return () => {
      if (!isEditing) {
        setSelectedSale(null);
      }
    };
  }, [isEditing]); // ← Solo depende de isEditing

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
          fromTreasury={fromTreasury}
        />
      ) : (
        <ProviderOrderFormSkeleton />
      )}
    </Stack>
  );
};

export default ProviderOrderForm;
