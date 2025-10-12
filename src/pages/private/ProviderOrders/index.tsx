import { useState, useEffect, useMemo } from 'react';
import { Tabs, Button, TabsProps } from 'antd';
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
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CargosEntregaTable from '@/components/CargosEntregaTable';
// Removed dayjs import
import { formattedDate, parseDate } from '@/utils/functions';
import { startOfMonth } from 'date-fns';
import DatePickerAntd from '@/components/DatePickerAnt';

const ProviderOrders = () => {
  const navigate = useNavigate();
  const { sales, loadingSales } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<SaleProps>>(null);
  const [activeTab, setActiveTab] = useState('oc');

  // Estados para el tab de OP
  const [loadingOps, setLoadingOps] = useState(false);
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);

  // Estados para el tab de Cargos de Entrega
  const [fechaInicio, setFechaInicio] = useState(formattedDate(startOfMonth(new Date()), 'YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(formattedDate(new Date(), 'YYYY-MM-DD'));

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

  // Filtrar ventas completadas
  const filteredSales = useMemo(() => {
    return sales.filter(sale => sale.estadoVenta === 'COMPLETADO');
  }, [sales]);

  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'oc',
      label: 'Tabla de Órdenes de Compra',
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
      label: 'Tabla OP',
      children: (
        <OpTable
          loading={loadingOps}
          data={ops}
          onRowClick={handleOpRowClick}
          onReload={loadOps}
        />
      )
    },
    {
      key: 'cargos',
      label: 'Cargos de Entrega',
      children: (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seleccionar Período
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Fecha Inicio</Typography>
-                <DatePicker
-                  value={dayjs(fechaInicio)}
-                  onChange={(date) => setFechaInicio(date ? formattedDate(date.toDate(), 'YYYY-MM-DD') : fechaInicio)}
-                  format="DD/MM/YYYY"
-                  placeholder="Seleccionar fecha inicio"
-                />
+                <DatePickerAntd
+                  value={parseDate(fechaInicio)}
+                  onChange={(date) => setFechaInicio(date ? formattedDate(date, 'YYYY-MM-DD') : fechaInicio)}
+                  placeholder="Seleccionar fecha inicio"
+                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Fecha Fin</Typography>
-                <DatePicker
-                  value={dayjs(fechaFin)}
-                  onChange={(date) => setFechaFin(date ? formattedDate(date.toDate(), 'YYYY-MM-DD') : fechaFin)}
-                  format="DD/MM/YYYY"
-                  placeholder="Seleccionar fecha fin"
-                />
+                <DatePickerAntd
+                  value={parseDate(fechaFin)}
+                  onChange={(date) => setFechaFin(date ? formattedDate(date, 'YYYY-MM-DD') : fechaFin)}
+                  placeholder="Seleccionar fecha fin"
+                />
              </Box>
            </Box>
          </Box>
          <CargosEntregaTable
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </>
      )
    }
  ], [loadingSales, filteredSales, loadingOps, ops, handleOpRowClick, loadOps, fechaInicio, fechaFin]);

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