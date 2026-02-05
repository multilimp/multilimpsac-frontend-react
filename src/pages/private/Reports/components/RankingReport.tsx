import { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Space, Empty, Spin, Table, message } from 'antd';
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
        <div style={{ padding: 24 }}>
            <Card title="Reporte de Ranking" style={{ marginBottom: 24 }}>
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
                        <Col xs={24} sm={12} md={6}>
                            <div className="form-group">
                                <label>Mes (Opcional)</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todos los meses"
                                    allowClear
                                    value={mes || undefined}
                                    onChange={setMes}
                                    options={meses}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                            <div className="form-group">
                                <label>Región (Opcional)</label>
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="Todas las regiones"
                                    allowClear
                                    disabled={!data}
                                    value={region || undefined}
                                    onChange={setRegion}
                                    options={regiones.map((r) => ({ value: r, label: r }))}
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
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                                        {data.resumen.totalOrdenes}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Total Órdenes</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Card>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                                        S/ {data.resumen.montoTotal.toFixed(2)}
                                    </div>
                                    <div style={{ color: '#666', marginTop: 8 }}>Monto Total</div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col xs={24} lg={12}>
                            <Card title="Top 3 Departamentos">
                                <Table
                                    columns={deptoColumns}
                                    dataSource={data.topDepartamentos.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                    pagination={false}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Card title="Top 3 Clientes">
                                <Table
                                    columns={clienteColumns}
                                    dataSource={data.topClientes.map((row: any, idx: number) => ({ ...row, key: idx }))}
                                    pagination={false}
                                />
                            </Card>
                        </Col>
                    </Row>
                </>
            )}

            {!loading && !data && <Empty description="Genere un reporte para ver los datos" />}
        </div>
    );
};

export default RankingReport;
