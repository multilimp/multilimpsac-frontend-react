import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Chip,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    Divider,
    Stack,
    Avatar,
    Button,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    LocalShipping,
    Business,
    Person,
    LocationOn,
    Inventory,
    ExpandMore,
    ExpandLess,
    Print,
    Search,
    Clear,
    Description,
    PictureAsPdf,
} from '@mui/icons-material';
import { CargosEntregaData } from '@/services/print/print.requests';
import { getCargosEntregaData, printCargosEntregaMonochrome } from '@/services/print/printMonochrome.requests'; interface CargosEntregaTableProps {
    fechaInicio: string;
    fechaFin: string;
}

interface OpRow {
    id: number;
    numero: number;
    codigoOp: string;
    ocf: string | null;
    estadoOp: string | null;
    fechaProgramada: string | null;
    cartaCci?: string | null;
    cartaGarantia?: string | null;
    productos: Array<{
        codigo: string;
        descripcion: string;
        cantidad: number;
    }>;
    proveedor: {
        razonSocial: string;
        contacto?: {
            nombre: string;
            telefono: string;
            cargo?: string;
        };
    };
    transporteAsignado?: {
        transporte: {
            razonSocial: string;
            ruc: string;
            direccion?: string;
            telefono?: string;
        };
        contactoTransporte?: {
            nombre: string;
            telefono: string;
            cargo?: string;
        };
        codigoTransporte: string;
        direccion?: string;
        montoFlete?: number;
        notaTransporte?: string;
        almacen?: {
            nombre: string;
            direccion?: string;
        };
    };
    destino: {
        tipo: string;
        cliente?: {
            razonSocial: string;
        };
        direccion: string;
        distrito: string;
        provincia: string;
        departamento: string;
        referencia?: string;
        contacto?: {
            nombre: string;
            telefono: string;
            cargo?: string;
        };
    };
    observacion?: string;
}

