import { useState } from 'react';
import { Card, Row, Col, Button, Space, Empty, Spin, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        <div style={{ padding: 24 }}>
            <Card title="Reporte de Entregas OC" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <YearMonthSelector params={params} setParams={setParams} />
                    <Space>
                        <Button type="primary" size="large" onClick={handleGenerateReport} loading={loading}>
                            Generar Reporte
                        </Button>
                        <Button icon={<DownloadOutlined />} size="large" onClick={handleExportExcel} disabled={!data}>
                            Descargar Excel
                        </Button>
                    </Space>
                </Space>
            </Card>

            {loading && (
                <Card style={{ textAlign: 'center', padding: 50 }}>
                    <Spin size="large" />
                </Card>
            )}

            {!loading && data && (
                <>
                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                        {data.resumen.totalOrdenes}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Total Órdenes</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                        {data.resumen.conformes}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Conformes</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                                        {data.resumen.noConformes}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>No Conformes</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                                        {data.resumen.porcentajeConformidad.toFixed(2)}%
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Conformidad</div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Entregas por Mes" style={{ marginBottom: 24 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="conforme" stroke="#52c41a" name="Conforme" />
                                <Line type="monotone" dataKey="noConforme" stroke="#f5222d" name="No Conforme" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Detalle de Entregas">
                        <Table
                            columns={columns}
                            dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1200 }}
                        />
                    </Card>
                </>
            )}

            {!loading && !data && <Empty description="Genere un reporte para ver los datos" />}
        </div>
    );
};

export default EntregasReport;
