import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Space, Empty, Spin, Table, message } from 'antd';
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
        <div style={{ padding: 24 }}>
            <Row gutter={24} style={{ minHeight: 'calc(100vh - 200px)' }}>
                {/* Columna Izquierda - Filtros */}
                <Col xs={24} sm={24} md={6}>
                    <Card title="Filtros" style={{ position: 'sticky', top: 20 }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <YearMonthSelector params={params} setParams={setParams} />

                            <div className="form-group">
                                <label>Empresa (Opcional)</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todas las empresas"
                                    allowClear
                                    value={empresaId || undefined}
                                    onChange={setEmpresaId}
                                    options={empresas.map((e) => ({ value: e.id, label: e.razonSocial }))}
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
                            <Row gutter={16}>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                                {data.resumen.totalOrdenes}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Total de Órdenes</div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                                S/ {data.resumen.totalVentas.toFixed(2)}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Total de Ventas</div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Card>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                                                S/ {data.resumen.totalUtilidad.toFixed(2)}
                                            </div>
                                            <div style={{ color: '#666', marginTop: 8 }}>Total de Utilidad</div>
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

                            <Card title="Rangos de Utilidad">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="rango" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="cantidad" fill="#1890ff" name="Cantidad" />
                                        <Bar yAxisId="right" dataKey="utilidad" fill="#f5222d" name="Utilidad (S/)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>

                            <Card title="Detalle de Rangos">
                                <Table
                                    columns={columns}
                                    dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                    pagination={false}
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

export default UtilidadReport;
