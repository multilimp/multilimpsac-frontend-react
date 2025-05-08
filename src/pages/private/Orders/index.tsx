// src/pages/Orders/index.tsx
import PageContent from '@/components/PageContent';
import OrdersTable from './components/OrdersTable';
import { useEffect, useState } from 'react';
import { OrderProps } from '@/services/orders/orders';
import { getOrders } from '@/services/orders/orders.request';      // orders.request.ts
import { Button } from '@mui/material';
import OrdersModal from './components/OrdersModal';
import { ModalStateEnum } from '@/types/global.enum';

interface ModalStateType {
  mode: ModalStateEnum;
  data: OrderProps | null;
}

const OrdersPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrderProps[]>([]);
  const [modal, setModal] = useState<ModalStateType | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await getOrders();
      setData(resp);
    } catch (error) {
      console.error('Error fetching órdenes:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order: OrderProps | null) => {
    setModal({ mode: ModalStateEnum.BOX, data: order });
  };
  const closeModal = () => setModal(null);

  return (
    <PageContent
      title="Gestión de Órdenes"
      helper="DIRECTORIO / ÓRDENES"
      component={
        <Button variant="contained" onClick={() => openModal(null)}>
          Nueva Orden
        </Button>
      }
    >
      <OrdersTable data={data} loading={loading} onEdit={openModal} />

      {modal?.mode === ModalStateEnum.BOX && (
        <OrdersModal
          data={modal.data}
          open
          onClose={closeModal}
          onSuccess={fetchOrders}
        />
      )}
    </PageContent>
  );
};

export default OrdersPage;
