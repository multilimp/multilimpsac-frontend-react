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
import ProviderOrdersListDrawer from '../ProviderOrders/components/ProviderOrdersListDrawer';
import DashboardTesoreria from '@/components/DashboardTesoreria';

const Treasury = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const { user } = useAppContext();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Verificar permisos de tesorería
  const hasTesoreriaPermission = user?.permisos?.includes(PermissionsEnum.TREASURY);

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
            <Tab label="Dashboard Pagos" />
            <Tab label="Gestión de Ventas" />
          </Tabs>
        </Box>

        {/* Tab Panel: Dashboard */}
        <div
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-dashboard"
          aria-labelledby="tab-dashboard"
        >
          {activeTab === 0 && (
            <Box sx={{ py: 3 }}>
              <DashboardTesoreria />
            </Box>
          )}
        </div>

        {/* Tab Panel: Gestión de Ventas */}
        <div
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-ventas"
          aria-labelledby="tab-ventas"
        >
          {activeTab === 1 && (
            <Box sx={{ py: 3 }}>
              <TreasurysTable
                loading={loadingSales}
                data={sales}
                onRowClick={(sale) => setModal({ mode: ModalStateEnum.BOX, data: sale })}
                onReload={obtainSales}
              />
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
