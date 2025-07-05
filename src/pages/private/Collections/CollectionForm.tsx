import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { notification, Spin } from 'antd';
import { getSaleById } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { BlackBarKeyEnum } from '@/types/global.enum';
import CollectionFormContent from './components/CollectionFormContent';

const CollectionForm = () => {
  const { saleId } = useParams<{ saleId: string }>();
  const [sale, setSale] = useState<SaleProps | null>(null);
  const [loading, setLoading] = useState(true);
  const { setSelectedSale, setBlackBarKey } = useGlobalInformation();

  useEffect(() => {
    if (saleId) {
      loadSale();
    }
  }, [saleId]);

  const loadSale = async () => {
    try {
      setLoading(true);
      const id = parseInt(saleId || '0', 10);
      const saleData = await getSaleById(id);
      
      setSale(saleData);
      
      // Configurar la barra negra con datos de la venta para cobranza
      setSelectedSale(saleData);
      setBlackBarKey(BlackBarKeyEnum.OP); // Usar OP para cobranzas como especificado
      
    } catch (error) {
      notification.error({
        message: 'Error al cargar la venta',
        description: 'No se pudo cargar la información de la venta para cobranza'
      });
      console.error('Error loading sale for collection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup: Limpiar barra negra al desmontar
  useEffect(() => {
    return () => {
      setBlackBarKey(null);
      setSelectedSale(null);
    };
  }, [setBlackBarKey, setSelectedSale]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>No se encontró la venta para cobranza</p>
      </div>
    );
  }

  return <CollectionFormContent sale={sale} />;
};

export default CollectionForm;
