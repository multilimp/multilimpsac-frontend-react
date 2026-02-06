import { useState } from 'react';
import './reports.css';
import VentasReport from './components/VentasReport';
import EntregasReport from './components/EntregasReport';
import CobranzaReport from './components/CobranzaReport';
import RankingReport from './components/RankingReport';
import UtilidadReport from './components/UtilidadReport';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('ventas');
  const [ventasFetched, setVentasFetched] = useState(false);

  const reports = [
    {
      key: 'ventas',
      label: 'Ventas',
      component: (
        <VentasReport
          autoFetch={!ventasFetched && activeTab === 'ventas'}
          onAutoFetchComplete={() => setVentasFetched(true)}
        />
      ),
    },
    { key: 'entregas', label: 'Entregas OC', component: <EntregasReport /> },
    { key: 'cobranza', label: 'Cobranza', component: <CobranzaReport /> },
    { key: 'ranking', label: 'Ranking', component: <RankingReport /> },
    { key: 'utilidad', label: 'Utilidad', component: <UtilidadReport /> },
  ];

  const activeReport = reports.find((report) => report.key === activeTab) || reports[0];

  return (
    <div className="reports-shell">
      <nav className="reports-tabs">
        {reports.map((report) => (
          <button
            key={report.key}
            type="button"
            className={`reports-tab-button ${activeTab === report.key ? 'active' : ''}`}
            onClick={() => setActiveTab(report.key)}
          >
            {report.label}
          </button>
        ))}
      </nav>
      <main className="reports-workspace">{activeReport.component}</main>
    </div>
  );
};

export default Reports;

