import { useState } from 'react';
import { Select, Button, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { fetchRankingReport, exportRankingReport } from '@/services/reports/reports.api';

const RankingReport = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [mes, setMes] = useState<number | undefined>();
    const [region, setRegion] = useState<string | undefined>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [regiones, setRegiones] = useState<string[]>([]);

    const meses = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'][i],
    }));

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            const result = await fetchRankingReport({ year, mes, region });
            setData(result.data);
            setRegiones(result.data.regiones || []);
            message.success('Reporte generado correctamente');
        } catch (error) {
            console.error('Error:', error);
            message.error('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    const handleExportExcel = () => {
        if (!data) {
            message.warning('Primero debe generar el reporte');
            return;
        }
        exportRankingReport(data);
        message.success('Archivo descargado');
    };

    const deptoColumns = [
        { title: 'Departamento', dataIndex: 'departamento', key: 'departamento' },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        { title: 'Cantidad OC', dataIndex: 'cantidad', key: 'cantidad' },
    ];

    const clienteColumns = [
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        { title: 'RUC', dataIndex: 'ruc', key: 'ruc' },
        {
            title: 'Monto',
            dataIndex: 'monto',
            key: 'monto',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        { title: 'Cantidad OC', dataIndex: 'cantidad', key: 'cantidad' },
    ];

    return (
        <div className="report-columns">
            <section className="report-filters">
                <div className="report-filter-title">Filtros</div>
                <div className="report-field">
                    <label className="report-label">Año</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        value={year}
                        onChange={setYear}
                        options={Array.from({ length: 5 }, (_, i) => ({
                            value: new Date().getFullYear() - i,
                            label: String(new Date().getFullYear() - i),
                        }))}
                    />
                </div>

                <div className="report-field">
                    <label className="report-label">Mes</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        placeholder="Todos los meses"
                        allowClear
                        value={mes || undefined}
                        onChange={setMes}
                        options={meses}
                    />
                </div>

                <div className="report-field">
                    <label className="report-label">Región</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        placeholder="Todas las regiones"
                        allowClear
                        disabled={!data}
                        value={region || undefined}
                        onChange={setRegion}
                        options={regiones.map((r) => ({ value: r, label: r }))}
                    />
                </div>

                <div className="report-actions">
                    <Button className="report-btn-primary" size="large" onClick={handleGenerateReport} loading={loading}>
                        Generar Reporte
                    </Button>
                    <Button
                        className="report-btn-secondary"
                        icon={<DownloadOutlined />}
                        size="large"
                        onClick={handleExportExcel}
                        disabled={!data}
                    >
                        Descargar Excel
                    </Button>
                </div>
            </section>

            <section className="report-content">
                {loading && (
                    <div className="report-card" style={{ textAlign: 'center', padding: 50 }}>
                        <Spin size="large" />
                    </div>
                )}

                {!loading && data && (
                    <>
                        <div className="report-content-header">
                            <div className="report-content-title">Resumen</div>
                            <Button className="report-btn-secondary" onClick={() => window.print()}>
                                Imprimir
                            </Button>
                        </div>
                        <div className="report-summary-grid">
                            <div className="report-stat" style={{ borderLeftColor: '#edbd01' }}>
                                <div className="report-stat-value">{data.resumen.totalOrdenes}</div>
                                <div className="report-stat-label">Total Ordenes</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#db6c1a' }}>
                                <div className="report-stat-value">S/ {data.resumen.montoTotal.toFixed(2)}</div>
                                <div className="report-stat-label">Monto Total</div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Top 3 Departamentos</div>
                            <Table
                                columns={deptoColumns}
                                dataSource={data.topDepartamentos.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                pagination={false}
                            />
                        </div>
                        <div className="report-card">
                            <div className="report-card-title">Top 3 Clientes</div>
                            <Table
                                columns={clienteColumns}
                                dataSource={data.topClientes.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                pagination={false}
                            />
                        </div>
                    </>
                )}

                {!loading && !data && <div className="report-empty">Genere un reporte para ver los datos</div>}
            </section>
        </div>
    );
};

export default RankingReport;
