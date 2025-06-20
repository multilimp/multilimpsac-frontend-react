import PageContent from '@/components/PageContent';
import CollectionsTable from './components/CollectionsTable';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSales } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { notification } from 'antd';
import { ModalStateEnum } from '@/types/global.enum';

const CollectionsPage = () => {
  const router = useNavigate();
  const [collections, setCollections] = useState<SaleProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setCollections(data);
    } catch (error) {
      notification.error({ 
        message: 'Error al cargar cobranzas',
        description: 'No se pudieron cargar los datos de cobranza'
      });
      console.error('Error al cargar collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRecordAction = (action: ModalStateEnum, data: SaleProps) => {
    console.log('Acción en cobranza:', action, data);
    if (action === ModalStateEnum.DETAILS) {
      router('/collections/' + data.id);
    }
  };

  return (
    <PageContent
      title="Cobranzas"
      helper="COBRANZA / ÓRDENES"
    >
      <CollectionsTable 
        data={collections} 
        loading={loading} 
        onRecordAction={onRecordAction} 
      />
    </PageContent>
  );
};

export default CollectionsPage;