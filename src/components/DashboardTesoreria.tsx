import React, { useState, useMemo, useCallback } from 'react';
import {
    Card,
    CardContent,
    Tabs,
    Tab,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Alert,
    CircularProgress,
    TextField,
    InputAdornment,
    TableSortLabel,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    Warning as WarningIcon,
    Schedule as ClockIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDashboardTesoreria } from '@/hooks/useDashboardTesoreria';
import { PagoPorEstado } from '@/services/notificaciones/notificaciones.request';
import { formatCurrency } from '@/utils/functions';

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
const PaymentTableRow = React.memo<{
    pago: PagoPorEstado;
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | null) => string;
    onRowClick: (pago: PagoPorEstado) => void;
}>(({ pago, formatCurrency, formatDate, onRowClick }) => (
    <TableRow
        hover
        onClick={() => onRowClick(pago)}
        sx={{
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
        }}
    >
        <TableCell>
            <Typography variant="body2" fontFamily="monospace">
                {pago.codigo}
            </Typography>
        </TableCell>
        <TableCell>
            <Chip
                label={pago.tipo === 'TRANSPORTE' ? 'Transporte' : 'Orden Proveedor'}
                color={pago.tipo === 'TRANSPORTE' ? 'info' : 'success'}
                size="small"
                sx={{
                    fontWeight: 600,
                    ...(pago.tipo === 'TRANSPORTE' ? {
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
        </TableCell>
        <TableCell>
            <Box>
                <Typography variant="body2" fontWeight="medium">
                    {pago.cliente}
                </Typography>
                {pago.tipo === 'TRANSPORTE' && pago.transporteRuc && (
                    <Typography variant="caption" color="textSecondary">
                        RUC: {pago.transporteRuc}
                    </Typography>
                )}
                {pago.tipo === 'OP' && pago.proveedorRuc && (
                    <Typography variant="caption" color="textSecondary">
                        RUC: {pago.proveedorRuc}
                    </Typography>
                )}
            </Box>
        </TableCell>
        <TableCell>
            <Typography variant="body2" fontFamily="monospace">
                {formatCurrency(pago.monto)}
            </Typography>
        </TableCell>
        <TableCell>
            <Chip
                label={pago.estadoPago}
                color={pago.estadoPago === 'URGENTE' ? 'error' : 'warning'}
                size="small"
            />
        </TableCell>
        <TableCell>
            <Typography
                variant="body2"
                sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {pago.notaPago || 'Sin nota'}
            </Typography>
        </TableCell>
    </TableRow>
));

PaymentTableRow.displayName = 'PaymentTableRow';

// Componente memoizado para tabla de pagos
const PaymentTable = React.memo<{
    pagos: PagoPorEstado[];
    tipo: 'urgentes' | 'pendientes';
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | null) => string;
    onRowClick: (pago: PagoPorEstado) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}>(({ pagos, tipo, formatCurrency, formatDate, onRowClick, onRefresh, isRefreshing }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [orderBy, setOrderBy] = useState<'codigo' | 'cliente' | 'monto' | 'tipo'>('codigo');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const handleRequestSort = (property: 'codigo' | 'cliente' | 'monto' | 'tipo') => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredAndSortedPagos = useMemo(() => {
        let filtered = pagos.filter(pago =>
            pago.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pago.notaPago && pago.notaPago.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (orderBy) {
                case 'codigo':
                    comparison = a.codigo.localeCompare(b.codigo);
                    break;
                case 'cliente':
                    comparison = a.cliente.localeCompare(b.cliente);
                    break;
                case 'monto':
                    comparison = a.monto - b.monto;
                    break;
                case 'tipo':
                    comparison = a.tipo.localeCompare(b.tipo);
                    break;
            }
            return order === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [pagos, searchTerm, orderBy, order]);

    if (pagos.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="textSecondary" variant="h6">
                    No hay pagos {tipo} en este momento
                </Typography>
                <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                    Los pagos {tipo} aparecerán aquí cuando estén disponibles
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                    size="small"
                    placeholder="Buscar por código, cliente o nota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ maxWidth: 400 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Tooltip title="Actualizar datos">
                    <IconButton
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        color="primary"
                        sx={{
                            minWidth: 40,
                            height: 40,
                        }}
                    >
                        <RefreshIcon
                            sx={{
                                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                    '0%': {
                                        transform: 'rotate(0deg)',
                                    },
                                    '100%': {
                                        transform: 'rotate(360deg)',
                                    },
                                },
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'codigo'}
                                    direction={orderBy === 'codigo' ? order : 'asc'}
                                    onClick={() => handleRequestSort('codigo')}
                                >
                                    <strong>Código</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'tipo'}
                                    direction={orderBy === 'tipo' ? order : 'asc'}
                                    onClick={() => handleRequestSort('tipo')}
                                >
                                    <strong>Tipo</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'cliente'}
                                    direction={orderBy === 'cliente' ? order : 'asc'}
                                    onClick={() => handleRequestSort('cliente')}
                                >
                                    <strong>Proveedor/Transporte</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'monto'}
                                    direction={orderBy === 'monto' ? order : 'asc'}
                                    onClick={() => handleRequestSort('monto')}
                                >
                                    <strong>Monto</strong>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell><strong>Nota</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAndSortedPagos.map((pago) => (
                            <PaymentTableRow
                                key={`${pago.tipo}-${pago.id}`}
                                pago={pago}
                                formatCurrency={formatCurrency}
                                formatDate={formatDate}
                                onRowClick={onRowClick}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    Mostrando {filteredAndSortedPagos.length} de {pagos.length} pagos
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

    const [activeTab, setActiveTab] = useState<number>(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
        setIsRefreshing(true);
        await refreshPagosUrgentes();
        setIsRefreshing(false);
    }, [refreshPagosUrgentes]);

    const handleRefreshPendientes = useCallback(async () => {
        setIsRefreshing(true);
        await refreshPagosPendientes();
        setIsRefreshing(false);
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
                            isRefreshing={isRefreshing}
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
                            isRefreshing={isRefreshing}
                        />
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default React.memo(DashboardTesoreria);
