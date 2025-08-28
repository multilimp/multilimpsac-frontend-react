import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { ModalStateProps } from '@/types/global';
import ProviderOrdersTable from './components/ProviderOrdersTable';
import { ModalStateEnum } from '@/types/global.enum';
import ProviderOrdersListDrawer from './components/ProviderOrdersListDrawer';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import OpTable from '../OpTables/components/OpTable';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const ProviderOrders = () => {
  const navigate = useNavigate();
  const { sales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useState('oc');

  // Estados para el tab de OP
  const [loadingOps, setLoadingOps] = useState(false);
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);

  const loadOps = async () => {
    try {
      setLoadingOps(true);
      const data = await getAllOrderProviders();
      setOps(data);
    } catch (error) {
      console.error('Error loading OPs:', error);
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoadingOps(false);
    }
  };

  useEffect(() => {
    // Cargar OPs cuando se cambie al tab de OP o al montar el componente
    if (activeTab === 'op') {
      loadOps();
    }
  }, [activeTab]);

  const handleOpRowClick = (op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  };

  return (
    <PageContent>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginBottom: 16 }}
      >
        <TabPane tab="Por OC" key="oc">
          <ProviderOrdersTable
            loading={loadingSales}
            data={sales}
            onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })}
          />
        </TabPane>

        <TabPane tab="Por OP" key="op">
          <OpTable
            loading={loadingOps}
            data={ops}
            onRowClick={handleOpRowClick}
            onReload={loadOps}
          />
        </TabPane>
      </Tabs>

      {modal?.mode === ModalStateEnum.BOX && (
        <ProviderOrdersListDrawer
          handleClose={() => setModal(null)}
          data={modal.data!}
        />
      )}
    </PageContent>
  );
};

export default ProviderOrders;
