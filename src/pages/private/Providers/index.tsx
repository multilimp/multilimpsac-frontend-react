import PageContent from '@/components/PageContent';
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { ProviderProps } from '@/services/providers/providers';
import { getProviders } from '@/services/providers/providers.request';
import ProvidersTable from './components/ProvidersTable';
import ProvidersModal from './components/ProvidersModal';

const Providers = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<ProviderProps>>([]);
  const [modal, setModal] = useState<ModalStateProps<ProviderProps>>(null);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getProviders();
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
      <ProvidersTable data={data} loading={loading} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? <ProvidersModal data={modal.data} handleReload={obtainData} handleClose={() => setModal(null)} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/providers/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainData} />
      ) : null}
    </PageContent>
  );
};

export default Providers;
