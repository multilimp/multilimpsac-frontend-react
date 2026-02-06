import { useState } from 'react';
import { Select, Button, Spin, Table, message, Checkbox } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchCobranzaReport, exportCobranzaReport } from '@/services/reports/reports.api';

const ETAPAS_SIAF = [
    'NINGUNO',
    'COM',
    'DEV',
    'GIR',
    'PAG',
    'SSIAF',
    'RES',
    'GIR-F',
    'GIR-V',
    'GIR-A',
    'GIR-R',
];

const CobranzaReport = () => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [etapas, setEtapas] = useState<string[]>([]);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            const result = await fetchCobranzaReport({
                year,
                etapas: etapas.length > 0 ? etapas : undefined,
            });
            setData(result.data);
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
        exportCobranzaReport(data);
        message.success('Archivo descargado');
    };

    const columns = [
        { title: 'Código Venta', dataIndex: 'codigoVenta', key: 'codigoVenta' },
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        {
            title: 'Monto Venta',
            dataIndex: 'montoVenta',
            key: 'montoVenta',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        { title: 'Fecha Entrega', dataIndex: 'fechaEntrega', key: 'fechaEntrega' },
        { title: 'Etapa SIAF', dataIndex: 'etapaSiaf', key: 'etapaSiaf' },
    ];

    const chartData = data?.desgloseMensual?.map((item: any) => ({
        mes: item.nombreMes,
        monto: item.monto,
        pendiente: item.pendiente,
    })) || [];

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
                    <label className="report-label">Etapa SIAF</label>
                    <Checkbox.Group
                        className="report-checkbox-group"
                        value={etapas}
                        onChange={(val) => setEtapas(val as string[])}
                        options={ETAPAS_SIAF.map((e) => ({ label: e, value: e }))}
                        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
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
                            <div className="report-stat" style={{ borderLeftColor: '#0bb8ab' }}>
                                <div className="report-stat-value">{data.resumen.totalOrdenes}</div>
                                <div className="report-stat-label">Total Ordenes</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#ffae20' }}>
                                <div className="report-stat-value">S/ {data.resumen.montoTotal.toFixed(2)}</div>
                                <div className="report-stat-label">Monto Total</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#000000' }}>
                                <div className="report-stat-value">S/ {data.resumen.montoPendiente.toFixed(2)}</div>
                                <div className="report-stat-label">Monto Pendiente</div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Cobranza Mensual</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip formatter={(value: any) => `S/ ${value.toFixed(2)}`} />
                                    <Legend />
                                    <Bar dataKey="monto" fill="#ffae20" name="Monto Total" />
                                    <Bar dataKey="pendiente" fill="#000000" name="Pendiente" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Detalle de Cobranza</div>
                            <Table
                                columns={columns}
                                dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 1000 }}
                            />
                        </div>
                    </>
                )}

                {!loading && !data && <div className="report-empty">Genere un reporte para ver los datos</div>}
            </section>
        </div>
    );
};

export default CobranzaReport;
