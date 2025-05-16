import { useEffect, useState } from 'react';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateProps } from '@/types/global';
import ProviderOrdersTable from './components/ProviderOrdersTable';
import { getSales } from '@/services/sales/sales.request';
import { notification } from 'antd';
import { ModalStateEnum } from '@/types/global.enum';
import ProviderOrdersListDrawer from './components/ProviderOrdersListDrawer';

const ProviderOrders = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaleProps[]>([]);
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      setData([...response]);
    } catch (error) {
      notification.error({
        message: 'Error al obtener ventas',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContent>
      <ProviderOrdersTable loading={loading} data={data} onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })} />

      {modal?.mode === ModalStateEnum.BOX && <ProviderOrdersListDrawer handleClose={() => setModal(null)} data={modal.data!} />}
    </PageContent>
  );
};

export default ProviderOrders;
