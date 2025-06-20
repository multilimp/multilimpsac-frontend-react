import PageContent from '@/components/PageContent';
import CollectionsTable from './components/CollectionsTable';
import { CollectionProps } from './components/CollectionsTable';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCollections } from '@/services/collections/collections.request';
import { notification } from 'antd';
import { ModalStateEnum } from '@/types/global.enum';

const CollectionsPage = () => {
  const router = useNavigate();
  const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const data = await getCollections();
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

  const onRecordAction = (action: ModalStateEnum, data: CollectionProps) => {
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