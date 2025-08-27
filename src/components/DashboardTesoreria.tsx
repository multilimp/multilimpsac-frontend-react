import React, { useState, useMemo, useCallback } from 'react';
import {
    Card,
    CardContent,
    Tabs,
    Tab,
    Button,
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
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    AttachMoney as MoneyIcon,
    Warning as WarningIcon,
    Schedule as ClockIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useDashboardTesoreria } from '@/hooks/useDashboardTesoreria';
import { PagoPorEstado } from '@/services/notificaciones/notificaciones.request';

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
}>(({ pago, formatCurrency, formatDate }) => (
    <TableRow hover>
        <TableCell>
            <Typography variant="body2" fontFamily="monospace">
                {pago.codigo}
            </Typography>
        </TableCell>
        <TableCell>
            <Chip
                label={pago.tipo === 'TRANSPORTE' ? 'Transporte' : 'Venta Privada'}
                color={pago.tipo === 'TRANSPORTE' ? 'default' : 'primary'}
                size="small"
            />
        </TableCell>
        <TableCell>
            <Box>
                <Typography variant="body2" fontWeight="medium">
                    {pago.cliente}
                </Typography>
                {pago.transporteRazonSocial && (
                    <Typography variant="caption" color="textSecondary">
                        {pago.transporteRazonSocial}
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
            <Typography variant="body2">
                {formatDate(pago.fechaVencimiento)}
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
}>(({ pagos, tipo, formatCurrency, formatDate }) => {
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
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Código</strong></TableCell>
                        <TableCell><strong>Tipo</strong></TableCell>
                        <TableCell><strong>Cliente/Transporte</strong></TableCell>
                        <TableCell><strong>Monto</strong></TableCell>
                        <TableCell><strong>Fecha Vencimiento</strong></TableCell>
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Nota</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pagos.map((pago) => (
                        <PaymentTableRow
                            key={`${pago.tipo}-${pago.id}`}
                            pago={pago}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

PaymentTable.displayName = 'PaymentTable';

const DashboardTesoreria: React.FC = () => {
    const {
        loading,
        error,
        lastUpdate,
        refresh,
        transportesPendientes,
        transportesUrgentes,
        ventasPrivadasPendientes,
        ventasPrivadasUrgentes,
        estadisticas,
        totalPagos,
        montoTotal,
        hasData,
    } = useDashboardTesoreria();

    const [activeTab, setActiveTab] = useState<number>(0);

    // Memoización de funciones de formateo
    const formatCurrency = useCallback((amount: number): string => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(amount);
    }, []);

    const formatDate = useCallback((date: Date | null): string => {
        if (!date) return 'Sin fecha';
        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(date));
    }, []);

    // Memoización de datos combinados para las tabs
    const tabsData = useMemo(() => ({
        urgentes: [...transportesUrgentes, ...ventasPrivadasUrgentes],
        pendientes: [...transportesPendientes, ...ventasPrivadasPendientes],
    }), [transportesUrgentes, ventasPrivadasUrgentes, transportesPendientes, ventasPrivadasPendientes]);

    // Handler memoizado para cambio de tab
    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    }, []);

    // Estados de carga inicial
    if (loading && !hasData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress size={60} />
                <Typography sx={{ ml: 2 }} variant="h6">Cargando dashboard...</Typography>
            </Box>
        );
    }

    // Estado de error sin datos
    if (error && !hasData) {
        return (
            <Alert
                severity="error"
                action={
                    <Button color="inherit" size="small" onClick={refresh}>
                        Reintentar
                    </Button>
                }
            >
                Error al cargar el dashboard: {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header con información y botón de refresh */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Dashboard de Tesorería
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    onClick={refresh}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
                >
                    {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
            </Box>

            {/* Tarjetas de estadísticas */}
            {hasData && (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 3,
                    mb: 4
                }}>
                    <StatsCard
                        title="Total de Pagos"
                        value={totalPagos}
                        icon={<TrendingUpIcon />}
                        color="primary"
                    />
                    <StatsCard
                        title="Monto Total"
                        value={formatCurrency(montoTotal)}
                        icon={<MoneyIcon />}
                        color="primary"
                    />
                    <StatsCard
                        title="Pagos Urgentes"
                        value={estadisticas?.urgentes.total || 0}
                        icon={<WarningIcon />}
                        color="error"
                    />
                    <StatsCard
                        title="Pagos Pendientes"
                        value={estadisticas?.pendientes.total || 0}
                        icon={<ClockIcon />}
                        color="warning"
                    />
                </Box>
            )}

            {/* Alert de error si hay datos previos */}
            {error && hasData && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Error al actualizar: {error}
                </Alert>
            )}

            {/* Contenido principal con tabs */}
            <Card variant="outlined">
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="tabs de pagos"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label={`Pagos Urgentes (${tabsData.urgentes.length})`}
                        icon={<WarningIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Pagos Pendientes (${tabsData.pendientes.length})`}
                        icon={<ClockIcon />}
                        iconPosition="start"
                    />
                </Tabs>

                {/* Contenido de las tabs */}
                <Box sx={{ p: 3 }}>
                    {activeTab === 0 && (
                        <PaymentTable
                            pagos={tabsData.urgentes}
                            tipo="urgentes"
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    )}

                    {activeTab === 1 && (
                        <PaymentTable
                            pagos={tabsData.pendientes}
                            tipo="pendientes"
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    )}
                </Box>
            </Card>
        </Box>
    );
};

export default React.memo(DashboardTesoreria);
