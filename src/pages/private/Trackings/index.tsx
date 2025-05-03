import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { getTrackings } from '@/services/trackings/trackings.request';
import { ModalStateEnum } from '@/types/global.enum';
import { TrackingProps } from '@/services/trackings/trackings.d'; // Importación añadida
import TrackingsTable from './components/TrackingsTable';
import TrackingsModal from './components/TrackingsModal';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | TrackingProps;
};

const TrackingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    try {
      setLoading(true);
      const res = await getTrackings();
      setData(res);
    } catch (error) {
      notification.error({
        message: 'Error al cargar seguimientos',
        description: String(error),
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent
      title="Seguimientos"
      helper="DIRECTORIO / SEGUIMIENTOS"
      component={<Button onClick={() => setModal({ data: null, mode: ModalStateEnum.BOX })}>Nuevo Seguimiento</Button>}
    >
      <TrackingsTable data={data} loading={loading} />

      {modal?.mode === ModalStateEnum.BOX && (
        <TrackingsModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
        />
      )}
    </PageContent>
  );
};

export default TrackingsPage;