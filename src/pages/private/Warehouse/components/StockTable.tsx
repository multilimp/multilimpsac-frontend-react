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
            content: `¿Deseas eliminar el stock de "${selectedStock.producto?.nombre}" en "${selectedStock.almacen?.nombre}"?`,
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

    const getStockLevel = (cantidad: number): { color: 'error' | 'warning' | 'success', label: string } => {
        if (cantidad === 0) return { color: 'error', label: 'Sin stock' };
        if (cantidad <= 10) return { color: 'warning', label: 'Stock bajo' };
        return { color: 'success', label: 'Stock normal' };
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Spin size="large" tip="Cargando stock..." />
            </Box>
        );
    }

    if (data.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No hay stock registrado
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Agrega stock para comenzar a gestionar el inventario
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
                            <TableCell><strong>Producto</strong></TableCell>
                            <TableCell><strong>Almacén</strong></TableCell>
                            <TableCell><strong>Cantidad</strong></TableCell>
                            <TableCell><strong>Estado Stock</strong></TableCell>
                            <TableCell><strong>Unidad Medida</strong></TableCell>
                            <TableCell><strong>Última Actualización</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((stock) => {
                            const stockLevel = getStockLevel(stock.cantidad);

                            return (
                                <TableRow key={stock.id} hover>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {stock.producto?.nombre || 'Producto no encontrado'}
                                            </Typography>
                                            {stock.producto?.descripcion && (
                                                <Typography
                                                    variant="caption"
                                                    color="textSecondary"
                                                    sx={{
                                                        maxWidth: 200,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        display: 'block'
                                                    }}
                                                >
                                                    {stock.producto.descripcion}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {stock.almacen?.nombre || 'Almacén no encontrado'}
                                            </Typography>
                                            {stock.almacen?.ciudad && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {stock.almacen.ciudad}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            color={stockLevel.color === 'error' ? 'error.main' :
                                                stockLevel.color === 'warning' ? 'warning.main' : 'text.primary'}
                                        >
                                            {stock.cantidad}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={stockLevel.label}
                                            size="small"
                                            color={stockLevel.color}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {stock.producto?.unidadMedida || 'No especificada'}
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
                            );
                        })}
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

export default StockTable;
