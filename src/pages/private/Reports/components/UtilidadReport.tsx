import { useState } from 'react';
import { Select, Button, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchUtilidadReport, exportUtilidadReport } from '@/services/reports/reports.api';
import YearMonthSelector from './YearMonthSelector';

const UtilidadReport = () => {
    const [params, setParams] = useState({ year: new Date().getFullYear(), mesInicio: 1, mesFin: 12 });
    const [empresaId, setEmpresaId] = useState<number | undefined>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState<any[]>([]);

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            const result = await fetchUtilidadReport({
                ...params,
                empresaId,
            });
            setData(result.data);
            setEmpresas(result.data.empresas || []);
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
        exportUtilidadReport(data);
        message.success('Archivo descargado');
    };

    const columns = [
        { title: 'Rango', dataIndex: 'rango', key: 'rango' },
        { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
        {
            title: 'Monto Total',
            dataIndex: 'montoTotal',
            key: 'montoTotal',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        {
            title: 'Utilidad Total',
            dataIndex: 'utilidadTotal',
            key: 'utilidadTotal',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        {
            title: 'Porcentaje',
            dataIndex: 'porcentaje',
            key: 'porcentaje',
            render: (value: number) => `${value.toFixed(2)}%`,
        },
    ];

    const chartData = data?.tabla?.map((item: any) => ({
        rango: item.rango,
        cantidad: item.cantidad,
        utilidad: item.utilidadTotal,
    })) || [];

    return (
        <div className="report-columns">
            <section className="report-filters">
                <div className="report-filter-title">Filtros</div>
                <YearMonthSelector params={params} setParams={setParams} stacked />

                <div className="report-field">
                    <label className="report-label">Empresa</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        placeholder="Todas las empresas"
                        allowClear
                        value={empresaId || undefined}
                        onChange={setEmpresaId}
                        options={empresas.map((e) => ({ value: e.id, label: e.razonSocial }))}
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
                            <div className="report-stat" style={{ borderLeftColor: '#1890ff' }}>
                                <div className="report-stat-value">{data.resumen.totalOrdenes}</div>
                                <div className="report-stat-label">Total de Ordenes</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#52c41a' }}>
                                <div className="report-stat-value">S/ {data.resumen.totalVentas.toFixed(2)}</div>
                                <div className="report-stat-label">Total de Ventas</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#f5222d' }}>
                                <div className="report-stat-value">S/ {data.resumen.totalUtilidad.toFixed(2)}</div>
                                <div className="report-stat-label">Total de Utilidad</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#000000' }}>
                                <div className="report-stat-value">{data.resumen.porcentajeUtilidadPromedio.toFixed(2)}%</div>
                                <div className="report-stat-label">Utilidad Promedio</div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Rangos de Utilidad</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rango" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="cantidad" fill="#08b8ab" name="Cantidad" />
                                    <Bar yAxisId="right" dataKey="utilidad" fill="#000000" name="Utilidad (S/)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Detalle de Rangos</div>
                            <Table
                                columns={columns}
                                dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
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

export default UtilidadReport;
