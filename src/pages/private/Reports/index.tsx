import { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { TrendingUp, BarChart, LocalShipping, Star, Receipt } from '@mui/icons-material';
import VentasReport from './components/VentasReport';
import EntregasReport from './components/EntregasReport';
import CobranzaReport from './components/CobranzaReport';
import RankingReport from './components/RankingReport';
import UtilidadReport from './components/UtilidadReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('ventas');

  const tabItems = [
    {
      key: 'ventas',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp style={{ fontSize: 18 }} />
          Ventas
        </span>
      ),
      children: <VentasReport />,
    },
    {
      key: 'entregas',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LocalShipping style={{ fontSize: 18 }} />
          Entregas OC
        </span>
      ),
      children: <EntregasReport />,
    },
    {
      key: 'cobranza',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Receipt style={{ fontSize: 18 }} />
          Cobranza
        </span>
      ),
      children: <CobranzaReport />,
    },
    {
      key: 'ranking',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Star style={{ fontSize: 18 }} />
          Ranking
        </span>
      ),
      children: <RankingReport />,
    },
    {
      key: 'utilidad',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart style={{ fontSize: 18 }} />
          Utilidad
        </span>
      ),
      children: <UtilidadReport />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        style={{ marginBottom: 24 }}
        styles={{
          body: { padding: 0 },
        }}
      >
        <div style={{ padding: '24px' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Panel de Reportes
          </Typography.Title>
          <Typography.Text type="secondary">
            Acceda a diferentes tipos de reportes para analizar el desempeño del negocio
          </Typography.Text>
        </div>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />
    </div>
  );
};

export default Reports;

