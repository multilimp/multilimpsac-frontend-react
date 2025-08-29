import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Chip,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Button,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { Spin, notification, Modal } from 'antd';
import { StockWithDetails } from '@/types/almacen.types';
import { deleteStock } from '@/services/almacen/almacen.requests';
import { formattedDate } from '@/utils/functions';

interface StockTableProps {
    data: StockWithDetails[];
    loading: boolean;
    onEdit: (stock: StockWithDetails) => void;
    onReload: () => void;
}

const StockTable: React.FC<StockTableProps> = ({
    data,
    loading,
    onEdit,
    onReload,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedStock, setSelectedStock] = useState<StockWithDetails | null>(null);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [almacenFilter, setAlmacenFilter] = useState<string>('all');
    const [stockLevelFilter, setStockLevelFilter] = useState<'all' | 'low' | 'normal' | 'high'>('all');
    const [minStock, setMinStock] = useState<string>('');
    const [maxStock, setMaxStock] = useState<string>('');

    // Obtener almacenes únicos para el filtro
    const almacenes = useMemo(() => {
        const almacenesUnicos = data
            .map(s => ({ id: s.almacen.id, nombre: s.almacen.nombre }))
            .filter((almacen, index, self) =>
                self.findIndex(a => a.id === almacen.id) === index
            );
        return almacenesUnicos;
    }, [data]);

    // Datos filtrados
    const filteredData = useMemo(() => {
        return data.filter(stock => {
            const matchesSearch =
                stock.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                stock.almacen.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (stock.producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesAlmacen = almacenFilter === 'all' || stock.almacen.id.toString() === almacenFilter;

            const stockValue = Number(stock.cantidad);
            const matchesStockLevel = (() => {
                switch (stockLevelFilter) {
                    case 'low': return stockValue <= 10;
                    case 'normal': return stockValue > 10 && stockValue <= 100;
                    case 'high': return stockValue > 100;
                    default: return true;
                }
            })();

            const matchesMinStock = !minStock || stockValue >= Number(minStock);
            const matchesMaxStock = !maxStock || stockValue <= Number(maxStock);

            return matchesSearch && matchesAlmacen && matchesStockLevel && matchesMinStock && matchesMaxStock;
        });
    }, [data, searchTerm, almacenFilter, stockLevelFilter, minStock, maxStock]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setAlmacenFilter('all');
        setStockLevelFilter('all');
        setMinStock('');
        setMaxStock('');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, stock: StockWithDetails) => {
        setAnchorEl(event.currentTarget);
        setSelectedStock(stock);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedStock(null);
    };

    const handleEdit = () => {
        if (selectedStock) {
            onEdit(selectedStock);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (!selectedStock) return;

        Modal.confirm({
            title: '¿Estás seguro?',
            content: `¿Deseas eliminar el stock del producto "${selectedStock.producto.nombre}" en el almacén "${selectedStock.almacen.nombre}"?`,
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteStock(selectedStock.productoId, selectedStock.almacenId);
                    notification.success({
                        message: 'Éxito',
                        description: 'Stock eliminado correctamente',
                    });
                    onReload();
                } catch (error) {
                    console.error('Error al eliminar stock:', error);
                    notification.error({
                        message: 'Error',
                        description: 'No se pudo eliminar el stock',
                    });
                }
            },
        });
        handleMenuClose();
    };

    const getStockLevelColor = (cantidad: number) => {
        if (cantidad <= 10) return 'error';
        if (cantidad <= 100) return 'warning';
        return 'success';
    };

    const getStockLevelLabel = (cantidad: number) => {
        if (cantidad <= 10) return 'Bajo';
        if (cantidad <= 100) return 'Normal';
        return 'Alto';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Spin size="large" tip="Cargando stock..." />
            </Box>
        );
    }

    if (data.length === 0 && searchTerm === '' && almacenFilter === 'all' && stockLevelFilter === 'all' && !minStock && !maxStock) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No hay stock registrado
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Agrega stock para comenzar
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Filtros */}
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Filtros de Stock
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ minWidth: 300, flex: 1 }}>
                            <TextField
                                fullWidth
                                label="Buscar"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Producto, almacén o descripción..."
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                            />
                        </Box>

                        <Box sx={{ minWidth: 200 }}>
                            <FormControl fullWidth>
                                <InputLabel>Almacén</InputLabel>
                                <Select
                                    value={almacenFilter}
                                    label="Almacén"
                                    onChange={(e) => setAlmacenFilter(e.target.value)}
                                >
                                    <MenuItem value="all">Todos los almacenes</MenuItem>
                                    {almacenes.map((almacen) => (
                                        <MenuItem key={almacen.id} value={almacen.id.toString()}>
                                            {almacen.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ minWidth: 160 }}>
                            <FormControl fullWidth>
                                <InputLabel>Nivel de Stock</InputLabel>
                                <Select
                                    value={stockLevelFilter}
                                    label="Nivel de Stock"
                                    onChange={(e) => setStockLevelFilter(e.target.value as 'all' | 'low' | 'normal' | 'high')}
                                >
                                    <MenuItem value="all">Todos</MenuItem>
                                    <MenuItem value="low">Bajo (≤10)</MenuItem>
                                    <MenuItem value="normal">Normal (11-100)</MenuItem>
                                    <MenuItem value="high">Alto (&gt;100)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ minWidth: 120 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleClearFilters}
                                startIcon={<ClearIcon />}
                            >
                                Limpiar
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ minWidth: 150 }}>
                            <TextField
                                fullWidth
                                label="Stock mínimo"
                                type="number"
                                variant="outlined"
                                value={minStock}
                                onChange={(e) => setMinStock(e.target.value)}
                                placeholder="Ej: 5"
                            />
                        </Box>

                        <Box sx={{ minWidth: 150 }}>
                            <TextField
                                fullWidth
                                label="Stock máximo"
                                type="number"
                                variant="outlined"
                                value={maxStock}
                                onChange={(e) => setMaxStock(e.target.value)}
                                placeholder="Ej: 100"
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Mostrando {filteredData.length} de {data.length} registros de stock
                    </Typography>
                    {(searchTerm || almacenFilter !== 'all' || stockLevelFilter !== 'all' || minStock || maxStock) && (
                        <Chip
                            label="Filtros aplicados"
                            color="primary"
                            size="small"
                            onDelete={handleClearFilters}
                        />
                    )}
                </Box>
            </Paper>

            {filteredData.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                        No se encontraron registros de stock
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Intenta ajustar los filtros para ver más resultados
                    </Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Producto</strong></TableCell>
                                <TableCell><strong>Almacén</strong></TableCell>
                                <TableCell><strong>Cantidad</strong></TableCell>
                                <TableCell><strong>Unidad</strong></TableCell>
                                <TableCell><strong>Nivel</strong></TableCell>
                                <TableCell><strong>Stock Mín.</strong></TableCell>
                                <TableCell><strong>Stock Máx.</strong></TableCell>
                                <TableCell><strong>Última Actualización</strong></TableCell>
                                <TableCell align="center"><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((stock) => (
                                <TableRow key={stock.id} hover>
                                    <TableCell>{stock.id}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {stock.producto.nombre}
                                            </Typography>
                                            {stock.producto.descripcion && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {stock.producto.descripcion}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {stock.almacen.nombre}
                                        </Typography>
                                        {stock.almacen.direccion && (
                                            <Typography variant="caption" color="textSecondary">
                                                {stock.almacen.direccion}
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                            {Number(stock.cantidad).toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {stock.producto.unidadMedida || 'No especificada'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStockLevelLabel(Number(stock.cantidad))}
                                            size="small"
                                            color={getStockLevelColor(Number(stock.cantidad))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            -
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            -
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formattedDate(stock.updatedAt)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, stock)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                    Editar
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                    Eliminar
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); onReload(); }}>
                    <RefreshIcon sx={{ mr: 1, fontSize: 20 }} />
                    Actualizar
                </MenuItem>
            </Menu>
        </>
    );
};

export default StockTable;
