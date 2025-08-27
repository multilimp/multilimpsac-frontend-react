import React, { useState } from 'react';
import {
    Alert,
    Badge,
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Divider,
    Paper
} from '@mui/material';
import {
    NotificationsActive,
    ExpandLess,
    ExpandMore,
    Payment,
    LocalShipping,
    Business,
    Error,
    Refresh
} from '@mui/icons-material';
import { formatCurrency, formattedDate } from '@/utils/functions';
import { PagoUrgente } from '@/services/notificaciones/notificaciones.request';
import { usePagosUrgentes } from '@/hooks/usePagosUrgentes';

const NotificacionesPagosUrgentes: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { data, loading, error, refresh, totalUrgentes } = usePagosUrgentes();

    const handleToggle = () => {
        setOpen(!open);
        if (!open && !data) {
            refresh();
        }
    };

    const allPagos: PagoUrgente[] = [
        ...(data?.data.transportes || []),
        ...(data?.data.ventasPrivadas || [])
    ];

    // Solo mostrar si hay pagos urgentes
    if (totalUrgentes === 0 && !loading) {
        return null;
    }

    const getIconoTipo = (tipo: string) => {
        switch (tipo) {
            case 'TRANSPORTE':
                return <LocalShipping sx={{ fontSize: 16 }} />;
            case 'VENTA_PRIVADA':
                return <Business sx={{ fontSize: 16 }} />;
            default:
                return <Payment sx={{ fontSize: 16 }} />;
        }
    };

    const getColorTipo = (tipo: string) => {
        switch (tipo) {
            case 'TRANSPORTE':
                return 'warning';
            case 'VENTA_PRIVADA':
                return 'info';
            default:
                return 'error';
        }
    };

    return (
        <Box sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000, minWidth: 320 }}>
            {/* Botón de notificación principal */}
            <Paper
                elevation={6}
                sx={{
                    p: 1,
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    borderRadius: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                        backgroundColor: '#b71c1c'
                    }
                }}
                onClick={handleToggle}
            >
                <Badge badgeContent={totalUrgentes} color="error">
                    <NotificationsActive />
                </Badge>
                <Typography variant="body2" fontWeight={600}>
                    {totalUrgentes} Pagos Urgentes
                </Typography>
                <Typography variant="caption" sx={{ ml: 'auto' }}>
                    {data?.estadisticas.montoTotal ? formatCurrency(data.estadisticas.montoTotal) : ''}
                </Typography>
                <IconButton size="small" sx={{ color: 'white' }}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Paper>

            {/* Panel desplegable con detalles */}
            <Collapse in={open} sx={{ mt: 1 }}>
                <Paper elevation={4} sx={{ maxHeight: 400, overflow: 'auto', borderRadius: 2 }}>
                    {error && (
                        <Alert
                            severity="error"
                            action={
                                <IconButton size="small" onClick={refresh}>
                                    <Refresh />
                                </IconButton>
                            }
                        >
                            {error}
                        </Alert>
                    )}

                    {loading && (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2">Cargando notificaciones...</Typography>
                        </Box>
                    )}

                    {data && (
                        <>
                            {/* Estadísticas */}
                            <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                                <Typography variant="h6" gutterBottom>
                                    🚨 Pagos Urgentes para Tesorería
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={`${data.estadisticas.totalTransportes} Transportes`}
                                        color="warning"
                                        size="small"
                                        icon={<LocalShipping />}
                                    />
                                    <Chip
                                        label={`${data.estadisticas.totalVentas} Ventas`}
                                        color="info"
                                        size="small"
                                        icon={<Business />}
                                    />
                                </Box>
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                                    Total: {formatCurrency(data.estadisticas.montoTotal)}
                                </Typography>
                            </Box>

                            <Divider />

                            {/* Lista de pagos urgentes */}
                            <List dense>
                                {allPagos.length === 0 ? (
                                    <ListItem>
                                        <ListItemText
                                            primary="No hay pagos urgentes"
                                            secondary="¡Excelente! Todo está al día."
                                        />
                                    </ListItem>
                                ) : (
                                    allPagos.map((pago, index) => (
                                        <ListItem key={`${pago.tipo}-${pago.id}-${index}`} divider>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                                <Chip
                                                    label={pago.tipo === 'TRANSPORTE' ? 'Flete' : 'Venta'}
                                                    color={getColorTipo(pago.tipo) as any}
                                                    size="small"
                                                    icon={getIconoTipo(pago.tipo)}
                                                />
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {pago.codigo}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {pago.entidad.nombre}
                                                    </Typography>
                                                    {pago.fechaLimite && (
                                                        <Typography variant="caption" color="error" display="block">
                                                            Límite: {formattedDate(pago.fechaLimite)}
                                                        </Typography>
                                                    )}
                                                    {pago.notaPago && (
                                                        <Typography variant="caption" color="textSecondary" display="block">
                                                            📝 {pago.notaPago}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Typography variant="body2" fontWeight={600} color="error">
                                                    {pago.monto ? formatCurrency(pago.monto) : 'S/N'}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))
                                )}
                            </List>

                            {/* Footer con última actualización */}
                            <Box sx={{ p: 1, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                    Última actualización: {new Date().toLocaleTimeString()}
                                </Typography>
                                <IconButton size="small" onClick={refresh}>
                                    <Refresh sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        </>
                    )}
                </Paper>
            </Collapse>
        </Box>
    );
};

export default NotificacionesPagosUrgentes;
