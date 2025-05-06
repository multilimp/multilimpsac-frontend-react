import PageContent from '@/components/PageContent';
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { getTransports } from '@/services/transports/transports.request';
import TransportsTable from './components/TransportsTable';
import TransportsModal from './components/TransportsModal';
import { TransportProps } from '@/services/transports/transports';

const Transports = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<TransportProps>>([]);
  const [modal, setModal] = useState<ModalStateProps<TransportProps>>(null);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getTransports();
      setData([...res]);
    } catch (error) {
      notification.error({
        message: 'Ocurrió un error inesperado',
        description: `No se pudo obtener el listado de empresas. ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <TransportsTable data={data} loading={loading} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? <TransportsModal data={modal.data} handleReload={obtainData} handleClose={() => setModal(null)} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/transports/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainData} />
      ) : null}
    </PageContent>
  );
};

export default Transports;
