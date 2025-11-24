import React, { useMemo, useCallback } from 'react';
import { Stack, Button, Box } from '@mui/material';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { AccountBalance, Business, Add } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { useNavigate } from 'react-router-dom';
import { useTabPersistenceString } from '@/hooks/useTabPersistence';

const SalesPage = () => {
  const { sales, loadingSales, obtainSales, setSaleInputValues } = useGlobalInformation();
  const [activeTab, setActiveTab] = useTabPersistenceString('estado');
  const navigate = useNavigate();

  // Filtrar ventas por tipo con memoización
  const ventasEstado = useMemo(() => {
    return sales.filter(sale => !sale.ventaPrivada);
  }, [sales]);

  const ventasPrivadas = useMemo(() => {
    return sales.filter(sale => sale.ventaPrivada);
  }, [sales]);

  // Handler para inicializar valores al crear nueva venta
  const handleAddSale = useCallback(() => {
    // Inicializar valores por defecto para nueva venta
    setSaleInputValues({
      enterprise: null,
      file: null,
      tipoVenta: 'directa'
    });

    // Navegar a la página de creación
    navigate('/sales/create');
  }, [setSaleInputValues, navigate]);

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
        <SalesTable
          data={ventasEstado}
          loading={loadingSales}
          onReload={obtainSales}
          isPrivateSales={false}
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
        <SalesTable
          data={ventasPrivadas}
          loading={loadingSales}
          onReload={obtainSales}
          isPrivateSales={true}
        />
      ),
    },
  ], [ventasEstado, ventasPrivadas, loadingSales, obtainSales]);

  return (
    <PageContent
      title="Ventas"
    >
      <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddSale}
        >
          Agregar Venta
        </Button>
      </Stack>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </PageContent>
  );
};

export default React.memo(SalesPage);
