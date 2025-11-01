import React, { useState, useMemo, useCallback } from 'react';
import {
    Card,
    Chip,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Button, Space, Badge, Tooltip } from 'antd';
import { Button as MuiButton } from '@mui/material';
import {
    DollarOutlined,
    WarningOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboardTesoreria } from '@/hooks/useDashboardTesoreria';
import { PagoPorEstado } from '@/services/notificaciones/notificaciones.request';
import { formatCurrency } from '@/utils/functions';
import AntTable from './AntTable';
import type { AntColumnType } from './AntTable';
import { Visibility } from '@mui/icons-material';

type FiltroEstado = 'TODOS' | 'URGENTE' | 'PENDIENTE';

const PaymentTable = React.memo<{
    pagos: PagoPorEstado[];
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | null) => string;
    onRowClick: (pago: PagoPorEstado) => void;
    onRefresh: () => Promise<void>;
}>(({ pagos, formatCurrency, formatDate, onRowClick, onRefresh }) => {
    const [filtroActivo, setFiltroActivo] = useState<FiltroEstado>('TODOS');

    const pagosFiltrados = useMemo(() => {
        if (filtroActivo === 'TODOS') return pagos;
        return pagos.filter(pago => pago.estadoPago === filtroActivo);
    }, [pagos, filtroActivo]);

    const urgentesCount = useMemo(() => pagos.filter(p => p.estadoPago === 'URGENTE').length, [pagos]);
    const pendientesCount = useMemo(() => pagos.filter(p => p.estadoPago === 'PENDIENTE').length, [pagos]);

    const columns: AntColumnType<PagoPorEstado>[] = useMemo(
        () => [
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                width: 150,
                filter: true,
                render: (codigo: string) => (
                    <Tooltip title="Editar venta">
                        <MuiButton
                            variant="contained"
                            startIcon={<Visibility />}
                            size="small"
                            color="info"
                            style={{ width: '100%' }}
                        >
                            {codigo}
                        </MuiButton>
                    </Tooltip>
                ),
            },
            {
                title: 'Proveedor/Transporte',
                dataIndex: 'cliente',
                key: 'cliente',
                width: 280,
                filter: true,
                render: (_: unknown, record: PagoPorEstado) => (
                    <Box>
                        <Typography variant="body2" fontWeight="medium">
                            {record.cliente}
                        </Typography>
                        {record.tipo === 'TRANSPORTE' && record.transporteRuc && (
                            <Typography variant="caption" color="textSecondary">
                                RUC: {record.transporteRuc}
                            </Typography>
                        )}
                        {record.tipo === 'OP' && record.proveedorRuc && (
                            <Typography variant="caption" color="textSecondary">
                                RUC: {record.proveedorRuc}
                            </Typography>
                        )}
                    </Box>
                ),
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                width: 180,
                filter: true,
                render: (tipo: string) => (
                    <Chip
                        label={tipo === 'TRANSPORTE' ? 'Transporte' : 'Orden Proveedor'}
                        color={tipo === 'TRANSPORTE' ? 'info' : 'success'}
                        size="small"
                        sx={{
                            fontWeight: 600,
                            ...(tipo === 'TRANSPORTE' ? {
                                backgroundColor: '#0ea5e9',
                                color: 'white',
                                '&:hover': { backgroundColor: '#0284c7' }
                            } : {
                                backgroundColor: '#10b981',
                                color: 'white',
                                '&:hover': { backgroundColor: '#059669' }
                            })
                        }}
                    />
                ),
            },
            // {
            //     title: 'Monto',
            //     dataIndex: 'monto',
            //     key: 'monto',
            //     width: 150,
            //     sort: true,
            //     render: (monto: number) => (
            //         <Typography variant="body2" fontFamily="monospace">
            //             {formatCurrency(monto)}
            //         </Typography>
            //     ),
            // },
            {
                title: 'Nota',
                dataIndex: 'notaPago',
                key: 'notaPago',
                width: 200,
                filter: true,
                render: (notaPago: string | null) => (
                    <Typography
                        variant="body2"
                        sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {notaPago || 'Sin nota'}
                    </Typography>
                ),
            },

            {
                title: 'Estado',
                dataIndex: 'estadoPago',
                key: 'estadoPago',
                width: 150,
                filter: true,
                render: (estadoPago: string) => (
                    <Chip
                        label={estadoPago}
                        color={estadoPago === 'URGENTE' ? 'error' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                ),
            },
        ],
        [formatCurrency]
    );

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Space size="middle">
                    <Button
                        type={filtroActivo === 'TODOS' ? 'primary' : 'default'}
                        icon={<DollarOutlined />}
                        size="large"
                        onClick={() => setFiltroActivo('TODOS')}
                        style={{ minWidth: 150 }}
                    >
                        Todos {`(${pagos.length})`}
                    </Button>
                    <Button
                        type={filtroActivo === 'URGENTE' ? 'primary' : 'default'}
                        danger={filtroActivo === 'URGENTE'}
                        icon={<WarningOutlined />}
                        size="large"
                        onClick={() => setFiltroActivo('URGENTE')}
                        style={{ minWidth: 150 }}
                    >
                        Urgentes {`(${urgentesCount})`}
                    </Button>
                    <Button
                        type={filtroActivo === 'PENDIENTE' ? 'primary' : 'default'}
                        icon={<ClockCircleOutlined />}
                        size="large"
                        onClick={() => setFiltroActivo('PENDIENTE')}
                        style={{
                            minWidth: 150,
                            ...(filtroActivo === 'PENDIENTE' && {
                                backgroundColor: '#faad14',
                                borderColor: '#faad14',
                                color: 'white'
                            })
                        }}
                    >
                        Pendientes {`(${pendientesCount})`}
                    </Button>
                </Space>
            </Box>

            <AntTable
                columns={columns}
                data={pagosFiltrados}
                onReload={onRefresh}
                // Mostrar toolbar para habilitar filtros por columna
                hideToolbar={false}
                rowKey={(record) => `${record.tipo}-${record.codigo}`}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' },
                })}
                scroll={{ y: 600 }}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Mostrando {pagosFiltrados.length} de {pagos.length} pagos
                </Typography>
            </Box>
        </Box>
    );
});

