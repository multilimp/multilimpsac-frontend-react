import React, { useEffect, useState } from 'react';
import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { notification } from 'antd';
import { getTrackings, createTracking, updateTracking, deleteTracking } from '@/services/trackings/trackings.request';
import { TrackingProps } from '@/services/trackings/trackings.d';
import { ModalStateEnum } from '@/types/global.enum';
import TrackingsTable from './components/TrackingsTable';
import TrackingsModal from './components/TrackingsModal';
import TrackingsDetailDrawer from './components/TrackingsDetailDrawer';

type ModalStateType = { mode: ModalStateEnum; data: TrackingProps | null } | null;

const TrackingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackingProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);
  const [drawerRecord, setDrawerRecord] = useState<TrackingProps | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getTrackings();
      setData(res);
    } catch (err) {
      notification.error({ message: 'Error al cargar seguimientos', description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (values: Omit<TrackingProps, 'id'>, id?: number) => {
    setLoading(true);
    try {
      if (id != null) {
        await updateTracking(id, values);
        notification.success({ message: 'Seguimiento actualizado' });
      } else {
        await createTracking(values);
        notification.success({ message: 'Seguimiento creado' });
      }
      fetch();
      setModal(null);
    } catch (err) {
      notification.error({ message: 'Error al guardar', description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row: TrackingProps) => {
    setLoading(true);
    try {
      await deleteTracking(row.id);
      notification.success({ message: 'Seguimiento eliminado' });
      fetch();
    } catch (err) {
      notification.error({ message: 'Error al eliminar', description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent
      component={
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModal({ data: null, mode: ModalStateEnum.BOX })}
        >
          Nuevo Seguimiento
        </Button>
      }
    >
      <TrackingsTable
        data={data}
        loading={loading}
        onEdit={(row) => setModal({ data: row, mode: ModalStateEnum.BOX })}
        onDelete={handleDelete}
        onRowClick={(row) => setDrawerRecord(row)}
      />

      {/* Modal de creación / edición */}
      {modal?.mode === ModalStateEnum.BOX && (
        <TrackingsModal
          data={modal.data}
          open
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Drawer de detalle */}
      {drawerRecord && (
        <TrackingsDetailDrawer
          data={drawerRecord}
          open
          onClose={() => setDrawerRecord(null)}
        />
      )}
    </PageContent>
  );
};

export default TrackingsPage;
