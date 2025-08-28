import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    Paper,
    Stack,
    Divider,
    CircularProgress,
    Link,
    Alert,
} from '@mui/material';
import { GroupWork, OpenInNew } from '@mui/icons-material';
import { getAgrupacionByOrdenCompra } from '@/services/agrupaciones/agrupaciones.request';
import { AgrupacionOrdenCompraProps } from '@/services/agrupaciones/agrupaciones.d';
import { formatCurrency } from '@/utils/functions';

interface OCsRelacionadasProps {
    ordenCompraId: number;
    codigoVentaActual: string;
    onNavigateToOC?: (ordenCompraId: number) => void;
}

const OCsRelacionadas: React.FC<OCsRelacionadasProps> = ({
    ordenCompraId,
    codigoVentaActual,
    onNavigateToOC,
}) => {
    const [agrupacion, setAgrupacion] = useState<AgrupacionOrdenCompraProps | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAgrupacion = async () => {
            try {
                setLoading(true);
                setError(null);
                const agrupacionData = await getAgrupacionByOrdenCompra(ordenCompraId);
                setAgrupacion(agrupacionData);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setAgrupacion(null); // No está agrupada, es normal
                } else {
                    setError('Error al cargar información de agrupación');
                    console.error('Error fetching agrupacion:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        if (ordenCompraId) {
            fetchAgrupacion();
        }
    }, [ordenCompraId]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ fontSize: '12px' }}>
                {error}
            </Alert>
        );
    }

    if (!agrupacion) {
        return (
            <Alert severity="info" sx={{ fontSize: '12px' }}>
                Esta OC no pertenece a ninguna agrupación
            </Alert>
        );
    }

    // Filtrar la OC actual para no mostrarla en la lista
    const otrasOCs = agrupacion.ordenesCompra?.filter(
        (oc) => oc.ordenCompra.codigoVenta !== codigoVentaActual
    ) || [];

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                bgcolor: 'rgba(25, 118, 210, 0.05)',
                border: '1px solid rgba(25, 118, 210, 0.2)',
                borderRadius: 2,
            }}
        >
            <Stack spacing={2}>
                {/* Header de la agrupación */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupWork sx={{ color: '#1976d2', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        Grupo: {agrupacion.codigoGrupo}
                    </Typography>
                </Box>

                {agrupacion.descripcion && (
                    <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic' }}>
                        {agrupacion.descripcion}
                    </Typography>
                )}

                <Divider />

                {/* Lista de OCs relacionadas */}
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                        OCs Relacionadas ({otrasOCs.length})
                    </Typography>

                    {otrasOCs.length === 0 ? (
                        <Typography variant="caption" sx={{ color: '#666' }}>
                            No hay otras OCs en este grupo
                        </Typography>
                    ) : (
                        <Stack spacing={1}>
                            {otrasOCs.map((ocAgrupada) => {
                                const oc = ocAgrupada.ordenCompra;
                                return (
                                    <Paper
                                        key={oc.id}
                                        elevation={1}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: '#fff',
                                            borderRadius: 1,
                                            cursor: onNavigateToOC ? 'pointer' : 'default',
                                            transition: 'all 0.2s',
                                            '&:hover': onNavigateToOC ? {
                                                bgcolor: '#f5f5f5',
                                                transform: 'translateY(-1px)',
                                                boxShadow: 2,
                                            } : {},
                                        }}
                                        onClick={() => onNavigateToOC?.(oc.id)}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                                        {oc.codigoVenta}
                                                    </Typography>
                                                    {onNavigateToOC && (
                                                        <OpenInNew sx={{ fontSize: 14, color: '#666' }} />
                                                    )}
                                                </Box>

                                                <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                                    Cliente: {oc.cliente?.razonSocial || 'Sin cliente'}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ textAlign: 'right' }}>
                                                <Chip
                                                    label={formatCurrency(Number(oc.montoVenta || 0))}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#e8f5e8',
                                                        color: '#2e7d32',
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    )}
                </Box>

                {/* Total del grupo */}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        Total del Grupo:
                    </Typography>
                    <Chip
                        label={formatCurrency(
                            agrupacion.ordenesCompra?.reduce(
                                (total, oc) => total + Number(oc.ordenCompra.montoVenta || 0),
                                0
                            ) || 0
                        )}
                        sx={{
                            bgcolor: '#1976d2',
                            color: '#fff',
                            fontWeight: 700,
                        }}
                    />
                </Box>
            </Stack>
        </Paper>
    );
};

export default OCsRelacionadas;