PaymentTable.displayName = 'PaymentTable';

const DashboardTesoreria: React.FC = () => {
    const navigate = useNavigate();
    const {
        loading,
        error,
        transportesPendientes,
        transportesUrgentes,
        ordenesProveedorUrgentes,
        ordenesProveedorPendientes,
        refreshPagosUrgentes,
        refreshPagosPendientes,
    } = useDashboardTesoreria();

    const handleRowClick = useCallback((pago: PagoPorEstado) => {
        const section = pago.tipo === 'TRANSPORTE' ? 'transporte' : 'proveedor';
        navigate(`/provider-orders/${pago.id}?from=treasury&section=${section}`);
    }, [navigate]);

    const formatDate = useCallback((date: Date | null): string => {
        if (!date) return 'Sin fecha';
        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(date));
    }, []);

    const transformTransportesToPagoPorEstado = useCallback((transportes: any[], estado: 'URGENTE' | 'PENDIENTE'): PagoPorEstado[] => {
        return transportes.map(transporte => ({
            id: transporte.ordenProveedor?.id || transporte.id,
            tipo: 'TRANSPORTE' as const,
            codigo: transporte.codigoTransporte,
            cliente: transporte.transporte?.razonSocial || 'Sin transporte',
            transporteRazonSocial: transporte.transporte?.razonSocial,
            transporteRuc: transporte.transporte?.ruc,
            monto: transporte.montoFlete,
            fechaVencimiento: null,
            estadoPago: estado,
            notaPago: transporte.notaPago,
            fechaCreacion: transporte.createdAt,
            grt: transporte.ordenProveedor?.ordenCompra?.codigo,
            region: transporte.ordenProveedor?.ordenCompra?.cliente?.region,
            provincia: transporte.ordenProveedor?.ordenCompra?.cliente?.provincia,
        }));
    }, []);

    const transformOrdenesProveedorToPagoPorEstado = useCallback((ordenes: any[], estado: 'URGENTE' | 'PENDIENTE'): PagoPorEstado[] => {
        return ordenes.map(orden => ({
            id: orden.id,
            tipo: 'OP' as const,
            codigo: orden.codigoOp,
            cliente: orden.proveedor?.razonSocial || 'Sin proveedor',
            proveedorRazonSocial: orden.proveedor?.razonSocial,
            proveedorRuc: orden.proveedor?.ruc,
            monto: orden.montoTotal || 0,
            fechaVencimiento: null,
            estadoPago: estado,
            notaPago: orden.notaPago,
            fechaCreacion: orden.createdAt,
            grt: orden.ordenCompra?.codigoVenta || orden.ordenCompra?.codigo,
            region: orden.ordenCompra?.cliente?.region,
            provincia: orden.ordenCompra?.cliente?.provincia,
        }));
    }, []);

    const todosPagosCombinados = useMemo(() => {
        const transUrgentes = transformTransportesToPagoPorEstado(transportesUrgentes || [], 'URGENTE');
        const transPendientes = transformTransportesToPagoPorEstado(transportesPendientes || [], 'PENDIENTE');
        const opUrgentes = transformOrdenesProveedorToPagoPorEstado(ordenesProveedorUrgentes || [], 'URGENTE');
        const opPendientes = transformOrdenesProveedorToPagoPorEstado(ordenesProveedorPendientes || [], 'PENDIENTE');

        return [...transUrgentes, ...transPendientes, ...opUrgentes, ...opPendientes].sort((a, b) => {
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
    }, [transportesUrgentes, transportesPendientes, ordenesProveedorUrgentes, ordenesProveedorPendientes, transformTransportesToPagoPorEstado, transformOrdenesProveedorToPagoPorEstado]);

    const handleRefresh = useCallback(async () => {
        await Promise.all([refreshPagosUrgentes(), refreshPagosPendientes()]);
    }, [refreshPagosUrgentes, refreshPagosPendientes]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress size={60} />
                <Typography sx={{ ml: 2 }} variant="h6">Cargando datos...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                Error al cargar el dashboard: {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Card variant="outlined" sx={{ p: 3 }}>
                <PaymentTable
                    pagos={todosPagosCombinados}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    onRowClick={handleRowClick}
                    onRefresh={handleRefresh}
                />
            </Card>
        </Box>
    );
};

export default React.memo(DashboardTesoreria);
