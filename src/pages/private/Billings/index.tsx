import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { notification } from 'antd';
import { useEffect, useState } from 'react';
import { getBillings } from '@/services/billings/billings.request';
import { BillingProps } from '@/services/billings/billings.d';
import { ModalStateEnum } from '@/types/global.enum';
import BillingsTable from './components/BillingsTable';
import BillingsModal from './components/BillingsModal';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | BillingProps;
};

const BillingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<BillingProps>>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const res = await getBillings();
      setData(Array.isArray(res) ? res : []);
    } catch (error) {
      notification.error({
        message: 'Error al cargar facturas',
        description: String(error),
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent
      title="Facturación"
      helper="DIRECTORIO / FACTURACIÓN"
      component={<Button onClick={() => setModal({ data: null, mode: ModalStateEnum.BOX })}>Nueva Factura</Button>}
    >
      <BillingsTable data={data} loading={loading} />

      {modal?.mode === ModalStateEnum.BOX && (
        <BillingsModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
        />
      )}
    </PageContent>
  );
};

export default BillingsPage;