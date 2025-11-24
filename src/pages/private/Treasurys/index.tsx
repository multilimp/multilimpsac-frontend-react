import { useState, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Dashboard, Assignment, AccountBalance } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import { SaleProps } from '@/services/sales/sales';
import { ModalStateProps } from '@/types/global';
import { ModalStateEnum } from '@/types/global.enum';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useAppContext } from '@/context';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import TreasurysTable from './components/TreasurysTable';
import SalesTable from './components/SalesTable';
import ProviderOrdersListDrawer from '../ProviderOrders/components/ProviderOrdersListDrawer';
import DashboardTesoreria from '@/components/DashboardTesoreria';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { useNavigate } from 'react-router-dom';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const Treasury = () => {
  const { providerOrders, loadingProviderOrders, obtainProviderOrders, sales, loadingSales, obtainSales } = useGlobalInformation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useTabPersistenceString('dashboard');

  // Verificar permisos de tesorería
  const hasTesoreriaPermission = user?.permisos?.includes(PermissionsEnum.TREASURY);

  // Función para manejar click en OP (abre directamente sin drawer)
  const handleProviderOrderClick = useCallback((order: ProviderOrderProps) => {
    // Navegar directamente a la página de edición de OP
    navigate(`/provider-orders/${order.id}?from=treasury`);
  }, [navigate]);

  // Función para manejar click en OC (abre con drawer)
  const handleSaleOrderClick = useCallback((sale: SaleProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: sale });
  }, []);

  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'dashboard',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Dashboard fontSize="small" />
          Tabla de Pagos
        </span>
      ),
      children: <DashboardTesoreria />,
    },
    {
      key: 'op',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Assignment fontSize="small" />
          Órdenes de Proveedor (OP)
        </span>
      ),
      children: (
        <TreasurysTable
          loading={loadingProviderOrders}
          data={providerOrders}
          onRowClick={handleProviderOrderClick}
          onReload={obtainProviderOrders}
        />
      ),
    },
    {
      key: 'oc',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AccountBalance fontSize="small" />
          Órdenes de Compra (OC)
        </span>
      ),
      children: (
        <SalesTable
          loading={loadingSales}
          data={sales}
          onRowClick={handleSaleOrderClick}
          onReload={obtainSales}
        />
      ),
    },
  ], [loadingProviderOrders, providerOrders, handleProviderOrderClick, obtainProviderOrders, loadingSales, sales, handleSaleOrderClick, obtainSales]);

  if (!hasTesoreriaPermission) {
    return (
      <PageContent>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al módulo de Tesorería.</p>
        </Box>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {modal?.mode === ModalStateEnum.BOX && (
        <ProviderOrdersListDrawer
          isTreasury={true}
          handleClose={() => setModal(null)}
          data={modal.data!}
        />
      )}
    </PageContent>
  );
};

export default Treasury;
