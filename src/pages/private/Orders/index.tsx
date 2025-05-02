
import PageContent from '@/components/PageContent';
import OrdersTable from './components/OrdersTable';
import { useEffect, useState } from 'react';
import { OrderProps } from '@/services/orders/orders';
import { getOrders } from '@/services/orders/orders.request';
import { Button } from '@mui/material';
import OrdersModal from './components/OrdersModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | OrderProps;
};

const OrdersPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrderProps[]>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setData(response); // Acepta cualquier respuesta sin validar
    } catch (error) {
      console.error('Error:', error);
      setData([]); // Falla silenciosamente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleEdit = (order: OrderProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: order });
  };

  return (
    <PageContent
      title="Gestión de Órdenes"
      helper="DIRECTORIO / ÓRDENES"
      component={
        <Button 
          variant="contained" 
          onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
        >
          Nueva Orden
        </Button>
      }
    >
      <OrdersTable 
        data={data} 
        loading={loading} 
        onEdit={handleEdit}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <OrdersModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
          onSuccess={handleRefresh}
        />
      )}
    </PageContent>
  );
};

export default OrdersPage;
