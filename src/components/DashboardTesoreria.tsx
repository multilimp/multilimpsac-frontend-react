import React, { useState, useMemo, useCallback } from 'react';
import {
    Card,
    CardContent,
    Tabs,
    Tab,
    Chip,
    Typography,
    Box,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    Warning as WarningIcon,
    Schedule as ClockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDashboardTesoreria } from '@/hooks/useDashboardTesoreria';
import { PagoPorEstado } from '@/services/notificaciones/notificaciones.request';
import { formatCurrency } from '@/utils/functions';
import AntTable from './AntTable';
import type { AntColumnType } from './AntTable';

// Componente memoizado para tarjetas de estadísticas
const StatsCard = React.memo<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'error' | 'warning' | 'primary';
}>(({ title, value, icon, color }) => {
    return (
        <Card
            elevation={2}
            sx={{
                borderLeft: 4,
                borderLeftColor: color === 'error' ? 'error.main' :
                    color === 'warning' ? 'warning.main' : 'primary.main',
                background: color === 'error' ? '#fef2f2' :
                    color === 'warning' ? '#fffbeb' : '#eff6ff',
                height: '100%',
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" fontWeight="bold">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{ fontSize: 48, opacity: 0.5, color: `${color}.main` }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

StatsCard.displayName = 'StatsCard';

// Componente memoizado para fila de tabla (micro-optimización)

const PaymentTable = React.memo<{
    pagos: PagoPorEstado[];
    tipo: 'urgentes' | 'pendientes';
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | null) => string;
    onRowClick: (pago: PagoPorEstado) => void;
    onRefresh: () => Promise<void>;
}>(({ pagos, tipo, formatCurrency, formatDate, onRowClick, onRefresh }) => {
    const columns: AntColumnType<PagoPorEstado>[] = useMemo(
        () => [
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                width: 150,
                render: (codigo: string) => (
                    <Typography variant="body2" fontFamily="monospace">
                        {codigo}
                    </Typography>
                ),
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                width: 180,
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
            {
                title: 'Proveedor/Transporte',
                dataIndex: 'cliente',
                key: 'cliente',
                width: 280,
                render: (_: any, record: PagoPorEstado) => (
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
                title: 'Monto',
                dataIndex: 'monto',
                key: 'monto',
                width: 150,
                render: (monto: number) => (
                    <Typography variant="body2" fontFamily="monospace">
                        {formatCurrency(monto)}
                    </Typography>
                ),
            },
            {
                title: 'Estado',
                dataIndex: 'estadoPago',
                key: 'estadoPago',
                width: 150,
                render: (estadoPago: string) => (
                    <Chip
                        label={estadoPago}
                        color={estadoPago === 'URGENTE' ? 'error' : 'warning'}
                        size="small"
                    />
                ),
            },
            {
                title: 'Nota',
                dataIndex: 'notaPago',
                key: 'notaPago',
                width: 200,
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
        ],
        [formatCurrency]
    );

    return (
        <Box>
            <AntTable
                columns={columns}
                data={pagos}
                onReload={onRefresh}
                hideToolbar
                rowKey={(record) => record.id?.toString() || `${record.tipo}-${record.codigo}`}
                onRow={(record) => ({
                    onClick: () => onRowClick(record),
                    style: { cursor: 'pointer' },
                })}
                scroll={{ y: 600 }}
            />

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Mostrando {pagos.length} pagos
                </Typography>
            </Box>
        </Box>
    );
});

// Componente memoizado para tabla de pagos

PaymentTable.displayName = 'PaymentTable';

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

    const [activeTab, setActiveTab] = useState<number>(0);

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

    // Transformar datos de tesorería al formato PagoPorEstado
    const transformTransportesToPagoPorEstado = useCallback((transportes: any[], estado: 'URGENTE' | 'PENDIENTE'): PagoPorEstado[] => {
        return transportes.map(transporte => ({
            id: transporte.ordenProveedor?.id || transporte.id, // Usar el ID de la OP, no del transporte
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

    // Combinar transportes y órdenes de proveedor urgentes en una sola lista
    const pagosUrgentesCombinados = useMemo(() => {
        const transportes = transformTransportesToPagoPorEstado(transportesUrgentes || [], 'URGENTE');
        const ordenesProveedor = transformOrdenesProveedorToPagoPorEstado(ordenesProveedorUrgentes || [], 'URGENTE');
        return [...transportes, ...ordenesProveedor].sort((a, b) => {
            // Ordenar por fecha de creación (más recientes primero)
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
    }, [transportesUrgentes, ordenesProveedorUrgentes, transformTransportesToPagoPorEstado, transformOrdenesProveedorToPagoPorEstado]);

    // Combinar transportes y órdenes de proveedor pendientes en una sola lista
    const pagosPendientesCombinados = useMemo(() => {
        const transportes = transformTransportesToPagoPorEstado(transportesPendientes || [], 'PENDIENTE');
        const ordenesProveedor = transformOrdenesProveedorToPagoPorEstado(ordenesProveedorPendientes || [], 'PENDIENTE');
        return [...transportes, ...ordenesProveedor].sort((a, b) => {
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
    }, [transportesPendientes, ordenesProveedorPendientes, transformTransportesToPagoPorEstado, transformOrdenesProveedorToPagoPorEstado]);

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    }, []);

    const handleRefreshUrgentes = useCallback(async () => {
        await refreshPagosUrgentes();
    }, [refreshPagosUrgentes]);

    const handleRefreshPendientes = useCallback(async () => {
        await refreshPagosPendientes();
    }, [refreshPagosPendientes]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress size={60} />
                <Typography sx={{ ml: 2 }} variant="h6">Cargando dashboard...</Typography>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Dashboard de Tesorería
                    </Typography>
                </Box>
            </Box>

            <Card variant="outlined">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="tabs de pagos"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label={`Pagos Urgentes (${pagosUrgentesCombinados?.length || 0})`}
                        icon={<WarningIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Pagos Pendientes (${pagosPendientesCombinados?.length || 0})`}
                        icon={<ClockIcon />}
                        iconPosition="start"
                    />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {activeTab === 0 && (
                        <PaymentTable
                            pagos={pagosUrgentesCombinados}
                            tipo="urgentes"
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                            onRowClick={handleRowClick}
                            onRefresh={handleRefreshUrgentes}
                        />
                    )}

                    {activeTab === 1 && (
                        <PaymentTable
                            pagos={pagosPendientesCombinados}
                            tipo="pendientes"
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                            onRowClick={handleRowClick}
                            onRefresh={handleRefreshPendientes}
                        />
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default React.memo(DashboardTesoreria);
