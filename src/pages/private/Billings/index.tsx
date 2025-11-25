import { useMemo } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AccountBalance, Business, CalendarMonth } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import BillingsTable from './components/BillingsTable';
import ReporteProgramacion from '@/components/ReporteProgramacion';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const BillingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const [activeTab, setActiveTab] = useTabPersistenceString('facturaciones'); // Persistir tab en URL

  const salesEstado = useMemo(() => Array.isArray(sales) ? sales.filter((s) => !s.ventaPrivada) : [], [sales]);
  const salesPrivadas = useMemo(() => Array.isArray(sales) ? sales.filter((s) => s.ventaPrivada === true) : [], [sales]);
  const items: TabsProps['items'] = useMemo(() => [
    {
      key: 'facturaciones',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AccountBalance fontSize="small" />
          Ventas al Estado
        </span>
      ),
      children: (
        <BillingsTable
          data={salesEstado}
          loading={loadingSales}
          onReload={obtainSales}
        />
      ),
    },
    {
      key: 'ordenCompraPrivada',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Business fontSize="small" />
          Ventas Privadas
        </span>
      ),
      children: (
        <BillingsTable
          data={salesPrivadas}
          loading={loadingSales}
          onReload={obtainSales}
          privateMode={true}
        />
      ),
    },
    {
      key: 'cargos',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarMonth fontSize="small" />
          Reporte de Programación
        </span>
      ),
      children: <ReporteProgramacion />,
    },
  ], [salesEstado, salesPrivadas, loadingSales, obtainSales]);

  return (
    <PageContent
      title="Facturaciones"
      helper="GESTIÓN DE FACTURAS Y Reporte de Programación"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginBottom: 16 }}
        items={items}
      />
    </PageContent>
  );
};

export default BillingsPage;
