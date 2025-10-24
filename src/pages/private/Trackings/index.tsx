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
import CargosEntregaTable from '@/components/CargosEntregaTable';
import dayjs from 'dayjs';
import { DatePicker, Space } from 'antd';
import { SaleProps } from '@/services/sales/sales';

const TrackingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);
  const [loadingOps, setLoadingOps] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    dayjs().startOf('month'),
    dayjs().endOf('month'),
  ]);

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
  const handleOcRowClick = useCallback((sale: SaleProps) => {
    navigate(`/tracking/${sale.id}`);
  }, [navigate]);

  // Handler para OP
  const handleOpRowClick = useCallback((op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  }, [navigate]);

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
              label={`Tabla de Órdenes de Compra`}
              icon={<AccountBalance />}
              iconPosition="start"
            />
            <Tab
              label={`Tabla OP`}
              icon={<Assignment />}
              iconPosition="start"
            />
            <Tab
              label={`Tabla Reporte de Programación`}
              icon={<Business />}
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

        {/* Tab Panel: Reporte de Programación */}
        <div
          role="tabpanel"
          hidden={activeTab !== 2}
          id="tabpanel-programacion"
          aria-labelledby="tab-programacion"
        >
          {activeTab === 2 && (
            <Box sx={{ py: 3 }}>
              <Space direction="horizontal" style={{ marginBottom: 12 }}>
                <DatePicker.RangePicker
                  onChange={(values) => {
                    if (!values || values.length !== 2) return;
                    setDateRange([values[0], values[1]]);
                  }}
                  allowClear={false}
                />
              </Space>

              <CargosEntregaTable
                fechaInicio={dateRange[0]!.format('YYYY-MM-DD')}
                fechaFin={dateRange[1]!.format('YYYY-MM-DD')}
              />
            </Box>
          )}
        </div>

      </Box>
    </PageContent>
  );
};

export default React.memo(TrackingsPage);
