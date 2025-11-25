import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsProps, notification } from 'antd';
import { AccountBalance, Assignment, CalendarMonth } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { ModalStateProps } from '@/types/global';
import ProviderOrdersTable from './components/ProviderOrdersTable';
import { ModalStateEnum } from '@/types/global.enum';
import ProviderOrdersListDrawer from './components/ProviderOrdersListDrawer';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import OpTable from './components/OpTable';
import { useNavigate } from 'react-router-dom';
import ReporteProgramacion from '@/components/ReporteProgramacion';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const ProviderOrders = () => {
  const navigate = useNavigate();
  const { sales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useTabPersistenceString('oc'); // Persistir tab en URL

  // Estados para el tab de OP
  const [loadingOps, setLoadingOps] = useState(false);
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);
  const [opsLoaded, setOpsLoaded] = useState(false); // Flag para saber si ya se cargaron

  const loadOps = async (forceReload = false) => {
    // Si ya está cargado y no es forzado, no recargar
    if (opsLoaded && !forceReload) return;

    try {
      setLoadingOps(true);
      const data = await getAllOrderProviders();
      setOps(data);
      setOpsLoaded(true);
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
    // Cargar OPs solo la primera vez que se accede al tab
    if (activeTab === 'op' && !opsLoaded) {
      loadOps();
    }
  }, [activeTab, opsLoaded]);

  const handleOpRowClick = (op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  };

  // Filtrar ventas completadas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => sale.estadoVenta === 'COMPLETADO');
  }, [sales]);

  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'oc',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AccountBalance fontSize="small" />
          Tabla de Órdenes de Compra
        </span>
      ),
      children: (
        <ProviderOrdersTable
          loading={loadingSales}
          data={filteredSales}
          onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })}
        />
      )
    },
    {
      key: 'op',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Assignment fontSize="small" />
          Tabla OP
        </span>
      ),
      children: (
        <OpTable
          loading={loadingOps}
          data={ops}
          onRowClick={handleOpRowClick}
          onReload={() => loadOps(true)} // Forzar recarga cuando el usuario lo solicite
        />
      )
    },
    {
      key: 'cargos',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarMonth fontSize="small" />
          Reporte de Programación
        </span>
      ),
      children: <ReporteProgramacion />
    }
  ], [loadingSales, filteredSales, loadingOps, ops, handleOpRowClick, loadOps]);

  return (
    <PageContent>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginBottom: 16 }}
        items={tabItems}
      />

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