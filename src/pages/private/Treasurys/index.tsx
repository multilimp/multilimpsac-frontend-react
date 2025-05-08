// src/pages/treasurys/TreasurysPage.tsx
import PageContent from '@/components/PageContent';
import TreasurysTable from './components/TreasurysTable';
import TreasurysModal from './components/TreasurysModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import { Button } from '@mui/material';
import { notification, Modal } from 'antd'; // Asegúrate de importar Modal correctamente
import { useEffect, useState } from 'react';
import {
  getTreasurys,
  deleteTreasury,
} from '@/services/treasurys/treasurys.request';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';

const TreasurysPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TreasurysProps[]>([]);
  // Inicializamos modal con un valor vacío para evitar errores con 'null'
  const [modal, setModal] = useState<ModalStateProps<TreasurysProps> | null>(null);

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getTreasurys();
      setData([...res]);
    } catch (error) {
      notification.error({
        message: 'Ocurrió un error inesperado',
        description: `No se pudo obtener el listado de tesorería. ${String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAction = (
    mode: ModalStateEnum,
    record: TreasurysProps
  ) => {
    if (mode === ModalStateEnum.BOX) {
      setModal({ mode, data: record });
    } else if (mode === ModalStateEnum.DELETE) {
      // Usamos Modal.confirm correctamente para eliminar
      Modal.confirm({
        title: '¿Eliminar registro de tesorería?',
        onOk: async () => {
          try {
            if (record.id) {
              await deleteTreasury(record.id); // Asegúrate de que deleteTreasury esté correctamente importado
              notification.success({ message: 'Registro eliminado' });
              obtainData();
            }
          } catch (e) {
            notification.error({
              message: 'Error al eliminar',
              description: String(e),
            });
          }
        },
      });
    }
  };

  return (
    <PageContent
      component={(
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
        >
          Agregar
        </Button>
      )}
    >
      <TreasurysTable
        data={data}
        loading={loading}
        onRecordAction={handleRecordAction}
      />

      {/* Modal de crear/editar */}
      {modal?.mode === ModalStateEnum.BOX && (
        <TreasurysModal
          data={modal.data}
          open={true}
          onClose={() => setModal(null)}
          onReload={obtainData}
        />
      )}

      {/* ConfirmDelete para eliminar */}
      {modal?.mode === ModalStateEnum.DELETE && modal.data && (
        <ConfirmDelete
          endpoint={`/treasurys/${modal.data.id}`}
          handleClose={() => setModal(null)}
          handleReload={obtainData}
        />
      )}
    </PageContent>
  );
};

export default TreasurysPage;
