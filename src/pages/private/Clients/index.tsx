import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { Button } from '@mui/material';
import PageContent from '@/components/PageContent';
import { ClientProps } from '@/services/clients/client';
import { getClients } from '@/services/clients/client.requests';
import { ModalStateProps } from '@/types/global';
import { ModalStateEnum } from '@/types/global.enum';
import ClientsTable from './components/ClientsTable';
import ConfirmDelete from '@/components/ConfirmDelete';
import ClientsModal from './components/ClientsModal';

const Clients = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<ClientProps>>([]);
  const [modal, setModal] = useState<ModalStateProps<ClientProps>>(null);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getClients();
      setData([...res]);
    } catch (error) {
      notification.error({
        message: 'Ocurrió un error inesperado',
        description: `No se pudo obtener el listado de clientes. ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar cliente</Button>}>
      <ClientsTable data={data} loading={loading} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? <ClientsModal data={modal.data} handleReload={obtainData} handleClose={() => setModal(null)} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/clients/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainData} />
      ) : null}
    </PageContent>
  );
};

export default Clients;
