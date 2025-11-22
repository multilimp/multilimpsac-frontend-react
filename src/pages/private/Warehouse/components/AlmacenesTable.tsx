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
    TablePagination,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Spin, notification, Modal } from 'antd';
import { Almacen } from '@/types/almacen.types';
import { deleteAlmacen } from '@/services/almacen/almacen.requests';
import { formattedDate } from '@/utils/functions';

interface AlmacenesTableProps {
    data: Almacen[];
    loading: boolean;
    onEdit: (almacen: Almacen) => void;
    onReload: () => void;
}

const AlmacenesTable: React.FC<AlmacenesTableProps> = ({
    data,
    loading,
    onEdit,
    onReload,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedAlmacen, setSelectedAlmacen] = useState<Almacen | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Datos paginados
    const paginatedData = useMemo(() => {
        const start = page * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }, [data, page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, almacen: Almacen) => {
        setAnchorEl(event.currentTarget);
        setSelectedAlmacen(almacen);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAlmacen(null);
    };

    const handleEdit = () => {
        if (selectedAlmacen) {
            onEdit(selectedAlmacen);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (!selectedAlmacen) return;

        Modal.confirm({
            title: '¿Estás seguro?',
            content: `¿Deseas eliminar el almacén "${selectedAlmacen.nombre}"?`,
            okText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteAlmacen(selectedAlmacen.id);
                    notification.success({
                        message: 'Éxito',
                        description: 'Almacén eliminado correctamente',
                    });
                    onReload();
                } catch (error) {
                    console.error('Error al eliminar almacén:', error);
                    notification.error({
                        message: 'Error',
                        description: 'No se pudo eliminar el almacén',
                    });
                }
            },
        });
        handleMenuClose();
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Spin size="large" tip="Cargando almacenes..." />
            </Box>
        );
    }

    if (data.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="textSecondary">
                    No hay almacenes registrados
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Agrega un nuevo almacén para comenzar
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
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Dirección</strong></TableCell>
                            <TableCell><strong>Ciudad</strong></TableCell>
                            <TableCell><strong>Stock Productos</strong></TableCell>
                            <TableCell><strong>Fecha Creación</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((almacen) => (
                            <TableRow key={almacen.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                        {almacen.nombre}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {almacen.direccion || 'No especificada'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {almacen.ciudad || 'No especificada'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${almacen.stockProductos?.length || 0} productos`}
                                        size="small"
                                        color={almacen.stockProductos?.length ? 'primary' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {formattedDate(almacen.createdAt)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, almacen)}
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
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />

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

export default AlmacenesTable;
