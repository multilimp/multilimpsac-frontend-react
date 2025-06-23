
// src/pages/treasurys/TreasurysPage.tsx
import PageContent from '@/components/PageContent';
import TreasurysTable from './components/TreasurysTable';
import TreasurysModal from './components/TreasurysModal';
import { TreasurysProps } from '@/services/treasurys/treasurys.d';
import ConfirmDelete from '@/components/ConfirmDelete';
import { Button } from '@mui/material';
import { notification, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { getSales } from '@/services/sales/sales.request';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ProviderOrdersListDrawer from '../ProviderOrders/components/ProviderOrdersListDrawer';

const TreasurysPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleProps[]>([]);
  // Inicializamos modal con un valor vacío para evitar errores con 'null'
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>({
    mode: ModalStateEnum.NONE,
    data: undefined
  });
  // Estado específico para el drawer de OPs (órdenes de proveedor)
  const [opDrawerModal, setOpDrawerModal] = useState<ModalStateProps<SaleProps>>({
    mode: ModalStateEnum.NONE,
    data: undefined
  });
  // Estado específico para el modal de TreasurysModal
  const [treasuryModal, setTreasuryModal] = useState<ModalStateProps<TreasurysProps>>({
    mode: ModalStateEnum.NONE,
    data: undefined
  });

  // Función para convertir SaleProps a TreasurysProps
  const convertSaleToTreasury = (sale: SaleProps): TreasurysProps => ({
    id: sale.id,
    saleCode: sale.codigoVenta || '',
    clientBusinessName: sale.cliente?.razonSocial || '',
    clientRuc: sale.cliente?.ruc || '',
    companyRuc: sale.empresa?.ruc || '',
    companyBusinessName: sale.empresa?.razonSocial || '',
    contact: sale.contactoCliente?.nombre || '',
    status: 'pending' as const
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
      // Convertir SaleProps a TreasurysProps para el modal de edición
      const treasuryData = convertSaleToTreasury(record);
      setTreasuryModal({ mode, data: treasuryData });
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
    } else if (mode === ModalStateEnum.DETAILS) {
      // Activar el drawer de OPs (órdenes de proveedor)
      setOpDrawerModal({ mode: ModalStateEnum.BOX, data: record });
    }
  };

  return (
    <PageContent
      component={(
        <Button
          variant="contained"
          color="primary"
          onClick={() => setTreasuryModal({ mode: ModalStateEnum.BOX, data: undefined })}
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
      {treasuryModal?.mode === ModalStateEnum.BOX && (
        <TreasurysModal
          data={treasuryModal.data}
          open={true}
          onClose={() => setTreasuryModal({ mode: ModalStateEnum.NONE, data: undefined })}
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

      {/* Drawer de Órdenes de Proveedor (OPs) - Replicado desde el módulo de OC */}
      {opDrawerModal?.mode === ModalStateEnum.BOX && opDrawerModal.data && (
        <ProviderOrdersListDrawer 
          handleClose={() => setOpDrawerModal({ mode: ModalStateEnum.NONE, data: undefined })} 
          data={opDrawerModal.data} 
        />
      )}
    </PageContent>
  );
};

export default TreasurysPage;
