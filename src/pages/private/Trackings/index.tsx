import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import { SaleProps } from '@/services/sales/sales';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSales } from '@/services/sales/sales.request';
import { notification } from 'antd';

const TrackingsPage = () => {
  const router = useNavigate();
  const [trackings, setTrackings] = useState<SaleProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrackings();
  }, []);

  const loadTrackings = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setTrackings(data);
    } catch (error) {
      notification.error({ 
        message: 'Error al cargar seguimientos',
        description: 'No se pudieron cargar los datos de seguimiento'
      });
      console.error('Error al cargar trackings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRowClick = (data: SaleProps) => {
    console.log('Navegando a seguimiento:', data);
    router('/tracking/' + data.id);
  };

  return (
    <PageContent
      title="Seguimientos"
      helper="SEGUIMIENTO / ÓRDENES"
    >
      <TrackingsTable 
        data={trackings} 
        loading={loading} 
        onRowClick={onRowClick} 
      />
    </PageContent>
  );
};

export default TrackingsPage;
