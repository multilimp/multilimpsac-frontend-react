import { useEffect, useState } from 'react';
import PageContent from '@/components/PageContent';
import { notification } from 'antd';
import TrackingsTable from './components/TrackingsTable';
import { getSales } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { useNavigate } from 'react-router-dom';

const TrackingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleProps[]>([]);
  const router = useNavigate();

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getSales();
      setData(res);
    } catch (err) {
      notification.error({ message: 'Error al cargar seguimientos', description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const onRowClick = (data: SaleProps) => {
    console.log('Row clicked', data);
    router('/tracking/' + data.id);
  };

  return (
    <PageContent>
      <TrackingsTable data={data} loading={loading} onRowClick={onRowClick} />
    </PageContent>
  );
};

export default TrackingsPage;
