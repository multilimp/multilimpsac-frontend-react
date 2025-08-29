
import React, { useState, useMemo, useCallback } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AccountBalance, Business } from '@mui/icons-material';
import PageContent from '@/components/PageContent';
import SalesTable from './components/SalesTable';
import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { Link, useNavigate } from 'react-router-dom';

const SalesPage = () => {
  const { sales, loadingSales, obtainSales, setSaleInputValues } = useGlobalInformation();
  const [activeTab, setActiveTab] = useState<number>(0);
  const navigate = useNavigate();

  // Filtrar ventas por tipo con memoización
  const ventasEstado = useMemo(() => {
    return sales.filter(sale => !sale.ventaPrivada);
  }, [sales]);

  const ventasPrivadas = useMemo(() => {
    return sales.filter(sale => sale.ventaPrivada);
  }, [sales]);

  // Handler memoizado para cambio de tab
  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

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

  return (
    <PageContent
      component={
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddSale}
        >
          Agregar Venta
        </Button>
      }
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="tabs de ventas"
          >
            <Tab
              label={`Ventas al Estado (${ventasEstado.length})`}
              icon={<AccountBalance />}
              iconPosition="start"
            />
            <Tab
              label={`Ventas Privadas (${ventasPrivadas.length})`}
              icon={<Business />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Tab Panel: Ventas al Estado */}
        <div
          role="tabpanel"
          hidden={activeTab !== 0}
          id="tabpanel-estado"
          aria-labelledby="tab-estado"
        >
          {activeTab === 0 && (
            <Box sx={{ py: 3 }}>
              <SalesTable
                data={ventasEstado}
                loading={loadingSales}
                onReload={obtainSales}
              />
            </Box>
          )}
        </div>

        {/* Tab Panel: Ventas Privadas */}
        <div
          role="tabpanel"
          hidden={activeTab !== 1}
          id="tabpanel-privadas"
          aria-labelledby="tab-privadas"
        >
          {activeTab === 1 && (
            <Box sx={{ py: 3 }}>
              <SalesTable
                data={ventasPrivadas}
                loading={loadingSales}
                onReload={obtainSales}
              />
            </Box>
          )}
        </div>
      </Box>
    </PageContent>
  );
};

export default React.memo(SalesPage);
