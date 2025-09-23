import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
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

const Treasury = () => {
  const { providerOrders, loadingProviderOrders, obtainProviderOrders, sales, loadingSales, obtainSales } = useGlobalInformation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Verificar permisos de tesorería
  const hasTesoreriaPermission = user?.permisos?.includes(PermissionsEnum.TREASURY);

  // Función para manejar click en OP (abre directamente sin drawer)
  const handleProviderOrderClick = (order: ProviderOrderProps) => {
    // Navegar directamente a la página de edición de OP
    navigate(`/provider-orders/${order.id}?from=treasury`);
  };

  // Función para manejar click en OC (abre con drawer)
  const handleSaleOrderClick = (sale: SaleProps) => {
    setModal({ mode: ModalStateEnum.BOX, data: sale });
  };

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
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="tabs de tesorería"
          >
            <Tab label="Órdenes de Proveedor (OP)" />
            <Tab label="Órdenes de Compra (OC)" />
            <Tab label="Dashboard Pagos" />
          </Tabs>
        </Box>

        {/* Tab Panel: Órdenes de Proveedor (OP) */}
        <div
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-op"
          aria-labelledby="tab-op"
        >
          {activeTab === 0 && (
            <Box sx={{ py: 3 }}>
              <TreasurysTable
                loading={loadingProviderOrders}
                data={providerOrders}
                onRowClick={handleProviderOrderClick}
                onReload={obtainProviderOrders}
              />
            </Box>
          )}
        </div>

        {/* Tab Panel: Órdenes de Compra (OC) */}
        <div
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-oc"
          aria-labelledby="tab-oc"
        >
          {activeTab === 1 && (
            <Box sx={{ py: 3 }}>
              <SalesTable
                loading={loadingSales}
                data={sales}
                onRowClick={handleSaleOrderClick}
                onReload={obtainSales}
              />
            </Box>
          )}
        </div>

        {/* Tab Panel: Dashboard */}
        <div
          role="tabpanel"
          hidden={activeTab !== 2}
          id="tabpanel-dashboard"
          aria-labelledby="tab-dashboard"
        >
          {activeTab === 2 && (
            <Box sx={{ py: 3 }}>
              <DashboardTesoreria />
            </Box>
          )}
        </div>
      </Box>

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
