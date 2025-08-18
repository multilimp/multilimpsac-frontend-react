import { useState, useEffect } from 'react';
import PageContent from '@/components/PageContent';
import { ProviderOrderProps } from '@/services/providerOrders/providerOrders';
import { getAllOrderProviders } from '@/services/providerOrders/providerOrders.requests';
import OpTable from './components/OpTable';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const OpTables = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ops, setOps] = useState<Array<ProviderOrderProps>>([]);

  const loadOps = async () => {
    try {
      setLoading(true);
      const data = await getAllOrderProviders();
      setOps(data);
    } catch (error) {
      console.error('Error loading OPs:', error);
      notification.error({
        message: 'Error al cargar datos',
        description: 'No se pudieron cargar las órdenes de proveedor'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOps();
  }, []);

  const handleRowClick = (op: ProviderOrderProps) => {
    navigate(`/provider-orders/${op.id}`);
  };

  return (
    <PageContent>
      <OpTable 
        loading={loading} 
        data={ops} 
        onRowClick={handleRowClick} 
      />
    </PageContent>
  );
};

export default OpTables;
