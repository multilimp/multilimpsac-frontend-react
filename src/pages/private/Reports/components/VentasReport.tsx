import { useState } from 'react';
import { Card, Row, Col, Select, Button, Space, Empty, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { fetchVentasReport, exportVentasReport } from '@/services/reports/reports.api';

const VentasReport = () => {
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

    const handleGenerateReport = async () => {
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
    };

    const handleExportExcel = () => {
        if (!data) {
            message.warning('Primero debe generar el reporte');
            return;
        }
        exportVentasReport(data);
        message.success('Archivo descargado');
    };

    const columns = [
        { title: 'Código Venta', dataIndex: 'codigoVenta', key: 'codigoVenta' },
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

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={24} style={{ minHeight: 'calc(100vh - 200px)' }}>
                {/* Columna Izquierda - Filtros */}
                <Col xs={24} sm={24} md={6}>
                    <Card title="Filtros" style={{ position: 'sticky', top: 20 }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div className="form-group">
                                <label>Año</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={year}
                                    onChange={setYear}
                                    options={Array.from({ length: 5 }, (_, i) => ({
                                        value: new Date().getFullYear() - i,
                                        label: String(new Date().getFullYear() - i),
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mes Inicio</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={mesInicio}
                                    onChange={setMesInicio}
                                    options={meses}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mes Fin</label>
                                <Select
                                    style={{ width: '100%' }}
                                    value={mesFin}
                                    onChange={setMesFin}
                                    options={meses}
                                />
                            </div>
                            <div className="form-group">
                                <label>Rango Utilidad (Opcional)</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todos"
                                    allowClear
                                    value={filtroRango || undefined}
                                    onChange={setFiltroRango}
                                    options={rangos}
                                />
                            </div>

                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" size="large" onClick={handleGenerateReport} loading={loading} block>
                                    Generar Reporte
                                </Button>
                                <Button icon={<DownloadOutlined />} size="large" onClick={handleExportExcel} disabled={!data} block>
                                    Descargar Excel
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                </Col>

                {/* Columna Derecha - Contenido */}
                <Col xs={24} sm={24} md={18}>
                    {loading && (
                        <Card style={{ textAlign: 'center', padding: 50 }}>
                            <Spin size="large" />
                        </Card>
                    )}

                    {!loading && data && (
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Resumen */}
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                                S/ {data.resumen.totalVentas.toFixed(2)}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Total Ventas</div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                                {data.resumen.cantidadOrdenes}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Órdenes</div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                                                S/ {data.resumen.utilidadTotal.toFixed(2)}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Utilidad Total</div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                                                {data.resumen.porcentajeUtilidadPromedio.toFixed(2)}%
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Utilidad Promedio</div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Gráfico mensual */}
                            <Card title="Ventas Mensuales">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.gráficoMensual.meses.map((mes: string, i: number) => ({
                                        mes,
                                        monto: data.gráficoMensual.datos[i],
                                    }))}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip formatter={(value: any) => `S/ ${value.toFixed(2)}`} />
                                        <Bar dataKey="monto" fill="#1890ff" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Tabla */}
                            <Card title="Detalle de Ventas">
                                <Table
                                    columns={columns}
                                    dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                    pagination={{ pageSize: 10 }}
                                    scroll={{ x: 1000 }}
                                />
                            </Card>
                        </Space>
                    )}

                    {!loading && !data && <Empty description="Genere un reporte para ver los datos" />}
                </Col>
            </Row>
        </div>
    );
};

export default VentasReport;
