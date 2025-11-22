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
    TablePagination,
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
import { Producto } from '@/types/almacen.types';
import { deleteProducto } from '@/services/almacen/almacen.requests';
import { formattedDate, formatCurrency } from '@/utils/functions';

interface ProductosTableProps {
    data: Producto[];
    loading: boolean;
    onEdit: (producto: Producto) => void;
    onReload: () => void;
}

const ProductosTable: React.FC<ProductosTableProps> = ({
    data,
    loading,
    onEdit,
    onReload,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [unidadMedidaFilter, setUnidadMedidaFilter] = useState<string>('all');

    // Obtener unidades de medida únicas para el filtro
    const unidadesMedida = useMemo(() => {
        const unidades = data
            .map(p => p.unidadMedida)
            .filter((unidad, index, self) => unidad && self.indexOf(unidad) === index);
        return unidades;
    }, [data]);

    // Datos filtrados
    const filteredData = useMemo(() => {
        return data.filter(producto => {
            const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && producto.estado) ||
                (statusFilter === 'inactive' && !producto.estado);

            const matchesUnidad = unidadMedidaFilter === 'all' ||
                producto.unidadMedida === unidadMedidaFilter;

            return matchesSearch && matchesStatus && matchesUnidad;
        });
    }, [data, searchTerm, statusFilter, unidadMedidaFilter]);

    // Datos paginados
    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setUnidadMedidaFilter('all');
        setPage(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, producto: Producto) => {
        setAnchorEl(event.currentTarget);
        setSelectedProducto(producto);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProducto(null);
    };

    const handleEdit = () => {
        if (selectedProducto) {
            onEdit(selectedProducto);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (!selectedProducto) return;

        Modal.confirm({
            title: '¿Estás seguro?',
            content: `¿Deseas eliminar el producto "${selectedProducto.nombre}"?`,
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteProducto(selectedProducto.id);
                    notification.success({
                        message: 'Éxito',
                        description: 'Producto eliminado correctamente',
                    });
                    onReload();
                } catch (error) {
                    console.error('Error al eliminar producto:', error);
                    notification.error({
                        message: 'Error',
                        description: 'No se pudo eliminar el producto',
                    });
                }
            },
        });
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Spin size="large" tip="Cargando productos..." />
            </Box>
        );
    }

    if (data.length === 0 && searchTerm === '' && statusFilter === 'all' && unidadMedidaFilter === 'all') {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No hay productos registrados
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Agrega un nuevo producto para comenzar
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {/* Filtros */}
            <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Filtros de Productos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ minWidth: 300, flex: 1 }}>
                            <TextField
                                fullWidth
                                label="Buscar producto"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Nombre o descripción..."
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                            />
                        </Box>

                        <Box sx={{ minWidth: 200 }}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Estado"
                                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                                >
                                    <MenuItem value="all">Todos</MenuItem>
                                    <MenuItem value="active">Activos</MenuItem>
                                    <MenuItem value="inactive">Inactivos</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ minWidth: 200 }}>
                            <FormControl fullWidth>
                                <InputLabel>Unidad de Medida</InputLabel>
                                <Select
                                    value={unidadMedidaFilter}
                                    label="Unidad de Medida"
                                    onChange={(e) => setUnidadMedidaFilter(e.target.value)}
                                >
                                    <MenuItem value="all">Todas</MenuItem>
                                    {unidadesMedida.map((unidad) => (
                                        <MenuItem key={unidad} value={unidad}>
                                            {unidad}
                                        </MenuItem>
                                    ))}
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
                </Box>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Mostrando {filteredData.length} de {data.length} productos
                    </Typography>
                    {(searchTerm || statusFilter !== 'all' || unidadMedidaFilter !== 'all') && (
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
                        No se encontraron productos
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Intenta ajustar los filtros para ver más resultados
                    </Typography>
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper} elevation={2}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>ID</strong></TableCell>
                                    <TableCell><strong>Nombre</strong></TableCell>
                                    <TableCell><strong>Descripción</strong></TableCell>
                                    <TableCell><strong>Unidad Medida</strong></TableCell>
                                    <TableCell><strong>Precio Base</strong></TableCell>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    <TableCell><strong>Stock en Almacenes</strong></TableCell>
                                    <TableCell><strong>Fecha Creación</strong></TableCell>
                                    <TableCell align="center"><strong>Acciones</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedData.map((producto) => (
                                    <TableRow key={producto.id} hover>
                                        <TableCell>{producto.id}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {producto.nombre}
                                            </Typography>
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
                                                title={producto.descripcion}
                                            >
                                                {producto.descripcion || 'Sin descripción'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {producto.unidadMedida || 'No especificada'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontFamily="monospace">
                                                {producto.precioBase ? formatCurrency(Number(producto.precioBase)) : 'No definido'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={producto.estado ? 'Activo' : 'Inactivo'}
                                                size="small"
                                                color={producto.estado ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${producto.stockProductos?.length || 0} almacenes`}
                                                size="small"
                                                color={producto.stockProductos?.length ? 'primary' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {formattedDate(producto.createdAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, producto)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </>
            )
            }
            < Menu
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
            </Menu >
        </>
    );
};

export default ProductosTable;
