import { useMemo } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AccountBalance, Business } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import CollectionsTable from './components/CollectionsTable';
import { useAppContext } from '@/context';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const CollectionsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useTabPersistenceString('estado');

  const filteredSales = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    const isJefeCobranzas = user.permisos?.includes(PermissionsEnum.JEFECOBRANZAS);
    const isCobranzas = user.permisos?.includes(PermissionsEnum.COLLECTIONS) || isJefeCobranzas;

    let filtered = sales;

    // Filtrar por cobrador si no es jefe de cobranzas
    if (!isJefeCobranzas) {
      filtered = filtered.filter(sale => sale.cobradorId === user.id);
    }

    // Filtrar por estado de seguimiento para usuarios de cobranza
    if (isCobranzas) {
      filtered = filtered.filter(sale => {
        const estado = sale.estadoRolSeguimiento;
        // Cobranza NO ve: PENDIENTE y ENTREGADO
        // Cobranza SÍ ve: EN_PROCESO, COMPLETO, ANULADO
        return estado !== 'PENDIENTE' && estado !== 'ANULADO';
      });
    }

    return filtered;
  }, [sales, user.permisos, user.id]);

  // Separar ventas al estado y privadas
  const ventasEstado = useMemo(() => filteredSales.filter(s => !s.ventaPrivada), [filteredSales]);
  const ventasPrivadas = useMemo(() => filteredSales.filter(s => s.ventaPrivada), [filteredSales]);

  const handleRecordAction = (action: string, data: any) => {
    if (action === 'DETAILS') {
      navigate(`/collections/${data.id}`);
    }
  };

  const tabItems: TabsProps['items'] = useMemo(() => [
    {
      key: 'estado',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AccountBalance fontSize="small" />
          Ventas al Estado
        </span>
      ),
      children: (
        <CollectionsTable
          data={ventasEstado}
          loading={loadingSales}
          onRecordAction={handleRecordAction}
          onReload={obtainSales}
        />
      ),
    },
    {
      key: 'privadas',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Business fontSize="small" />
          Ventas Privadas
        </span>
      ),
      children: (
        <CollectionsTable
          data={ventasPrivadas}
          loading={loadingSales}
          onRecordAction={handleRecordAction}
          onReload={obtainSales}
        />
      ),
    },
  ], [ventasEstado, ventasPrivadas, loadingSales, obtainSales]);

  return (
    <PageContent
      title="Cobranzas"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        style={{ marginBottom: 16 }}
        items={tabItems}
      />
    </PageContent>
  );
};

export default CollectionsPage;
