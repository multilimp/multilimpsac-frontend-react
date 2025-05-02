import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { useEffect, useState } from 'react';
import { SaleProps } from '@/services/sales/sales';
import { notification } from 'antd';
import { getSales } from '@/services/sales/sales.request';
import { Button } from '@mui/material';
import SalesModal from './components/SalesModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = null | {
  mode: ModalStateEnum;
  data: null | SaleProps;
};

const SalesPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Array<SaleProps>>([]);
  const [modal, setModal] = useState<ModalStateType>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await getSales();
      setData(response ?? []);
    } catch (error) {
      notification.error({
        message: 'Error al obtener ventas',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleRefresh = () => {
    fetchSales();
  };

  const handleEdit = (sale: SaleProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: sale });
  };

  return (
    <PageContent
      title="Gestión de Ventas"
      helper="DIRECTORIO / VENTAS"
      component={
        <Button 
          variant="contained" 
          onClick={() => setModal({ mode: ModalStateEnum.BOX, data: null })}
        >
          Registrar Venta
        </Button>
      }
    >
      <SalesTable 
        data={data} 
        loading={loading} 
        onEdit={handleEdit}
        onRefresh={handleRefresh}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <SalesModal 
          data={modal.data} 
          open={true}
          onClose={() => setModal(null)}
          onSuccess={handleRefresh}
        />
      )}
    </PageContent>
  );
};

export default SalesPage;