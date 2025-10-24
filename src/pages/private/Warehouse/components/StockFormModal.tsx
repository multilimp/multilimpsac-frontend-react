import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Alert,
} from '@mui/material';
import { Form, Select, InputNumber, Input, notification } from 'antd';
import { Save, Cancel } from '@mui/icons-material';
import {
    StockWithDetails,
    CreateStockData,
    UpdateStockData,
    Almacen,
    Producto
} from '@/types/almacen.types';
import { createOrUpdateStock, updateStock } from '@/services/almacen/almacen.requests';

interface StockFormModalProps {
    open: boolean;
    onClose: () => void;
    editingStock: StockWithDetails | null;
    almacenes: Almacen[];
    productos: Producto[];
}

type StockFormValues = {
  productoId: number;
  almacenId: number;
  cantidad: number;
  referencia?: string;
};

const StockFormModal: React.FC<StockFormModalProps> = ({
    open,
    onClose,
    editingStock,
    almacenes,
    productos,
}) => {
    const [form] = Form.useForm();
    const isEditing = !!editingStock;

    useEffect(() => {
        if (open) {
            if (editingStock) {
                form.setFieldsValue({
                    productoId: editingStock.productoId,
                    almacenId: editingStock.almacenId,
                    cantidad: editingStock.cantidad,
                    referencia: 'Actualización de stock',
                });
            } else {
                form.setFieldsValue({ referencia: 'Creación de stock' });
            }
        }
    }, [open, editingStock, form]);

    const handleSubmit = async (values: StockFormValues) => {
        try {
            if (isEditing && editingStock) {
                const updateData: UpdateStockData = {
                    cantidad: values.cantidad,
                    referencia: values.referencia,
                };

                await updateStock(editingStock.productoId, editingStock.almacenId, updateData);
                notification.success({
                    message: 'Éxito',
                    description: 'Stock actualizado correctamente',
                });
            } else {
                const createData: CreateStockData = {
                    productoId: values.productoId,
                    almacenId: values.almacenId,
                    cantidad: values.cantidad,
                    referencia: values.referencia,
                };

                await createOrUpdateStock(createData);
                notification.success({
                    message: 'Éxito',
                    description: 'Stock creado/actualizado correctamente',
                });
            }

            onClose();
        } catch (error) {
            console.error('Error al guardar stock:', error);
            notification.error({
                message: 'Error',
                description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} el stock`,
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const selectedProducto = productos.find(p => p.id === form.getFieldValue('productoId'));
    const selectedAlmacen = almacenes.find(a => a.id === form.getFieldValue('almacenId'));

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { minHeight: 450 }
            }}
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    {isEditing ? 'Editar Stock' : 'Agregar Stock'}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ py: 2 }}>
                    {isEditing && editingStock && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Editando stock de <strong>{editingStock.producto?.nombre}</strong> en{' '}
                            <strong>{editingStock.almacen?.nombre}</strong>
                        </Alert>
                    )}

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="productoId"
                            label="Producto"
                            rules={[
                                { required: true, message: 'Selecciona un producto' },
                            ]}
                        >
                            <Select
                                placeholder="Selecciona un producto"
                                size="large"
                                disabled={isEditing}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase()) ?? false
                                }
                            >
                                {productos.map((producto) => (
                                    <Select.Option key={producto.id} value={producto.id}>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {producto.nombre}
                                            </Typography>
                                            {producto.descripcion && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {producto.descripcion}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="almacenId"
                            label="Almacén"
                            rules={[
                                { required: true, message: 'Selecciona un almacén' },
                            ]}
                        >
                            <Select
                                placeholder="Selecciona un almacén"
                                size="large"
                                disabled={isEditing}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        ?.toLowerCase()
                                        ?.includes(input.toLowerCase()) ?? false
                                }
                            >
                                {almacenes.map((almacen) => (
                                    <Select.Option key={almacen.id} value={almacen.id}>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {almacen.nombre}
                                            </Typography>
                                            {almacen.ciudad && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {almacen.ciudad}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="cantidad"
                            label="Cantidad"
                            rules={[
                                { required: true, message: 'Ingresa la cantidad' },
                                { type: 'number', min: 0, message: 'La cantidad debe ser mayor o igual a 0' },
                            ]}
                        >
                            <InputNumber
                                placeholder="0"
                                size="large"
                                style={{ width: '100%' }}
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>

                        <Form.Item
                            name="referencia"
                            label="Referencia"
                            tooltip="Describe el motivo del movimiento (editable por el usuario)"
                        >
                            <Input
                                placeholder={isEditing ? 'Actualización de stock' : 'Creación de stock'}
                                size="large"
                                allowClear
                            />
                        </Form.Item>

                        {selectedProducto?.unidadMedida && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="textSecondary">
                                    Unidad de medida: <strong>{selectedProducto.unidadMedida}</strong>
                                </Typography>
                            </Box>
                        )}
                    </Form>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                    onClick={handleCancel}
                    variant="outlined"
                    startIcon={<Cancel />}
                    size="large"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={() => form.submit()}
                    variant="contained"
                    startIcon={<Save />}
                    size="large"
                >
                    {isEditing ? 'Actualizar' : 'Guardar'} Stock
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StockFormModal;
