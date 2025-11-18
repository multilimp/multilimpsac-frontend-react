import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import CollectionsTable from './components/CollectionsTable';
import { useAppContext } from '@/context';
import { PermissionsEnum } from '@/services/users/permissions.enum';
import { useMemo } from 'react';

const CollectionsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const { user } = useAppContext();
  const navigate = useNavigate();

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

  return (
    <PageContent
      title="Cobranzas"
    >
      <CollectionsTable
        data={filteredSales}
        loading={loadingSales}
        onRecordAction={
          (action, data) => {
            if (action === 'DETAILS') {
              navigate(`/collections/${data.id}`);
            }
          }
        }
        onReload={obtainSales}
      />
    </PageContent>
  );
};

export default CollectionsPage;
