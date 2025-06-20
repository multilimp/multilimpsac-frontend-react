
// src/pages/treasurys/TreasurysPage.tsx
import PageContent from '@/components/PageContent';
import TreasurysTable from './components/TreasurysTable';
import TreasurysModal from './components/TreasurysModal';
import ConfirmDelete from '@/components/ConfirmDelete';
import { Button } from '@mui/material';
import { notification, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getSales } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';

const TreasurysPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleProps[]>([]);
  // Inicializamos modal con un valor vacío para evitar errores con 'null'
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>({
    mode: ModalStateEnum.NONE,
    data: undefined
  });

  useEffect(() => {
    obtainData();
  }, []);

  const obtainData = async () => {
    try {
      setLoading(true);
      const res = await getSales();
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
    record: SaleProps
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
              // await deleteTreasury(record.id); // TODO: Implementar delete en ventas service
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
          onClick={() => setModal({ mode: ModalStateEnum.BOX, data: undefined })}
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
          onClose={() => setModal({ mode: ModalStateEnum.NONE, data: undefined })}
          onReload={obtainData}
        />
      )}

      {/* ConfirmDelete para eliminar */}
      {modal?.mode === ModalStateEnum.DELETE && modal.data && (
        <ConfirmDelete
          endpoint={`/treasurys/${modal.data.id}`}
          handleClose={() => setModal({ mode: ModalStateEnum.NONE, data: undefined })}
          handleReload={obtainData}
        />
      )}
    </PageContent>
  );
};

export default TreasurysPage;
