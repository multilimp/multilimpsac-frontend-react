import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { getTreasurys } from '@/services/treasurys/treasurys.request';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { ModalStateEnum } from '@/types/global.enum';
import TreasurysTable from './components/TreasurysTable';
import TreasurysModal from './components/TreasurysModal';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | TreasurysProps;
};

const TreasurysPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<TreasurysProps>>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  useEffect(() => {
    obtainTreasurys();
  }, []);

  const obtainTreasurys = async () => {
    try {
      setLoading(true);
      const res = await getTreasurys();
      setData(Array.isArray(res) ? res : []); // Doble verificación
    } catch (error) {
      notification.error({
        message: 'Ocurrió un error inesperado',
        description: `No se pudo obtener el listado. ${String(error)}`,
      });
      setData([]); // Asegura array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent
      title="Tesorería"
      helper="DIRECTORIO / TESORERÍA"
      component={<Button onClick={() => setModal({ data: null, mode: ModalStateEnum.BOX })}>Agregar</Button>}
    >
      <TreasurysTable data={data} loading={loading} />

      {modal?.mode === ModalStateEnum.BOX && (
        <TreasurysModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
        />
      )}
    </PageContent>
  );
};

export default TreasurysPage;