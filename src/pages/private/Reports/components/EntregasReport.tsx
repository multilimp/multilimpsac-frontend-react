import { useState } from 'react';
import { Button, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchEntregasReport, exportEntregasReport } from '@/services/reports/reports.api';
import YearMonthSelector from './YearMonthSelector';

const EntregasReport = () => {
    const [params, setParams] = useState({ year: new Date().getFullYear(), mesInicio: 1, mesFin: 12 });
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            const result = await fetchEntregasReport(params);
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
        exportEntregasReport(data);
        message.success('Archivo descargado');
    };

    const columns = [
        { title: 'Código Venta', dataIndex: 'codigoVenta', key: 'codigoVenta' },
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        { title: 'Fecha Máxima', dataIndex: 'fechaMaxForm', key: 'fechaMaxForm' },
        { title: 'Fecha Entrega', dataIndex: 'fechaEntrega', key: 'fechaEntrega' },
        {
            title: 'Monto Venta',
            dataIndex: 'montoVenta',
            key: 'montoVenta',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        {
            title: 'Total OP',
            dataIndex: 'totalOp',
            key: 'totalOp',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        { title: 'Estado', dataIndex: 'estado', key: 'estado' },
    ];

    const chartData = data?.gráficoLinea?.meses?.map((mes: string, i: number) => ({
        mes,
        conforme: data.gráficoLinea.conformes[i],
        noConforme: data.gráficoLinea.noConformes[i],
    })) || [];

    return (
        <div className="report-columns">
            <section className="report-filters">
                <div className="report-filter-title">Filtros</div>
                <YearMonthSelector params={params} setParams={setParams} stacked />
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
                                <div className="report-stat-value">{data.resumen.totalEntregadas}</div>
                                <div className="report-stat-label">Total Entregadas</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#08b8ab' }}>
                                <div className="report-stat-value">{data.resumen.conformes}</div>
                                <div className="report-stat-label">Conformes</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#e12229' }}>
                                <div className="report-stat-value">{data.resumen.noConformes}</div>
                                <div className="report-stat-label">Fuera de Plazo</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#000000' }}>
                                <div className="report-stat-value">{data.resumen.porcentajeConformidad.toFixed(2)}%</div>
                                <div className="report-stat-label">Conformidad</div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Entregas por Mes</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="conforme" stroke="#08b8ab" name="Conforme" />
                                    <Line type="monotone" dataKey="noConforme" stroke="#e12229" name="No Conforme" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Detalle de Entregas</div>
                            <Table
                                columns={columns}
                                dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 1200 }}
                            />
                        </div>
                    </>
                )}

                {!loading && !data && <div className="report-empty">Genere un reporte para ver los datos</div>}
            </section>
        </div>
    );
};

export default EntregasReport;
