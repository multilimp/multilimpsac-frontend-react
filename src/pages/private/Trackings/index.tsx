import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, notification } from 'antd';
import type { TabsProps } from 'antd';
import { AccountBalance, Business, Assignment } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import TrackingsTable from './components/TrackingsTable';
import OpTable from '../ProviderOrders/components/OpTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import ReporteProgramacion from '@/components/ReporteProgramacion';
import { SaleProps } from '@/services/sales/sales';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const TrackingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const [activeTab, setActiveTab] = useTabPersistenceString('oc');
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
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
    // Cargar OPs cuando se selecciona la pestaña de OP
    if (key === 'op' && ops.length === 0) {
      loadOps();
    }
  }, [loadOps, ops.length, setActiveTab]);

  // Handler para OC
  const handleOcRowClick = useCallback((sale: SaleProps) => {
    navigate(`/tracking/${sale.id}`);
  }, [navigate]);

  // Handler para OP
  const handleOpRowClick = useCallback((op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  }, [navigate]);

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
        <TrackingsTable
          data={sales}
          loading={loadingSales}
          onRowClick={handleOcRowClick}
          onReload={obtainSales}
        />
      ),
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
          data={ops}
          loading={loadingOps}
          onRowClick={handleOpRowClick}
          onReload={loadOps}
        />
      ),
    },
    {
      key: 'programacion',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Business fontSize="small" />
          Reporte de Programación
        </span>
      ),
      children: <ReporteProgramacion />,
    },
  ], [sales, loadingSales, handleOcRowClick, obtainSales, ops, loadingOps, handleOpRowClick, loadOps]);

  return (
    <PageContent
      title="Seguimientos"
    >
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
      />
    </PageContent>
  );
};

export default React.memo(TrackingsPage);
