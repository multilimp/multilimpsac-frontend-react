import { useState } from 'react';
import { Card, Row, Col, Select, Button, Space, Empty, Spin, Table, message, Checkbox } from 'antd';
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
        <div style={{ padding: 24 }}>
            <Card title="Reporte de Cobranza" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={6}>
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
                        </Col>
                        <Col xs={24} md={18}>
                            <div className="form-group">
                                <label>Filtrar por Etapas SIAF (Opcional)</label>
                                <Checkbox.Group
                                    value={etapas}
                                    onChange={(val) => setEtapas(val as string[])}
                                    options={ETAPAS_SIAF.map((e) => ({ label: e, value: e }))}
                                    style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
                                />
                            </div>
                        </Col>
                    </Row>

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
                                        S/ {data.resumen.montoTotal.toFixed(2)}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Monto Total</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#f5222d' }}>
                                        S/ {data.resumen.montoPendiente.toFixed(2)}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Monto Pendiente</div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Cobranza Mensual" style={{ marginBottom: 24 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip formatter={(value: any) => `S/ ${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="monto" fill="#1890ff" name="Monto Total" />
                                <Bar dataKey="pendiente" fill="#f5222d" name="Pendiente" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Detalle de Cobranza">
                        <Table
                            columns={columns}
                            dataSource={data.tabla.map((row: any, idx: number) => ({ ...row, key: idx }))}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                        />
                    </Card>
                </>
            )}

            {!loading && !data && <Empty description="Genere un reporte para ver los datos" />}
        </div>
    );
};

export default CobranzaReport;