const CargosEntregaTable: React.FC<CargosEntregaTableProps> = ({ fechaInicio, fechaFin }) => {
    const [data, setData] = useState<CargosEntregaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [printing, setPrinting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getCargosEntregaData(fechaInicio, fechaFin);
                setData(result);
            } catch (error) {
                console.error('Error al cargar datos de Reporte de Programación:', error);
            } finally {
                setLoading(false);
            }
        };

        if (fechaInicio && fechaFin) {
            fetchData();
        }
    }, [fechaInicio, fechaFin]);

    const toggleRowExpansion = (opId: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(opId)) {
            newExpanded.delete(opId);
        } else {
            newExpanded.add(opId);
        }
        setExpandedRows(newExpanded);
    };

    const handlePrint = async () => {
        try {
            setPrinting(true);
            await printCargosEntregaMonochrome(fechaInicio, fechaFin);
        } catch (error) {
            console.error('Error al imprimir:', error);
        } finally {
            setPrinting(false);
        }
    };

    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return 'S/ 0.00';
        return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Filtrar datos basado en el término de búsqueda
    const filteredData = useMemo(() => {
        if (!data || !searchTerm.trim()) return data;

        const term = searchTerm.toLowerCase().trim();
        const filteredFechasConCargos = data.fechasConCargos.map(fechaGroup => ({
            ...fechaGroup,
            ops: fechaGroup.ops.filter(op =>
                op.codigoOp.toLowerCase().includes(term) ||
                op.proveedor.razonSocial.toLowerCase().includes(term) ||
                op.destino.direccion.toLowerCase().includes(term) ||
                op.destino.distrito.toLowerCase().includes(term) ||
                op.destino.provincia.toLowerCase().includes(term) ||
                (op.transporteAsignado?.transporte.razonSocial.toLowerCase().includes(term))
            )
        })).filter(fechaGroup => fechaGroup.ops.length > 0);

        return {
            ...data,
            fechasConCargos: filteredFechasConCargos
        };
    }, [data, searchTerm]);

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" align="center">
                        Cargando datos de Reporte de Programación...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (!data || !data.fechasConCargos || data.fechasConCargos.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" align="center" color="text.secondary">
                        No se encontraron datos de Reporte de Programación para el período seleccionado
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader
                title={
                    <Box display="flex" alignItems="center" gap={1}>
                        <LocalShipping color="primary" />
                        <Typography variant="h6">
                            Reporte de Programación
                        </Typography>
                    </Box>
                }
                subheader={`Período: ${data.fechaInicio} al ${data.fechaFin}`}
                action={
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Print />}
                        onClick={handlePrint}
                        disabled={printing}
                        size="small"
                    >
                        {printing ? 'Imprimiendo...' : 'Imprimir'}
                    </Button>
                }
            />
            <CardContent>
                {/* Campo de búsqueda */}
                <Box sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Buscar por código OP, proveedor, destino..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        onClick={() => setSearchTerm('')}
                                        edge="end"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {searchTerm && filteredData && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {filteredData.fechasConCargos.reduce((total, fecha) => total + fecha.ops.length, 0)} resultados encontrados
                        </Typography>
                    )}
                </Box>

                {filteredData && filteredData.fechasConCargos.map((fechaGroup, fechaIndex) => (
                    <Box key={fechaIndex} mb={4}>
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 2,
                                pb: 1,
                                borderBottom: '2px solid',
                                borderColor: 'primary.main',
                                color: 'primary.main'
                            }}
                        >
                            📅 {fechaGroup.fecha}
                        </Typography>

                        <TableContainer component={Paper} elevation={2}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 'bold', width: 50 }}></TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Código OP</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha Programada</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Transporte</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Flete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fechaGroup.ops.map((op: OpRow) => (
                                        <React.Fragment key={op.id}>
                                            <TableRow
                                                sx={{
                                                    '&:hover': { bgcolor: 'grey.50' },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => toggleRowExpansion(op.id)}
                                            >
                                                <TableCell>
                                                    <IconButton size="small">
                                                        {expandedRows.has(op.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {op.codigoOp}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {op.fechaProgramada ? new Date(op.fechaProgramada).toLocaleDateString('es-PE') : '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {op.proveedor.razonSocial}
                                                        </Typography>
                                                        {op.proveedor.contacto && (
                                                            <Typography variant="caption" color="text.secondary">
                                                                {op.proveedor.contacto.nombre}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {op.transporteAsignado ? (
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {op.transporteAsignado.transporte.razonSocial}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {op.transporteAsignado.codigoTransporte}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Sin asignar
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {op.destino.tipo}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {op.destino.distrito}, {op.destino.provincia}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="body2" fontWeight="medium" color="primary">
                                                        {formatCurrency(op.transporteAsignado?.montoFlete)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell colSpan={10} sx={{ py: 0 }}>
                                                    <Collapse in={expandedRows.has(op.id)} timeout="auto" unmountOnExit>
                                                        <Box sx={{ p: 2, bgcolor: 'grey.25' }}>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                                                {/* Productos */}
                                                                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                                                                    <Card variant="outlined" sx={{ height: 'fit-content' }}>
                                                                        <CardHeader
                                                                            title={
                                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                                    <Inventory fontSize="small" />
                                                                                    <Typography variant="subtitle2">Productos</Typography>
                                                                                </Box>
                                                                            }
                                                                            sx={{ pb: 1 }}
                                                                        />
                                                                        <CardContent sx={{ pt: 0 }}>
                                                                            {op.productos && op.productos.length > 0 ? (
                                                                                <Stack spacing={1}>
                                                                                    {op.productos.map((producto, idx) => (
                                                                                        <Box key={idx} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                                                            <Typography variant="body2" fontWeight="medium">
                                                                                                {producto.codigo} - {producto.descripcion}
                                                                                            </Typography>
                                                                                            <Typography variant="caption" color="text.secondary">
                                                                                                Cantidad: {producto.cantidad}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    ))}
                                                                                </Stack>
                                                                            ) : (
                                                                                <Typography variant="body2" color="text.secondary">
                                                                                    Sin productos
                                                                                </Typography>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>
                                                                </Box>

                                                                {/* Detalles de Transporte */}
                                                                <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                                                                    <Card variant="outlined" sx={{ height: 'fit-content' }}>
                                                                        <CardHeader
                                                                            title={
                                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                                    <LocalShipping fontSize="small" />
                                                                                    <Typography variant="subtitle2">Transporte</Typography>
                                                                                </Box>
                                                                            }
                                                                            sx={{ pb: 1 }}
                                                                        />
                                                                        <CardContent sx={{ pt: 0 }}>
                                                                            {op.transporteAsignado ? (
                                                                                <Stack spacing={1}>
                                                                                    <Box>
                                                                                        <Typography variant="body2" fontWeight="medium">
                                                                                            {op.transporteAsignado.transporte.razonSocial}
                                                                                        </Typography>
                                                                                        <Typography variant="caption" color="text.secondary">
                                                                                            RUC: {op.transporteAsignado.transporte.ruc}
                                                                                        </Typography>
                                                                                    </Box>

                                                                                    {op.transporteAsignado.contactoTransporte && (
                                                                                        <Box>
                                                                                            <Typography variant="body2">
                                                                                                <Person fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                                                                {op.transporteAsignado.contactoTransporte.nombre}
                                                                                            </Typography>
                                                                                            {op.transporteAsignado.contactoTransporte.telefono && (
                                                                                                <Typography variant="caption" color="text.secondary">
                                                                                                    📞 {op.transporteAsignado.contactoTransporte.telefono}
                                                                                                </Typography>
                                                                                            )}
                                                                                        </Box>
                                                                                    )}

                                                                                    {op.transporteAsignado.almacen && (
                                                                                        <Box>
                                                                                            <Typography variant="body2">
                                                                                                <Business fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                                                                Almacén: {op.transporteAsignado.almacen.nombre}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )}

                                                                                    {op.transporteAsignado.notaTransporte && (
                                                                                        <Box>
                                                                                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                                                                Nota: {op.transporteAsignado.notaTransporte}
                                                                                            </Typography>
                                                                                        </Box>
                                                                                    )}
                                                                                </Stack>
                                                                            ) : (
                                                                                <Typography variant="body2" color="text.secondary">
                                                                                    Transporte no asignado
                                                                                </Typography>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>
                                                                </Box>

                                                                {/* Destino */}
                                                                <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                                                    <Card variant="outlined">
                                                                        <CardHeader
                                                                            title={
                                                                                <Box display="flex" alignItems="center" gap={1}>
                                                                                    <LocationOn fontSize="small" />
                                                                                    <Typography variant="subtitle2">Destino de Entrega</Typography>
                                                                                </Box>
                                                                            }
                                                                            sx={{ pb: 1 }}
                                                                        />
                                                                        <CardContent sx={{ pt: 0 }}>
                                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                                                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                                                                                    <Typography variant="body2" fontWeight="medium">
                                                                                        Tipo: {op.destino.tipo}
                                                                                    </Typography>
                                                                                    {op.destino.cliente && (
                                                                                        <Typography variant="body2">
                                                                                            Cliente: {op.destino.cliente.razonSocial}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                                <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                                                                                    <Typography variant="body2">
                                                                                        📍 {op.destino.direccion}
                                                                                    </Typography>
                                                                                    <Typography variant="body2">
                                                                                        📍 {op.destino.distrito}, {op.destino.provincia}, {op.destino.departamento}
                                                                                    </Typography>
                                                                                    {op.destino.referencia && (
                                                                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                                                            Ref: {op.destino.referencia}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                                {op.destino.contacto && (
                                                                                    <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                                                                        <Divider sx={{ my: 1 }} />
                                                                                        <Typography variant="body2" fontWeight="medium">
                                                                                            <Person fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                                                                                            Contacto: {op.destino.contacto.nombre}
                                                                                        </Typography>
                                                                                        {op.destino.contacto.cargo && (
                                                                                            <Typography variant="caption" color="text.secondary">
                                                                                                Cargo: {op.destino.contacto.cargo}
                                                                                            </Typography>
                                                                                        )}
                                                                                        {op.destino.contacto.telefono && (
                                                                                            <Typography variant="caption" color="text.secondary">
                                                                                                📞 {op.destino.contacto.telefono}
                                                                                            </Typography>
                                                                                        )}
                                                                                    </Box>
                                                                                )}
                                                                            </Box>
                                                                        </CardContent>
                                                                    </Card>
                                                                </Box>

                                                                {/* Documentos: Carta CCI y Carta de Garantía */}
                                                                {(op.cartaCci || op.cartaGarantia) && (
                                                                    <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                                                        <Card variant="outlined">
                                                                            <CardHeader
                                                                                title={
                                                                                    <Box display="flex" alignItems="center" gap={1}>
                                                                                        <Description fontSize="small" />
                                                                                        <Typography variant="subtitle2">Documentos</Typography>
                                                                                    </Box>
                                                                                }
                                                                                sx={{ pb: 1 }}
                                                                            />
                                                                            <CardContent sx={{ pt: 0 }}>
                                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                                                                    {op.cartaCci && (
                                                                                        <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                gap: 1,
                                                                                                p: 1.5,
                                                                                                bgcolor: 'grey.50',
                                                                                                borderRadius: 1,
                                                                                                border: '1px solid',
                                                                                                borderColor: 'grey.300'
                                                                                            }}>
                                                                                                <PictureAsPdf color="error" />
                                                                                                <Box sx={{ flex: 1 }}>
                                                                                                    <Typography variant="body2" fontWeight="medium">
                                                                                                        Carta CCI
                                                                                                    </Typography>
                                                                                                    <Button
                                                                                                        size="small"
                                                                                                        variant="text"
                                                                                                        color="primary"
                                                                                                        href={op.cartaCci}
                                                                                                        target="_blank"
                                                                                                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                                                                                                    >
                                                                                                        Ver documento
                                                                                                    </Button>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    )}
                                                                                    {op.cartaGarantia && (
                                                                                        <Box sx={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                                                            <Box sx={{
                                                                                                display: 'flex',
                                                                                                alignItems: 'center',
                                                                                                gap: 1,
                                                                                                p: 1.5,
                                                                                                bgcolor: 'grey.50',
                                                                                                borderRadius: 1,
                                                                                                border: '1px solid',
                                                                                                borderColor: 'grey.300'
                                                                                            }}>
                                                                                                <PictureAsPdf color="error" />
                                                                                                <Box sx={{ flex: 1 }}>
                                                                                                    <Typography variant="body2" fontWeight="medium">
                                                                                                        Carta de Garantía
                                                                                                    </Typography>
                                                                                                    <Button
                                                                                                        size="small"
                                                                                                        variant="text"
                                                                                                        color="primary"
                                                                                                        href={op.cartaGarantia}
                                                                                                        target="_blank"
                                                                                                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                                                                                                    >
                                                                                                        Ver documento
                                                                                                    </Button>
                                                                                                </Box>
                                                                                            </Box>
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Box>
                                                                )}

                                                                {/* Observaciones */}
                                                                {op.observacion && (
                                                                    <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                                                        <Card variant="outlined">
                                                                            <CardContent>
                                                                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                                                    Observaciones:
                                                                                </Typography>
                                                                                <Typography variant="body2" sx={{ fontStyle: 'italic', bgcolor: 'grey.50', p: 1, borderRadius: 1 }}>
                                                                                    {op.observacion}
                                                                                </Typography>
                                                                            </CardContent>
                                                                        </Card>
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

export default CargosEntregaTable;