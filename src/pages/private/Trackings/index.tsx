import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AccountBalance, Business, Assignment } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import OpTable from '../ProviderOrders/components/OpTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import { notification } from 'antd';

const TrackingsPage = () => {
  const { sales, loadingSales, obtainSales, setSelectedSale } = useGlobalInformation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);
  const [loadingOps, setLoadingOps] = useState(false);

  // Cargar OPs cuando se cambia a la pestaña de OP
  const loadOps = useCallback(async () => {
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
  }, []);

  // Handler memoizado para cambio de tab
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Cargar OPs cuando se selecciona la pestaña de OP
    if (newValue === 1 && ops.length === 0) {
      loadOps();
    }
  }, [loadOps, ops.length]);

  // Handler para OC
  const handleOcRowClick = useCallback((sale: any) => {
    setSelectedSale(sale);
    navigate(`/tracking/${sale.id}`);
  }, [setSelectedSale, navigate]);

  // Handler para OP
  const handleOpRowClick = useCallback((op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  }, [navigate]);

  // Filtrar ventas por tipo
  const ventasEstado = useMemo(() => {
    return sales.filter(sale => !sale.ventaPrivada);
  }, [sales]);

  const ventasPrivadas = useMemo(() => {
    return sales.filter(sale => sale.ventaPrivada);
  }, [sales]);

  return (
    <PageContent
      title="Seguimientos"
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tabs de seguimientos"
          >
            <Tab
              label={`Ordenes de Compra (${sales.length})`}
              icon={<AccountBalance />}
              iconPosition="start"
            />
            <Tab
              label={`Ordenes de Proveedor (${ops.length})`}
              icon={<Assignment />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panel: Ordenes de Compra */}
        <div
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-oc"
          aria-labelledby="tab-oc"
        >
          {activeTab === 0 && (
            <Box sx={{ py: 3 }}>
              <TrackingsTable
                data={sales}
                loading={loadingSales}
                onRowClick={handleOcRowClick}
                onReload={obtainSales}
              />
            </Box>
          )}
        </div>

        {/* Tab Panel: Ordenes de Proveedor */}
        <div
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-op"
          aria-labelledby="tab-op"
        >
          {activeTab === 1 && (
            <Box sx={{ py: 3 }}>
              <OpTable
                data={ops}
                loading={loadingOps}
                onRowClick={handleOpRowClick}
                onReload={loadOps}
              />
            </Box>
          )}
        </div>
      </Box>
    </PageContent>
  );
};

export default React.memo(TrackingsPage);
