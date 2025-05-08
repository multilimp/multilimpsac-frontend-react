// src/pages/BillingsPage.tsx
import React, { useEffect, useState } from 'react';
import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { notification } from 'antd';
import {
  getBillings,
  createBilling,
  updateBilling,
} from '@/services/billings/billings.request';
import { BillingProps } from '@/services/billings/billings.d';
import { ModalStateEnum } from '@/types/global.enum';
import BillingsTable from './components/BillingsTable';
import BillingsModal from './components/BillingsModal';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: BillingProps | null;
};

const BillingsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<BillingProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchBillings = async () => {
    setLoading(true);
    try {
      const res = await getBillings();
      setData(res);
    } catch (error) {
      notification.error({
        message: 'Error al cargar facturas',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  const handleSave = async (values: Omit<BillingProps, 'id'>, id?: number) => {
    setLoading(true);
    try {
      if (id !== undefined) {
        await updateBilling(id, values);
        notification.success({ message: 'Factura actualizada' });
      } else {
        await createBilling(values);
        notification.success({ message: 'Factura creada' });
      }
      await fetchBillings();
      setModal(null);
    } catch (error) {
      notification.error({ message: 'Error al guardar', description: String(error) });
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
          Nueva Factura
        </Button>
      }
    >
      <BillingsTable data={data} loading={loading} />

      {modal?.mode === ModalStateEnum.BOX && (
        <BillingsModal
          data={modal.data}
          open
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </PageContent>
  );
};

export default BillingsPage;
