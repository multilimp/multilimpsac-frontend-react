import { useState, useMemo } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import PageContent from '@/components/PageContent';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import BillingsTable from './components/BillingsTable';
import { Box, Typography } from '@mui/material';
import CargosEntregaTable from '@/components/CargosEntregaTable';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';

const BillingsPage = () => {
  const { sales, loadingSales, obtainSales } = useGlobalInformation();
  const [activeTab, setActiveTab] = useState('facturaciones');

  // Estados para el tab de Reporte de Programación
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(dayjs().format('YYYY-MM-DD'));

  const items: TabsProps['items'] = useMemo(() => [
    {
      key: 'facturaciones',
      label: 'Facturaciones',
      children: (
        <BillingsTable
          data={sales}
          loading={loadingSales}
          onReload={obtainSales}
        />
      ),
    },
    {
      key: 'cargos',
      label: 'Reporte de Programación',
      children: (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seleccionar Período
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Fecha Inicio</Typography>
                <DatePicker
                  value={dayjs(fechaInicio)}
                  onChange={(date) => setFechaInicio(date?.format('YYYY-MM-DD') || fechaInicio)}
                  format="DD/MM/YYYY"
                  placeholder="Seleccionar fecha inicio"
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Fecha Fin</Typography>
                <DatePicker
                  value={dayjs(fechaFin)}
                  onChange={(date) => setFechaFin(date?.format('YYYY-MM-DD') || fechaFin)}
                  format="DD/MM/YYYY"
                  placeholder="Seleccionar fecha fin"
                />
              </Box>
            </Box>
          </Box>
          <CargosEntregaTable
            fechaInicio={fechaInicio}
            fechaFin={fechaFin}
          />
        </>
      ),
    },
  ], [sales, loadingSales, obtainSales, fechaInicio, fechaFin]);

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
