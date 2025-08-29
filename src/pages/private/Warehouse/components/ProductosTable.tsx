import React, { useState } from 'react';
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
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
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

    if (data.length === 0) {
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
            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Código</strong></TableCell>
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
                        {data.map((producto) => (
                            <TableRow key={producto.id} hover>
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

export default ProductosTable;
