import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button as MuiButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Alert,
    IconButton,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Skeleton
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from 'antd';
import { Form, Input, InputNumber, Select as AntSelect, message, Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { createPago, updatePago, getHistorialPagos, deletePago } from '@/services/pagos/pagos.requests';
import { PagoProveedorTransporte, HistorialPagos } from '@/types/pagos.types';
import { formatCurrency } from '@/utils/functions';

const { TextArea } = Input;
const { Option } = AntSelect;

interface PagosModalProps {
    open: boolean;
    onClose: () => void;
    entidadId: number;
    tipoEntidad: 'PROVEEDOR' | 'TRANSPORTE';
    entidadNombre: string;
    pagoEditar?: PagoProveedorTransporte;
    onSuccess: () => void;
}

const PagosModal: React.FC<PagosModalProps> = ({
    open,
    onClose,
    entidadId,
    tipoEntidad,
    entidadNombre,
    pagoEditar,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saldoPendiente, setSaldoPendiente] = useState(0);
    const [historialPagos, setHistorialPagos] = useState<HistorialPagos | null>(null);
    const [activeTab, setActiveTab] = useState(0); // 0: Lista, 1: Formulario
    const [editingPago, setEditingPago] = useState<PagoProveedorTransporte | undefined>(pagoEditar);

    // Resetear formulario y cargar datos cuando se abre el modal
    useEffect(() => {
        if (open) {
            // Resetear todos los estados
            setActiveTab(0);
            setEditingPago(undefined);
            setHistorialPagos(null);
            setSaldoPendiente(0);

            // Resetear formulario con valores por defecto
            form.resetFields();
            form.setFieldsValue({
                fechaPago: dayjs(),
                estado: 'A_FAVOR',
                banco: '',
                descripcion: '',
                total: undefined
            });

            // Cargar historial de pagos
            cargarHistorialPagos();
        }
    }, [open, entidadId, tipoEntidad, form]);

    // Cargar datos del pago a editar
    useEffect(() => {
        if (editingPago) {
            setActiveTab(1); // Cambiar a formulario
            form.setFieldsValue({
                fechaPago: dayjs(editingPago.fechaPago),
                banco: editingPago.banco,
                descripcion: editingPago.descripcion,
                estado: editingPago.estado,
                total: editingPago.total
            });
        } else {
            form.resetFields();
            form.setFieldsValue({
                fechaPago: dayjs(),
                estado: 'A_FAVOR'
            });
        }
    }, [editingPago, form]);

    const cargarHistorialPagos = async () => {
        try {
            setLoading(true);
            const historial = await getHistorialPagos(entidadId, tipoEntidad);
            setHistorialPagos(historial);
            setSaldoPendiente(historial.saldoTotalPendiente);
        } catch (error: any) {
            console.error('Error al cargar historial de pagos:', error);
            // Mejor manejo de errores para mostrar mensajes más específicos
            let errorMessage = 'Error al cargar el historial de anticipos';

            if (error?.message?.includes('Unexpected token')) {
                errorMessage = 'El backend no está respondiendo correctamente. Verifica que el servidor esté corriendo.';
            } else if (error?.response?.status === 404) {
                errorMessage = 'El endpoint de anticipos no existe en el backend.';
            } else if (error?.response?.status === 401) {
                errorMessage = 'No tienes permisos para acceder a esta información.';
            } else if (error?.response?.status === 500) {
                errorMessage = 'Error interno del servidor.';
            }

            message.error(errorMessage);
            // Establecer valores por defecto para evitar errores en la UI
            setHistorialPagos({
                pagos: [],
                saldoTotalPendiente: 0,
                totalAFavor: 0,
                totalCobrado: 0
            });
            setSaldoPendiente(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const pagoData = {
                proveedorTransporteId: entidadId,
                tipoEntidad,
                fechaPago: values.fechaPago.format('YYYY-MM-DD'),
                banco: values.banco,
                descripcion: values.descripcion,
                estado: values.estado,
                total: values.total,
                saldoPendiente: calcularNuevoSaldo(values.estado, values.total)
            };

            if (editingPago) {
                await updatePago(editingPago.id!, pagoData);
                message.success('Anticipo actualizado exitosamente');
            } else {
                await createPago(pagoData);
                message.success('Anticipo registrado exitosamente');
            }

            await cargarHistorialPagos(); // Recargar historial
            setActiveTab(0); // Volver a la lista
            setEditingPago(undefined);

            // Resetear formulario después de envío exitoso
            form.resetFields();
            form.setFieldsValue({
                fechaPago: dayjs(),
                estado: 'A_FAVOR',
                banco: '',
                descripcion: '',
                total: undefined
            });

            onSuccess();
        } catch (error) {
            message.error('Error al procesar el anticipo');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pago: PagoProveedorTransporte) => {
        setEditingPago(pago);
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePago(id);
            message.success('Anticipo eliminado exitosamente');
            await cargarHistorialPagos(); // Recargar historial
        } catch (error) {
            message.error('Error al eliminar el anticipo');
            console.error('Error:', error);
        }
    };

    const handleAddNew = () => {
        setEditingPago(undefined);
        setActiveTab(1);
    };

    const handleCancel = () => {
        // Resetear formulario y estados
        form.resetFields();
        form.setFieldsValue({
            fechaPago: dayjs(),
            estado: 'A_FAVOR',
            banco: '',
            descripcion: '',
            total: undefined
        });

        setEditingPago(undefined);
        setActiveTab(0);
    };

    const handleClose = () => {
        // Resetear todo el estado antes de cerrar
        handleCancel();
        onClose();
    };

    const calcularNuevoSaldo = (estado: string, total: number): number => {
        if (!editingPago) {
            // Para nuevo pago
            if (estado === 'A_FAVOR') {
                return saldoPendiente + total;
            } else {
                return saldoPendiente - total;
            }
        } else {
            // Para edición, recalcular el impacto
            const saldoSinEstePago = saldoPendiente - (editingPago.estado === 'A_FAVOR' ? editingPago.total : -editingPago.total);
            if (estado === 'A_FAVOR') {
                return saldoSinEstePago + total;
            } else {
                return saldoSinEstePago - total;
            }
        }
    };

    const bancosComunes = [
        'BCP',
        'Interbank',
        'BBVA',
        'Scotiabank',
        'BanBif',
        'Pichincha',
        'Citibank',
        'Otro'
    ];

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="pagos-modal-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800,
                maxWidth: '95vw',
                maxHeight: '90vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" component="h2">
                        Gestión de Anticipos
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                    {tipoEntidad === 'PROVEEDOR' ? 'Proveedor' : 'Transporte'}: {entidadNombre}
                </Typography>

                {loading ? (
                    <Box mb={2}>

                        <Stack direction="row" spacing={2}>
                            <Skeleton
                                variant="rounded"
                                height={32}
                                width={180}
                                sx={{ bgcolor: 'grey.200' }}
                            />
                            {/* <Skeleton
                                variant="rounded"
                                height={32}
                                width={120}
                                sx={{ bgcolor: 'grey.200' }}
                            />
                            <Skeleton
                                variant="rounded"
                                height={32}
                                width={140}
                                sx={{ bgcolor: 'grey.200' }}
                            /> */}
                        </Stack>
                    </Box>
                ) : historialPagos && (
                    <Stack direction="row" spacing={2} mb={2}>
                        <Chip
                            label={`Anticipo Disponible: ${formatCurrency(historialPagos.totalAFavor - historialPagos.totalCobrado)}`}
                            color={(historialPagos.totalAFavor - historialPagos.totalCobrado) >= 0 ? 'success' : 'warning'}
                        />
                        {/* <Chip
                            label={`Total Anticipos: ${formatCurrency(historialPagos.totalAFavor)}`}
                            color="info"
                        />
                        <Chip
                            label={`Anticipado Aplicado: ${formatCurrency(historialPagos.totalCobrado)}`}
                            color="secondary"
                        /> */}
                    </Stack>
                )}

                <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
                    <Tab label="Lista de Anticipos" />
                    <Tab label={editingPago ? 'Editar Anticipo' : 'Nuevo Anticipo'} />
                </Tabs>

                {activeTab === 0 && (
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Historial de Anticipos</Typography>
                            <Button
                                type="primary"
                                icon={<AddIcon />}
                                onClick={handleAddNew}
                            >
                                Nuevo Anticipo
                            </Button>
                        </Box>

                        {loading ? (
                            // Skeleton específico para la tabla
                            <Box>
                                {/* Header de la tabla */}
                                <Skeleton
                                    variant="rectangular"
                                    height={56}
                                    sx={{ mb: 1, bgcolor: 'grey.200', rounded: 1 }}
                                />
                                {/* Filas de la tabla */}
                                {[...Array(2)].map((_, index) => (
                                    <Skeleton
                                        key={`table-skeleton-${index}`}
                                        variant="rectangular"
                                        height={48}
                                        sx={{
                                            mb: index < 1 ? 1 : 0,
                                            bgcolor: 'grey.200'
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : historialPagos && historialPagos.pagos.length > 0 ? (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Fecha</TableCell>
                                            <TableCell>Banco</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Estado</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                            <TableCell align="center">Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historialPagos.pagos.map((pago) => (
                                            <TableRow key={pago.id}>
                                                <TableCell>{dayjs(pago.fechaPago).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{pago.banco}</TableCell>
                                                <TableCell>{pago.descripcion}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={pago.estado === 'A_FAVOR' ? 'Disponible' : 'Aplicado'}
                                                        color={pago.estado === 'A_FAVOR' ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(pago.total)}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleEdit(pago)}
                                                        color="primary"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <Popconfirm
                                                        title="¿Eliminar este anticipo?"
                                                        description="Esta acción no se puede deshacer"
                                                        onConfirm={() => handleDelete(pago.id!)}
                                                        okText="Sí"
                                                        cancelText="No"
                                                    >
                                                        <IconButton size="small" color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Popconfirm>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box textAlign="center" py={4}>
                                <Typography variant="h6" color="text.secondary" mb={2}>
                                    No hay anticipos registrados
                                </Typography>
                                <Button
                                    type="primary"
                                    icon={<AddIcon />}
                                    onClick={handleAddNew}
                                >
                                    Agregar Primer Anticipo
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                {activeTab === 1 && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Stack spacing={2}>
                            {/* Fecha y Banco en la misma fila */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Form.Item
                                        name="fechaPago"
                                        label="Fecha de Anticipo"
                                        rules={[{ required: true, message: 'La fecha es requerida' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY"
                                            placeholder="Seleccionar fecha"
                                        />
                                    </Form.Item>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Form.Item
                                        name="banco"
                                        label="Banco"
                                        rules={[{ required: true, message: 'El banco es requerido' }]}
                                    >
                                        <AntSelect
                                            placeholder="Seleccionar banco"
                                            showSearch
                                            allowClear
                                        >
                                            {bancosComunes.map(banco => (
                                                <Option key={banco} value={banco}>{banco}</Option>
                                            ))}
                                        </AntSelect>
                                    </Form.Item>
                                </Box>
                            </Box>

                            <Form.Item
                                name="descripcion"
                                label="Descripción"
                                rules={[{ required: true, message: 'La descripción es requerida' }]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Descripción del anticipo"
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            {/* Estado y Total en la misma fila */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Form.Item
                                        name="estado"
                                        label="Estado"
                                        rules={[{ required: true, message: 'El estado es requerido' }]}
                                    >
                                        <AntSelect placeholder="Seleccionar estado">
                                            <Option value="A_FAVOR">Anticipo Disponible (+)</Option>
                                            <Option value="COBRADO">Anticipo Aplicado (-)</Option>
                                        </AntSelect>
                                    </Form.Item>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Form.Item
                                        name="total"
                                        label="Total"
                                        rules={[
                                            { required: true, message: 'El total es requerido' },
                                            { type: 'number', min: 0.01, message: 'El total debe ser mayor a 0' }
                                        ]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            placeholder="0.00"
                                            min={0}
                                            step={0.01}
                                            precision={2}
                                            prefix="S/"
                                        />
                                    </Form.Item>
                                </Box>
                            </Box>

                            <Form.Item shouldUpdate>
                                {({ getFieldsValue }) => {
                                    const values = getFieldsValue();
                                    const nuevoSaldo = values.estado && values.total ?
                                        calcularNuevoSaldo(values.estado, values.total) : saldoPendiente;

                                    return (
                                        <Alert severity={nuevoSaldo >= 0 ? 'success' : 'warning'}>
                                            Nuevo anticipo disponible: {formatCurrency(nuevoSaldo)}
                                        </Alert>
                                    );
                                }}
                            </Form.Item>
                        </Stack>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                            <MuiButton
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    borderColor: '#d1d5db',
                                    color: '#374151',
                                    '&:hover': {
                                        borderColor: '#9ca3af',
                                        bgcolor: '#f9fafb'
                                    }
                                }}
                            >
                                Cancelar
                            </MuiButton>
                            <MuiButton
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                onClick={() => form.submit()}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    bgcolor: '#6c5fbf',
                                    '&:hover': {
                                        bgcolor: '#5a4ea8'
                                    }
                                }}
                            >
                                {editingPago ? 'Actualizar' : 'Registrar'} Anticipo
                            </MuiButton>
                        </Box>
                    </Form>
                )}
            </Box>
        </Modal>
    );
};

export default PagosModal;