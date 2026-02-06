import { useCallback, useEffect, useRef, useState } from 'react';
import { Select, Button, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchVentasReport, exportVentasReport } from '@/services/reports/reports.api';

type VentasReportProps = {
    autoFetch?: boolean;
    onAutoFetchComplete?: () => void;
};

const VentasReport = ({ autoFetch = false, onAutoFetchComplete }: VentasReportProps) => {
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [mesInicio, setMesInicio] = useState<number>(1);
    const [mesFin, setMesFin] = useState<number>(12);
    const [filtroRango, setFiltroRango] = useState<string | undefined>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const meses = [
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' },
        { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' },
        { value: 12, label: 'Diciembre' },
    ];

    const rangos = [
        { value: 'mayor-5k', label: '+5,000' },
        { value: '2k-5k', label: '2,000 - 5,000' },
        { value: '1k-2k', label: '1,000 - 2,000' },
        { value: 'menor-1k', label: '< 1,000' },
    ];

    const handleGenerateReport = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchVentasReport({
                year,
                mesInicio,
                mesFin,
                filtroRango,
            });
            setData(result.data);
            message.success('Reporte generado correctamente');
        } catch (error) {
            console.error('Error al generar reporte:', error);
            message.error('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    }, [year, mesInicio, mesFin, filtroRango]);

    const didAutoFetch = useRef(false);

    useEffect(() => {
        if (!autoFetch || didAutoFetch.current) {
            return;
        }

        didAutoFetch.current = true;
        void (async () => {
            await handleGenerateReport();
            onAutoFetchComplete?.();
        })();
    }, [autoFetch, handleGenerateReport, onAutoFetchComplete]);

    const handleExportExcel = () => {
        if (!data) {
            message.warning('Primero debe generar el reporte');
            return;
        }
        exportVentasReport(data);
        message.success('Archivo descargado');
    };

    const columns = [
        { title: 'Codigo Venta', dataIndex: 'codigoVenta', key: 'codigoVenta' },
        { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        {
            title: 'Monto Venta',
            dataIndex: 'montoVenta',
            key: 'montoVenta',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        {
            title: 'Utilidad',
            dataIndex: 'utilidad',
            key: 'utilidad',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        {
            title: 'Utilidad %',
            dataIndex: 'porcentajeUtilidad',
            key: 'porcentajeUtilidad',
            render: (value: number) => `${value.toFixed(2)}%`,
        },
    ];

    const monthlyColumns = [
        { title: 'Mes', dataIndex: 'mes1', key: 'mes1' },
        {
            title: 'Total Ventas',
            dataIndex: 'total1',
            key: 'total1',
            render: (value: number) => `S/ ${value.toFixed(2)}`,
        },
        { title: 'Mes', dataIndex: 'mes2', key: 'mes2' },
        {
            title: 'Total Ventas',
            dataIndex: 'total2',
            key: 'total2',
            render: (value: number) => (value !== undefined ? `S/ ${value.toFixed(2)}` : ''),
        },
    ];

    const monthlyTableData = (data?.mensualAnual?.meses || []).reduce((rows: any[], mes: string, i: number) => {
        const rowIndex = Math.floor(i / 2);
        if (!rows[rowIndex]) {
            rows[rowIndex] = { key: rowIndex };
        }
        if (i % 2 === 0) {
            rows[rowIndex].mes1 = mes;
            rows[rowIndex].total1 = data?.mensualAnual?.datos?.[i] ?? 0;
        } else {
            rows[rowIndex].mes2 = mes;
            rows[rowIndex].total2 = data?.mensualAnual?.datos?.[i] ?? 0;
        }
        return rows;
    }, []);

    const rangeChartData = data?.rangoMensual?.meses?.map((mes: string, i: number) => ({
        mes,
        total: data.rangoMensual.total[i] || 0,
        menor1k: data.rangoMensual.menor1k[i] || 0,
        menor2k: data.rangoMensual.menor2k[i] || 0,
        menor5k: data.rangoMensual.menor5k[i] || 0,
        mayor5k: data.rangoMensual.mayor5k[i] || 0,
    })) || [];

    const rangeSummary = data?.resumenRangos || [];
    const rangeSummaryVisible = filtroRango
        ? rangeSummary.filter((range: any) => range.key === filtroRango)
        : rangeSummary;
    const pieData = rangeSummaryVisible.filter((range: any) => range.monto > 0);

    return (
        <div className="report-columns">
            <section className="report-filters">
                <div className="report-filter-title">Filtros</div>
                <div className="report-field">
                    <label className="report-label">Ano</label>
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
                    <label className="report-label">Fecha de inicio</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        value={mesInicio}
                        onChange={setMesInicio}
                        options={meses}
                    />
                </div>
                <div className="report-field">
                    <label className="report-label">Fecha final</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        value={mesFin}
                        onChange={setMesFin}
                        options={meses}
                    />
                </div>
                <div className="report-field">
                    <label className="report-label">Ventas</label>
                    <Select
                        className="report-select"
                        style={{ width: '100%' }}
                        placeholder="Todos"
                        allowClear
                        value={filtroRango || undefined}
                        onChange={setFiltroRango}
                        options={rangos}
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
                                <div className="report-stat-value">S/ {data.resumen.totalVentas.toFixed(2)}</div>
                                <div className="report-stat-label">Total Ventas</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#1e88e5' }}>
                                <div className="report-stat-value">{data.resumen.cantidadOrdenes}</div>
                                <div className="report-stat-label">Ordenes</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#e53935' }}>
                                <div className="report-stat-value">S/ {data.resumen.utilidadTotal.toFixed(2)}</div>
                                <div className="report-stat-label">Utilidad Total</div>
                            </div>
                            <div className="report-stat" style={{ borderLeftColor: '#000000' }}>
                                <div className="report-stat-value">{data.resumen.porcentajeUtilidadPromedio.toFixed(2)}%</div>
                                <div className="report-stat-label">Utilidad Promedio</div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Rango de Ventas Totales ({data.resumen.año})</div>
                            <div className="report-card-split">
                                <div className="report-card-main">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={rangeChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip formatter={(value: number) => `S/ ${value.toFixed(2)}`} />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#d776d2" name="Total" strokeWidth={2} />
                                            <Line type="monotone" dataKey="menor1k" stroke="rgba(254,157,1,255)" name="-1k" />
                                            <Line type="monotone" dataKey="menor2k" stroke="rgba(24,120,177,255)" name="-2k" />
                                            <Line type="monotone" dataKey="menor5k" stroke="rgba(8,184,171,255)" name="-5k" />
                                            <Line type="monotone" dataKey="mayor5k" stroke="rgba(0,0,0,255)" name="+5k" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="report-card-aside">
                                    <div className="report-mini-table-title">Venta {data.resumen.mesInicio}-{data.resumen.mesFin}</div>
                                    <table className="report-sales-table">
                                        <thead>
                                            <tr>
                                                <th>Mes</th>
                                                <th>Venta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.gráficoMensual.meses.map((mes: string, idx: number) => (
                                                <tr key={mes}>
                                                    <td>{mes}</td>
                                                    <td>S/ {Number(data.gráficoMensual.datos[idx] || 0).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td>Total</td>
                                                <td>S/ {data.resumenRangosTotal?.monto.toFixed(2)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Resumen por Rangos</div>
                            <div className="report-card-split">
                                <div className="report-card-main">
                                    <div className="report-range-list">
                                        {!filtroRango && (
                                            <div className="report-range-row" style={{ borderLeftColor: '#d776d2' }}>
                                                <div className="report-range-label">Total</div>
                                                <div className="report-range-value">S/ {data.resumenRangosTotal?.monto.toFixed(2)}</div>
                                                <div className="report-range-oc">OC = {data.resumenRangosTotal?.oc}</div>
                                                <div className="report-range-pct">100.00%</div>
                                            </div>
                                        )}
                                        {rangeSummaryVisible.map((range: any) => (
                                            <div key={range.key} className="report-range-row" style={{ borderLeftColor: range.color }}>
                                                <div className="report-range-label">{range.label}</div>
                                                <div className="report-range-value">S/ {range.monto.toFixed(2)}</div>
                                                <div className="report-range-oc">OC = {range.oc}</div>
                                                <div className="report-range-pct">{range.porcentaje.toFixed(2)}%</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="report-card-aside">
                                    <ResponsiveContainer width="100%" height={240}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="monto"
                                                nameKey="label"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                            >
                                                {pieData.map((range: any) => (
                                                    <Cell key={range.key} fill={range.color} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                            <Tooltip formatter={(value: number) => `S/ ${value.toFixed(2)}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Ventas Mensuales</div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                    data={data.mensualAnual?.meses.map((mes: string, i: number) => ({
                                        mes,
                                        total: data.mensualAnual?.datos[i] ?? 0,
                                    }))}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `S/ ${value.toFixed(2)}`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" stroke="#4b2fa8" name="Ventas" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Detalle de Ventas</div>
                            <Table
                                columns={columns}
                                dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 1200 }}
                            />
                        </div>

                        <div className="report-card">
                            <div className="report-card-title">Ventas por Mes</div>
                            <Table columns={monthlyColumns} dataSource={monthlyTableData} pagination={false} size="small" />
                        </div>
                    </>
                )}

                {!loading && !data && <div className="report-empty">Genere un reporte para ver los datos</div>}
            </section>
        </div>
    );
};

export default VentasReport;
